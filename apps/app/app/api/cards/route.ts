import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { list_id, project_id, title, description, due_date, priority } = await req.json()
  if (!list_id || !project_id || !title) {
    return NextResponse.json({ error: 'list_id, project_id, and title are required' }, { status: 400 })
  }
  // Get the highest current position in this *list*
  const { data: maxPos, error: posError } = await supabase
    .from('cards')
    .select('position')
    .eq('list_id', list_id)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  if (posError && posError.code !== 'PGRST116') {
    console.error('Error getting max card position:', posError)
    return NextResponse.json({ error: posError.message }, { status: 500 })
  }

  const newPosition = (maxPos?.position || 0) + 1

  // Insert the new card
  const { data: newCard, error: insertError } = await supabase
    .from('cards')
    .insert({
      list_id,
      project_id,
      title,
      description: description || null,
      due_date: due_date || null,
      priority: priority || null,
      position: newPosition,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating card:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Return the new card, ensuring it has empty arrays to match the type
  return NextResponse.json({ 
    ...newCard, 
    assignees: [], 
    checklists: [], 
    activity: [] 
  })
}

