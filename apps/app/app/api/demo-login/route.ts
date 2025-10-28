export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("MISSING SERVICE ROLE KEY!");
      return NextResponse.json({ error: "Missing service role key" }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'demo@app.com',
      password: process.env.DEMO_PASSWORD!,
    });

    if (error) {
      console.error('Supabase sign-in error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data?.session) {
      console.error('No session returned from Supabase');
      return NextResponse.json({ error: 'No session returned' }, { status: 400 });
    }

    console.log('Demo login successful');
    return NextResponse.json({ session: data.session });
  } catch (err: any) {
    console.error('Unexpected error in demo-login route:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
