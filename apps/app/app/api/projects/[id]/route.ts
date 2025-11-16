import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const id = req.url.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .rpc('get_project_board_details', { p_project_id: id })
    .single()

  if (error) {
    console.error('Error fetching project board:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const id = req.url.split('/').pop()
  const { name, course, due_date } = await req.json()
  const updatePayload: { name?: string; course?: string | null; due_date?: string | null } = {}

  if (name !== undefined) updatePayload.name = name
  if (course !== undefined) updatePayload.course = course
  if (due_date !== undefined) updatePayload.due_date = due_date

  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updatePayload)
    .eq('id', id)
    .select('id, name, course, due_date, progress')
    .single()

  if (error) {
    console.error(`Error updating project ${id}:`, error.message)
    return NextResponse.json({ error: 'Failed to update project. Check permissions.' }, { status: 403 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.url.split('/').pop()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting project ${id}:`, error.message)
    return NextResponse.json({ error: 'Failed to delete project. Check permissions.' }, { status: 403 })
  }

  return new NextResponse(null, { status: 204 })
}
