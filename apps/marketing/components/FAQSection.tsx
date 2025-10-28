'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    question: 'What is MyApp?',
    answer: 'MyApp is an all-in-one productivity platform designed to streamline team workflows, track progress, and improve collaboration across web and mobile devices.',
  },
  {
    question: 'How secure is MyApp?',
    answer: 'We prioritize security with enterprise-grade encryption, secure authentication, and regular audits to ensure your data stays safe.',
  },
  {
    question: 'Can I try MyApp for free?',
    answer: 'Yes! We offer a 14-day free trial for new users, so you can explore all features before committing.',
  },
  {
    question: 'Does MyApp integrate with other tools?',
    answer: 'Absolutely. MyApp integrates with popular tools like Slack, Google Workspace, and more to streamline your workflow.',
  },
  {
    question: 'What pricing plans are available?',
    answer: 'We offer Basic, Pro, and Enterprise plans. Each plan is designed to scale with your team’s needs, with features and support tailored accordingly.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 px-6 bg-background text-foreground">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4 font-heading">Frequently Asked Questions</h2>
        <p className="text-secondary max-w-2xl mx-auto">
          Answers to common questions about MyApp, our plans, and how you can get started.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="bg-foreground/5 dark:bg-background/40 rounded-xl border border-secondary/10 shadow-sm hover:shadow-md transition"
          >
            <button
              className="w-full px-6 py-4 flex justify-between items-center text-left font-semibold text-primary hover:bg-foreground/10 rounded-xl transition"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-secondary leading-relaxed">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
