import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
    const cardId = req.url.split('/').pop()

  // 1. Verify user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse body
  const body = await req.json()

  // 3. Dynamically build update payload
  const updatePayload: {
    position?: number
    list_id?: string
    title?: string
    description?: string
    due_date?: string | null
    priority?: string | null
  } = {}

  // Handle all possible fields
  if (body.position !== undefined) updatePayload.position = body.position
  if (body.list_id !== undefined) updatePayload.list_id = body.list_id
  if (body.title !== undefined) updatePayload.title = body.title
  if (body.description !== undefined) updatePayload.description = body.description
  if (body.due_date !== undefined) updatePayload.due_date = body.due_date
  if (body.priority !== undefined) updatePayload.priority = body.priority

  // 4. Validate
  if (Object.keys(updatePayload).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  // 5. Run the update
  const { data, error } = await supabase
    .from('cards')
    .update(updatePayload)
    .eq('id', cardId)
    .select('id, position, list_id, title, description, due_date, priority')
    .single()

  if (error) {
    console.error('Error updating card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 6. Return updated card
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cardId = req.url.split('/').pop()

  // RLS handles security
  const { error } = await supabase
    .from('cards')
    .delete()
    .eq('id', cardId)
    
  if (error) {
    console.error('Error deleting card:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return new NextResponse(null, { status: 204 })
}
