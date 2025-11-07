'use client'
import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface DeleteListModalProps {
  listTitle: string
  cardCount: number
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteListModal({ listTitle, cardCount, onClose, onConfirm }: DeleteListModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-error" />
          </div>
          <h2 className="text-lg font-semibold">Delete List</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Are you sure you want to delete the list "<strong>{listTitle}</strong>"? 
          All <strong>{cardCount}</strong> card(s) in this list will also be permanently deleted. 
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} disabled={isDeleting} className="px-4 py-2 rounded-md text-muted-foreground hover:bg-muted disabled:opacity-50">
            Cancel
          </button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="px-4 py-2 rounded-md bg-error text-error-foreground disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete List'}
          </button>
        </div>
      </div>
    </div>
  )
}
