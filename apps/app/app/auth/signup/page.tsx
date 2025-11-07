"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    } 
    
    // Redirect after signup attempt regardless of session presence
    router.push("/auth/email-confirmation") 
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-background rounded-2xl shadow-md dark:shadow-lg p-8 space-y-6 transition-colors"
      >
        <h1 className="text-2xl font-semibold text-primary text-center">
          Create Account
        </h1>

        {/* Email Input */}
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

        {/* Password Input with Toggle */}
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder=" "
            className="peer w-full px-4 pt-5 pb-2 pr-12 border rounded-xl bg-background text-foreground border-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-2 text-secondary text-sm peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-secondary peer-focus:top-2 peer-focus:text-sm peer-focus:text-primary transition-all"
          >
            Password
          </label>

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-error text-sm text-center">{error}</p>}

        {/* Submit */}
        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-foreground rounded-xl font-medium hover:brightness-110 transition-shadow shadow-sm dark:shadow-md"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <Link
            href="/auth/login"
            className="text-sm text-accent hover:underline text-center mt-2"
          >
            Already have an account? Log In
          </Link>
        </div>
      </form>
    </div>
  )
}