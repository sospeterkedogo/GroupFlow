'use client'
import { useState } from 'react'

interface DeleteProjectModalProps {
  projectName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function DeleteProjectModal({ projectName, onClose, onConfirm }: DeleteProjectModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onConfirm()
    // No need to set isDeleting false, component will unmount
    
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-2">Delete Project</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Are you sure you want to delete the project "<strong>{projectName}</strong>"? 
          This action is permanent and cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-muted-foreground hover:bg-muted">Cancel</button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="px-4 py-2 rounded-md bg-error text-error-foreground disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </div>
  )
}
