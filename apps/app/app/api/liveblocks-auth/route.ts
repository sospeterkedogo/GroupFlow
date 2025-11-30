import { Liveblocks } from "@liveblocks/node";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/adminClient"; // Import Admin

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LIVEBLOCKS_SECRET_KEY;
    if (!secret) {
      console.error("❌ LIVEBLOCKS_SECRET_KEY missing");
      return new NextResponse("Config Error", { status: 500 });
    }

    const liveblocks = new Liveblocks({ secret });
    const supabase = createSupabaseRouteHandlerClient();

    // 1. Identify User (Must use standard client to verify session cookie)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { room } = await request.json();
    if (!room) return new NextResponse("Missing room ID", { status: 400 });

    // 2. Check Permissions (USE ADMIN CLIENT)
    // We use the Admin client here to bypass RLS. 
    // If the row exists in the DB, we want to know about it, regardless of policies.
    const supabaseAdmin = createSupabaseAdminClient();
    
    const { data: collaborator, error: dbError } = await supabaseAdmin
      .from("project_collaborators")
      .select("role")
      .eq("project_id", room)
      .eq("user_id", user.id)
      .maybeSingle(); // Use maybeSingle to avoid errors on 0 rows

    if (dbError) {
       console.error("Database Error:", dbError.message);
       return new NextResponse("Database Error", { status: 500 });
    }

    if (!collaborator) {
      console.error(`⛔ ACCESS DENIED. User ${user.id} is not in project_collaborators for room ${room}`);
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 3. Authorize
    const session = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user.user_metadata.full_name || user.email || "Anonymous",
        avatar: user.user_metadata.avatar_url || "",
      },
    });

    session.allow(room, session.FULL_ACCESS);

    const { status, body } = await session.authorize();
    return new NextResponse(body, { status });

  } catch (error) {
    console.error("Auth Route Crash:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}