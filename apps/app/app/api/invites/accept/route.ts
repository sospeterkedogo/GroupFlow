import { NextResponse } from 'next/server';

import { createSupabaseRouteHandlerClient,  } from '@/lib/supabase/server';
import { createSupabaseAdminClient } from '@/lib/supabase/adminClient';

export async function POST(req: Request) {
  try {
    // 1. --- AUTHENTICATE INVITEE (via NEW @supabase/ssr) ---
    // This client is for getting the USER
    const supabase = createSupabaseRouteHandlerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const userId = user.id;

    // --- FROM HERE, THE LOGIC IS THE SAME ---
    const { token } = await req.json();
    if (!token) {
      return new NextResponse('Token is required', { status: 400 });
    }

    // 2. --- CALL THE SUPABASE FUNCTION ---
    // This client is for calling the ADMIN RPC
    // It uses the SERVICE_ROLE_KEY
    const supabaseAdmin = createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin.rpc('accept_invitation', {
      invite_token: token,
      authed_user_id: userId,
    });

    // 3. --- HANDLE RESPONSE FROM FUNCTION ---
    if (error) {
      console.error('[SUPABASE_RPC_ERROR]', error);
      return new NextResponse('Internal Error calling RPC', { status: 500 });
    }

    if (data.error) {
      if (data.error.includes('already a member')) return new NextResponse(data.error, { status: 409 });
      if (data.error.includes('different email')) return new NextResponse(data.error, { status: 403 });
      return new NextResponse(data.error, { status: 400 });
    }

    // 4. --- RETURN SUCCESS ---
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('[INVITE_ACCEPT_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}