'use client'
import { Card, List } from '@/lib/types'
import { Paperclip, ArrowRight, Trash2, Calendar, Tag, Plus } from 'lucide-react'


interface ModalSidebarProps {
  card: Card
  allLists: List[]
  onUpdateCard: (updates: { 
    due_date?: string | null, 
    priority?: string | null,
    list_id?: string 
  }) => void
  onDeleteCard: () => void
  onAttachFile: () => void
  onAddChecklist: (cardId: string, title: string) => Promise<void>
}

export default function ModalSidebar({
  card,
  allLists,
  onUpdateCard,
  onDeleteCard,
  onAttachFile,
  onAddChecklist
}: ModalSidebarProps) {
  
  const handleListMove = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newListId = e.target.value
    if (newListId && newListId !== card.list_id) {
      onUpdateCard({ list_id: newListId })
    }
  }
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateCard({ due_date: e.target.value || null })
  }
  
  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateCard({ priority: e.target.value || null })
  }

  const handleAddChecklist = async () => {
    await onAddChecklist(card.id, 'New Checklist')
  }

  return (
    <section>
      <h3 className="text-xs font-semibold text-muted uppercase mb-3">
        Actions
      </h3>
      <div className="flex flex-col gap-2">
        {/* Foundation for attachments */}
        <button 
          onClick={onAttachFile}
          className="flex items-center gap-2 w-full bg-border/70 hover:bg-border text-foreground px-3 py-2 rounded-md text-sm"
        >
          <Paperclip size={16} /> Attach File
        </button>
        
        {/* Move Card */}
        <div className="relative w-full">
          <ArrowRight size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select 
            onChange={handleListMove}
            value={card.list_id}
            className="w-full appearance-none bg-border/70 hover:bg-border text-foreground px-3 py-2 pl-9 rounded-md text-sm"
          >
            <option value="" disabled>Move to...</option>
            {allLists.map(list => (
              <option key={list.id} value={list.id}>
                {list.title} {list.id === card.list_id ? "(current)" : ""}
              </option>
            ))}
          </select>
        </div>
        
        {/* Update Due Date */}
        <div className="relative w-full">
          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="date"
            onChange={handleDateChange}
            value={card.due_date ? card.due_date.split('T')[0] : ''}
            className="w-full bg-border/70 hover:bg-border text-foreground px-3 py-2 pl-9 rounded-md text-sm"
          />
        </div>
        
        {/* Update Priority */}
        <div className="relative w-full">
          <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select 
            onChange={handlePriorityChange}
            value={card.priority || ''}
            className="w-full appearance-none bg-border/70 hover:bg-border text-foreground px-3 py-2 pl-9 rounded-md text-sm"
          >
            <option value="">Set Priority...</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Add Checklist */}
        <button className="flex items-center gap-2 w-full bg-border/70 hover:bg-border text-foreground px-3 py-2 rounded-md text-sm" onClick={handleAddChecklist}>
          <Plus size={16} /> 
          <span>Add Checklist</span>
        </button>

        {/* Delete Card */}
        <button 
          onClick={onDeleteCard}
          className="flex items-center gap-2 w-full bg-border/70 hover:bg-error/10 text-foreground hover:text-error px-3 py-2 rounded-md text-sm"
        >
          <Trash2 size={16} /> Delete Card
        </button>
      </div>
    </section>
  )
}
