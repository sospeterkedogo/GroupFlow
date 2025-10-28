'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DemoRedirectPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loginDemo = async () => {
      try {
        const res = await fetch('/api/demo-login');
        const text = await res.text();
        console.log('RAW RESPONSE:', text); // 👈 key line

        let payload;
        try {
          payload = JSON.parse(text);
        } catch {
          console.error('Not valid JSON. Response text:', text);
          return;
        }

        if (payload.error) {
          console.error('Demo login failed:', payload.error);
          return;
        }

        const session = payload.session;
        if (!session) {
          console.error('No session returned');
          return;
        }

        const { error: sessionError } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });

        if (sessionError) {
          console.error('Setting session failed:', sessionError.message);
          return;
        }

        router.replace('/');
      } catch (e) {
        console.error('Demo login request failed:', e);
      }
    };

    loginDemo();
  }, [router, supabase]);

  return <p>Loading demo...</p>;
}
