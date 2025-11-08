import { createClient } from '@/lib/supabase/server-route-handler'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const listId = req.url.split('/').pop()
  const { position, title } = await req.json()
  
  const updateData: { position?: number; title?: string } = {}

  if (position !== undefined) {
    updateData.position = position
  }
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 })
    }
    updateData.title = title.trim()
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('lists')
    .update(updateData)
    .eq('id', listId)
    .select('id, position, title')
    .single()

  if (error) {
    console.error('Error updating list:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listId = req.url.split('/').pop()

  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId)

  if (error) {
    console.error('Error deleting list:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
