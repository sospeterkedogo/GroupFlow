// /app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  // Fetch user's stripe_customer_id from your "profiles" table
  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id").eq("id", user.id).single()

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: profile?.stripe_customer_id,
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID_PRO, // e.g. "price_12345"
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: { user_id: user.id },
  })

  return NextResponse.json({ url: session.url })
}
