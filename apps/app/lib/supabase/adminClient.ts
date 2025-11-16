import { createClient } from '@supabase/supabase-js'

/**
 * --- FOR ADMIN TASKS (like RPCs) ---
 * Creates a Supabase client that uses the SERVICE_ROLE_KEY.
 * This client bypasses all RLS. Use with extreme caution.
 */

export const createSupabaseAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}