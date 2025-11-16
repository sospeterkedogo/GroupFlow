import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createSupabaseRouteHandlerClient()
  const data = await req.json()

  const { error } = await supabase.from('notifications').insert([data])
  if (error) {
      console.error('Error inserting notification:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  return NextResponse.json({ success: true })
}
