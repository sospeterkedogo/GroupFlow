'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// --- NEW @supabase/ssr client ---
import { createClient } from '@/lib/supabase/client';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import type { User } from '@supabase/supabase-js';

export default function AcceptInvitePage() {
  const { token } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  
  const [status, setStatus] = useState('loading'); // 'loading', 'authenticating', 'error'
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // NEW auth flow: check session manually
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setSessionLoading(false);
    };
    getUser();

    // Listen for auth changes (e.g., after login)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (event === 'SIGNED_IN') {
          // This will re-trigger the other useEffect
          setSessionLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (sessionLoading) {
      setStatus('loading');
      return;
    }

    if (user) {
      // --- SCENARIO 1: User is LOGGED IN ---
      setStatus('processing');
      const acceptInvite = async () => {
        try {
          // This API route NOW uses the NEW server client
          const response = await fetch('/api/invites/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token as string }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Failed to accept');

          // SUCCESS!
          setStatus('success');
          if (data.resourceType === 'project') router.push(`/projects/${data.resourceId}`);
          else if (data.resourceType === 'board') router.push(`/board/${data.resourceId}`);
          else router.push('/');

        } catch (err: any) {
          setStatus('error');
          setError(err.message);
        }
      };
      acceptInvite();

    } else {
      // --- SCENARIO 2: User is NOT LOGGED IN ---
      setStatus('authenticating');
    }
  }, [sessionLoading, user, token, router]);

  if (status === 'loading') {
    return <div className="flex h-screen items-center justify-center"><p>Loading invitation...</p></div>;
  }

  if (status === 'authenticating') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">You've been invited!</h2>
          <p className="text-muted-foreground mb-6">Sign in or create an account to accept.</p>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
            redirectTo={window.location.href} // It redirects here, auth listener catches it
            theme="dark"
          />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex h-screen items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Error Accepting Invite</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen items-center justify-center">
      <p>{status === 'processing' ? 'Accepting invitation...' : 'Success! Redirecting...'}</p>
    </div>
  );
}