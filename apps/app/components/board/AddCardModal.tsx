'use client'

import { useState } from 'react'
import { List } from '@/lib/types'
import { X, AlertOctagon, ArrowUp, ArrowDown } from 'lucide-react'

type Priority = 'low' | 'medium' | 'high'

interface AddCardModalProps {
  list: List
  onClose: () => void
  onSubmit: (newCardData: {
    title: string
    description: string | null
    priority: Priority | null
    due_date: string | null
  }) => Promise<void>
}

interface PriorityButtonProps {
  label: string;
  value: Priority; // <--- THIS IS THE FIX
  icon: React.ReactNode;
  selected: boolean;
  onClick: (value: Priority) => void;
}

// Now your function signature is strong
const PriorityButton = ({ 
  label, 
  value, 
  icon, 
  selected, 
  onClick 
}: PriorityButtonProps) => { // <--- NO MORE 'any'
  const colors = {
    low: 'bg-info/10 text-info hover:bg-info/20',
    medium: 'bg-warning/10 text-warning hover:bg-warning/20',
    high: 'bg-error/10 text-error hover:bg-error/20',
  }
  
  // This object is now 100% compatible with the 'value' prop
  const selectedColors: Record<Priority, string> = {
    low: 'bg-info text-info-foreground',
    medium: 'bg-warning text-warning-foreground',
    high: 'bg-error text-error-foreground',
  }

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      // This line now works because TypeScript can *prove*
      // that 'value' is a valid key for 'selectedColors'.
      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${selected ? selectedColors[value] : colors[value]}`}
    >
      {icon}
      {label}
    </button>
  )
}

export default function AddCardModal({ list, onClose, onSubmit }: AddCardModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority | null>(null)
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null
      })
      onClose() // Let the parent close on success
    } catch (err) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to create card.';
      setError(errorMessage || 'Failed to create card.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4">
      <div className="bg-background rounded-xl w-full max-w-lg flex flex-col relative overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground z-10"
        >
          <X size={24} />
        </button>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Add New Card</h2>
          <p className="text-sm text-muted">
            In list: <span className="font-medium text-foreground">{list.title}</span>
          </p>
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="text-xs font-semibold text-muted uppercase mb-2">Title</label>
            <input
              id="title"
              type="text"
              autoFocus
              placeholder="e.g. Finalize user research report"
              className="w-full p-3 rounded-md border border-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="text-xs font-semibold text-muted uppercase mb-2">Description</label>
            <textarea
              id="description"
              placeholder="Add a more detailed description..."
              className="w-full p-3 rounded-md border border-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          {/* Priority */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted uppercase">Priority</h3>
            <div className="flex gap-2">
              <PriorityButton label="High" value="high" icon={<AlertOctagon className="w-3.5 h-3.5" />} selected={priority === 'high'} onClick={setPriority} />
              <PriorityButton label="Medium" value="medium" icon={<ArrowUp className="w-3.5 h-3.5" />} selected={priority === 'medium'} onClick={setPriority} />
              <PriorityButton label="Low" value="low" icon={<ArrowDown className="w-3.5 h-3.5" />} selected={priority === 'low'} onClick={setPriority} />
            </div>
          </div>
          
          {/* Due Date */}
          <div>
            <label htmlFor="due_date" className="text-xs font-semibold text-muted uppercase mb-2">Due Date</label>
            <input
              id="due_date"
              type="date"
              className="border border-border rounded-md px-3 py-2 w-full bg-surface text-foreground"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary text-background rounded-md text-sm font-medium hover:opacity-80 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Card...' : 'Create Card'}
          </button>
        </form>
      </div>
    </div>
  )
}
