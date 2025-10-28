'use client'

import { MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'

export default function FeedbackDropdown({ open, toggle }: { open: string | null, toggle: (name: string) => void }) {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    // Add real submission logic here
    alert('Feedback sent!')
    e.currentTarget.reset()
    setSubmitting(false)
    toggle('feedback')
  }

  return (
    <div className="relative">
      <button onClick={() => toggle('feedback')} className="text-secondary hover:text-primary transition-colors">
        <MessageSquare className="w-5 h-5" />
      </button>

      {open === 'feedback' && (
        <div className="absolute right-0 mt-3 w-72 bg-background border border-border rounded-xl shadow-lg p-4 z-50">
          <h3 className="font-semibold mb-2 text-primary">Send Feedback</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              name="feedback"
              required
              placeholder="Tell us how we can improve..."
              className="w-full h-24 p-2 border rounded-lg bg-background text-foreground resize-none focus:ring-2 focus:ring-accent focus:outline-none"
            ></textarea>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-background rounded-lg py-2 font-medium flex items-center justify-center gap-2 hover:brightness-110"
            >
              <Send size={16} /> {submitting ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
