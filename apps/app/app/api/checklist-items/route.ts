import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/checklist-items
// Creates a new checklist item
export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { checklist_id, text } = await req.json()
  if (!checklist_id || !text) {
    return NextResponse.json({ error: 'checklist_id and text are required' }, { status: 400 })
  }

  // 1. Get max position for this checklist
  const { data: posData, error: posError } = await supabase
    .from('checklist_items')
    .select('position')
    .eq('checklist_id', checklist_id)
    .order('position', { ascending: false })
    .limit(1)
    .single()
  
  if (posError && posError.code !== 'PGRST116') {
    return NextResponse.json({ error: posError.message }, { status: 500 })
  }
  
  const newPosition = (posData?.position || 0) + 1.0

  // 2. Insert new item
  // RLS ("Allow project members to create checklist items") handles security
  const { data: newItem, error: insertError } = await supabase
    .from('checklist_items')
    .insert({
      checklist_id,
      text,
      position: newPosition,
      is_done: false
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating checklist item:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  
  return NextResponse.json(newItem)
}
