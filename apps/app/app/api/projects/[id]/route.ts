import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/projects/[id]
 * Fetches the full details of a single project board.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  const { id } = await params; 
  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const supabase = createSupabaseRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .rpc('get_project_board_details', { p_project_id: id })
    .single();

  if (error) {
    console.error('Error fetching project board:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/projects/[id]
 * Updates a project.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }>}
) {
  const { id } = await params;
  const { name, course, due_date } = await req.json();

  const supabase = createSupabaseRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { data, error } = await supabase
    .from('projects')
    .update({ name, course, due_date })
    .eq('id', id)
    .select('id, name, course, due_date, progress') // You only need to select what you update
    .maybeSingle();

  if (error) {
    console.error(`Error updating project ${id}:`, error.message);
    return NextResponse.json({ error: 'Failed to update project. Check permissions.' }, { status: 403 });
  }

  // If data is null, it means RLS hid the row
  if (!data) {
    return NextResponse.json({ error: 'Permission denied or Project not found' }, { status: 403 });
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/projects/[id]
 * Deletes a project.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createSupabaseRouteHandlerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  // 1. Request 'exact' count to detect RLS silent failures
  const { error, count } = await supabase
    .from('projects')
    .delete({ count: 'exact' }) 
    .eq('id', id);

  // 2. Handle genuine database crashes
  if (error) {
    console.error(`Error deleting project ${id}:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Handle "Silent Failure" (RLS said NO, or ID doesn't exist)
  if (count === 0) {
    return NextResponse.json({ 
      error: 'Project not found or you do not have permission to delete it.' 
    }, { status: 403 });
  }

  return new NextResponse(null, { status: 204 });
}