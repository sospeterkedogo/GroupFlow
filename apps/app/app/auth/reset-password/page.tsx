"use client"

import Link from "next/link"
import {createClient} from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const supabase = createClient()

  const handleResetPassword = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const email = (event.target as HTMLFormElement).email.value

    try {
      await supabase.auth.resetPasswordForEmail(email)
      console.log("Password reset email sent successfully")
    } catch (error) {
      console.error("Error sending password reset email:", error)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors px-4">
      <form className="w-full max-w-sm bg-background rounded-2xl shadow-md dark:shadow-lg p-8 space-y-6 transition-colors">
        <h1 className="text-2xl font-semibold text-primary text-center">
          Reset Password
        </h1>

        {/* Email */}
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder=" "
            className="peer w-full px-4 pt-5 pb-2 border rounded-xl bg-background text-foreground border-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-2 text-secondary text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary transition-all"
          >
            Email
          </label>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            onClick={handleResetPassword}
            className="w-full py-2 px-4 bg-primary text-foreground rounded-xl font-medium hover:brightness-110 transition-shadow shadow-sm dark:shadow-md"
          >
            Send Reset Link
          </button>

          <Link
            href="/auth/login"
            className="text-sm text-accent hover:underline text-center mt-2"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}
