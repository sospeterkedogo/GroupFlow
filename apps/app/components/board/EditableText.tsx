'use client'
import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'

interface EditableTextProps {
  initialValue: string
  onSave: (newValue: string) => Promise<void> // Async save function
  placeholder?: string
  textarea?: boolean // Use <textarea> instead of <input>
  className?: string // For styling the <p>
  inputClassName?: string // For styling the input
}

export default function EditableText({
  initialValue,
  onSave,
  placeholder = "Add description...",
  textarea = false,
  className = "",
  inputClassName = ""
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSave = async () => {
    if (value === initialValue) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    try {
      await onSave(value)
      setIsEditing(false)
    } catch (e) {
      console.error("Failed to save", e)
      // (Optionally) revert state
      // setValue(initialValue)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setValue(initialValue)
    setIsEditing(false)
  }

  if (isEditing) {
    const InputComponent = textarea ? 'textarea' : 'input'
    return (
      <div className="w-full">
        <InputComponent
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full p-2 rounded-md border border-primary bg-background text-foreground ${inputClassName}`}
          autoFocus
          rows={textarea ? 5 : undefined}
          disabled={isSaving}
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-80 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="p-2 text-muted-foreground hover:bg-muted rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <p
      onClick={() => setIsEditing(true)}
      className={`text-sm text-foreground/90 whitespace-pre-wrap cursor-pointer rounded-md p-2 -m-2 hover:bg-muted ${className} ${!value && 'text-muted-foreground'}`}
    >
      {value || placeholder}
    </p>
  )
}
