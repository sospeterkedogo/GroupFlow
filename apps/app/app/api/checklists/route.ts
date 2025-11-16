import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/checklists
// Creates a new checklist for a card
export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { card_id, title } = await req.json()
  if (!card_id || !title) {
    return NextResponse.json({ error: 'card_id and title are required' }, { status: 400 })
  }

  // 1. Get the max position for this card's checklists
  const { data: posData, error: posError } = await supabase
    .from('checklists')
    .select('position')
    .eq('card_id', card_id)
    .order('position', { ascending: false })
    .limit(1)
    .single()
  
  if (posError && posError.code !== 'PGRST116') { // PGRST116 = no rows found
    return NextResponse.json({ error: posError.message }, { status: 500 })
  }
  
  const newPosition = (posData?.position || 0) + 1.0

  // 2. Insert the new checklist
  // RLS ("Allow project members to create checklists") will handle security
  const { data: newList, error: insertError } = await supabase
    .from('checklists')
    .insert({
      card_id,
      title,
      position: newPosition
    })
    .select('id, title, position, items:checklist_items!left(*)') // Return the new list with empty items
    .single()

  if (insertError) {
    console.error('Error creating checklist:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  
  // Return the new checklist object, formatted like our types
  return NextResponse.json({ ...newList, items: newList.items || [] })
}
