'use server'

import { createSupabaseServerComponentClient } from '@/lib/supabase/server'

// Update profile
export async function updateProfile(userId: string, profile: { firstname: string; lastname: string; username: string; avatar_url: string }) {
  const supabase = createSupabaseServerComponentClient()
  const { error } = await supabase.from('profiles').update(profile).eq('id', userId)
  if (error) throw new Error(error.message)
}

// Update password
export async function updatePassword(userId: string, newPassword: string) {
  const supabase = createSupabaseServerComponentClient()
  const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword })
  if (error) throw new Error(error.message)
}
// Delete account
export async function deleteAccount(userId: string) {
  const supabase = createSupabaseServerComponentClient()

  // 1️⃣ Delete profile first (optional but cleaner)
  const { error: profileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId)

  if (profileError) {
    console.error("Error deleting profile:", profileError.message)
    throw new Error(profileError.message)
  }

  // 2️⃣ Delete the user from Supabase Auth (requires service role key)
  const { error: userError } = await supabase.auth.admin.deleteUser(userId)

  if (userError) {
    console.error("Error deleting user:", userError.message)
    throw new Error(userError.message)
  }

  return { success: true }
}
