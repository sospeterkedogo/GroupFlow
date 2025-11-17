import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { project_id, title } = await req.json()
  if (!project_id || !title) {
    return NextResponse.json({ error: 'project_id and title are required' }, { status: 400 })
  }
  
  // Get the highest current position in this project
  const { data: maxPos, error: posError } = await supabase
    .from('lists')
    .select('position')
    .eq('project_id', project_id)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  if (posError && posError.code !== 'PGRST116') { // PGRST116 = no rows found
    console.error('Error getting max position:', posError)
    return NextResponse.json({ error: posError.message }, { status: 500 })
  }

  const newPosition = (maxPos?.position || 0) + 1

  // Insert the new list
  const { data: newList, error: insertError } = await supabase
    .from('lists')
    .insert({
      project_id,
      title,
      position: newPosition,
    })
    .select()
    .single()

  if (insertError) {
    console.error('Error creating list:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Return the new list, ensuring it has an empty cards array
  return NextResponse.json({ ...newList, cards: [] })
}
