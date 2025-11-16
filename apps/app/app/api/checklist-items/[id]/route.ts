import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const id = req.url.split('/').pop()
  const { text, is_done } = await req.json()
  
  const updatePayload: { text?: string; is_done?: boolean } = {}
  if (text !== undefined) updatePayload.text = text
  if (is_done !== undefined) updatePayload.is_done = is_done
  
  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // RLS ("Allow project members to update checklist items") handles security
  const { data, error } = await supabase
    .from('checklist_items')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()
    
  if (error) {
    console.error('Error updating checklist item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = req.url.split('/').pop()

  // RLS ("Allow project members to delete checklist items") handles security
  const { error } = await supabase
    .from('checklist_items')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('Error deleting checklist item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}