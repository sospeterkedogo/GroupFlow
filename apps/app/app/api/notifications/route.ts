import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/serviceClient'

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()
  const data = await req.json()

  const { error } = await supabase.from('notifications').insert([data])
  if (error) {
      console.error('Error inserting notification:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  return NextResponse.json({ success: true })
}
