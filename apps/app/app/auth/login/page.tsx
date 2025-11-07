"use client"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
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

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push("/") // redirect on success
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-background rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-primary text-center">Welcome Back</h1>

        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            className="peer w-full px-4 pt-5 pb-2 border rounded-xl"
          />
          <label htmlFor="email" className="absolute left-4 top-2 text-sm">Email</label>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="peer w-full px-4 pt-5 pb-2 pr-12 border rounded-xl"
          />
          <label htmlFor="password" className="absolute left-4 top-2 text-sm">Password</label>
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-error text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-primary text-foreground rounded-xl border font-medium hover:brightness-110 transition-shadow shadow-sm disabled:shadow-none disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="text-center">
          <Link href="/auth/signup" className="text-sm text-accent hover:underline">Don&apos;t have an account? Sign Up</Link>
        </div>
      </form>
    </div>
  )
}