'use client'
import { Project } from '@/lib/types'
import { useState } from 'react'

interface EditProjectModalProps {
  project: Project
  onClose: () => void
  onSave: (updatedData: { name: string, course: string | undefined, due_date: string | undefined }) => Promise<void>
}

export default function EditProjectModal({ project, onClose, onSave }: EditProjectModalProps) {
  const [name, setName] = useState(project.name)
  const [course, setCourse] = useState(project.course || '')
  const [due_date, setDueDate] = useState(project.due_date || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await onSave({ name, course: course || undefined, due_date: due_date || undefined })
    setIsSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Project</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project Name"
            className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Course"
            className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
          <input
            type="date"
            placeholder="Due Date"
            className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
            value={due_date}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-muted-foreground hover:bg-muted">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
