"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function EmailConfirmationPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResendEmail = async () => {
    setLoading(true)
    setMessage(null)
    setError(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user?.email) {
      setError("Unable to retrieve your account. Please log in again.")
      setLoading(false)
      return
    }

    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email: user.email,
    })

    if (resendError) {
      setError("Failed to resend confirmation email. Please try again.")
    } else {
      setMessage("Confirmation email has been resent! Check your inbox.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors px-6">
      <div className="max-w-md w-full bg-background rounded-2xl shadow-md dark:shadow-lg p-8 text-center space-y-6">
        <h1 className="text-2xl font-semibold text-primary">Confirm Your Email</h1>

        <p className="text-secondary">
          We’ve sent a confirmation link to your email address. Please check your inbox (and spam folder)
          to activate your account before logging in.
        </p>

        <button
          onClick={handleResendEmail}
          disabled={loading}
          className="w-full py-2 px-4 bg-primary text-foreground rounded-xl font-medium hover:brightness-110 disabled:opacity-70 transition-all shadow-sm dark:shadow-md"
        >
          {loading ? "Resending..." : "Resend Confirmation Email"}
        </button>

        {message && <p className="text-green-500 text-sm">{message}</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <p className="text-sm text-secondary">
          Already confirmed your email?{" "}
          <a
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  )
}
