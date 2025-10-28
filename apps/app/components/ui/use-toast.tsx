// components/ui/use-toast.tsx
'use client'

import { useState } from 'react'

interface ToastOptions {
  title: string
  description?: string
}

export function toast({ title, description }: ToastOptions) {
  const toastEl = document.createElement('div')
  toastEl.className =
    'fixed bottom-6 right-6 bg-primary text-background p-4 rounded-md shadow-lg animate-fade-in z-50'
  toastEl.innerHTML = `<strong>${title}</strong>${description ? `<div class="text-sm mt-1">${description}</div>` : ''}`
  document.body.appendChild(toastEl)
  setTimeout(() => {
    toastEl.remove()
  }, 3000)
}
