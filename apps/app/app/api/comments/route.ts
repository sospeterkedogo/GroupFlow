import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/comments
// Creates a new comment (a 'card_activity' row)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { card_id, content } = await req.json()
  if (!card_id || !content) {
    return NextResponse.json({ error: 'card_id and content are required' }, { status: 400 })
  }

  // RLS ("Allow project members to create card activity") handles security
  
  // 1. THE SQL FIX:
  // We perform TWO queries. First, insert the activity.
  const { data: newActivity, error: insertError } = await supabase
    .from('card_activity')
    .insert({
      card_id,
      content,
      user_id: user.id,
      type: 'comment'
    })
    .select() // Select the whole new row
    .single()

  if (insertError) {
    console.error('Error creating comment:', insertError)
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }
  
  // 2. THE SECOND QUERY:
  // Now that we have the newActivity.user_id, fetch the profile.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', newActivity.user_id)
    .single()
    
  if (profileError) {
    // Log the error, but don't fail the whole request.
    // We can still return the comment, just without the username.
    console.error("Failed to fetch profile for new comment:", profileError)
  }

  // 3. THE FLATTENING FIX:
  // Manually combine the results into the shape our client expects.
  const result = {
    id: newActivity.id,
    user_id: newActivity.user_id,
    type: newActivity.type,
    content: newActivity.content,
    created_at: newActivity.created_at,
    // Safely access the profile data
    user_username: profile?.username || 'Guest',
    user_avatar_url: profile?.avatar_url || null
  }
  // 'result' now perfectly matches your 'Activity' type

  return NextResponse.json(result)
}

