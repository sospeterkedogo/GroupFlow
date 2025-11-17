
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/projects
 * Fetches all projects the authenticated user has access to.
 */
export async function GET(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // We use an admin client to call the RPC
  // The RPC itself handles security by using auth.uid()
 
  const { data, error } = await supabase.rpc('get_user_projects');

  if (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * POST /api/projects
 * Creates a new project and makes the user the owner.
 */
export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, course, due_date } = await req.json();

  if (!title) {
    return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('create_project_with_owner', {
    name: title, // Match the function argument
    course: course,
    due_date: due_date,
  }).single(); // We expect one project back

  if (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}