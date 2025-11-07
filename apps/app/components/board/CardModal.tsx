'use client'

import { Card, List, Assignee, Activity, Checklist } from '@/lib/types'
import {
  X,
  Type,
  CheckSquare,
} from 'lucide-react'
import Image from 'next/image'
import { Tag } from '@/components/board/Card' // Assuming Tag is exported from Card.tsx
import ModalSidebar from './ModalSidebar'
import ModalActivity from './ModalActivity'
import EditableText from './EditableText'

// --- AvatarStack ---
const AvatarStack = ({ members }: { members: Assignee[] }) => (
  <div className="flex -space-x-2 relative">
    {members.map((member) => (
      <Image
        key={member.user_id}
        src={member.avatar_url || "/default-avatar.png"}
        alt={member.username}
        title={member.username}
        width={32}
        height={32}
        className="rounded-full border-2 border-background"
      />
    ))}
    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-alt text-muted hover:bg-surface-alt border-2 border-background">
      <span className="text-xs font-bold">+</span>
    </button>
  </div>
)

// --- DueDate ---
const DueDate = ({ dateString }: { dateString: string }) => {
  const dueDate = new Date(dateString + 'T00:00:00')
  const now = new Date()
  now.setHours(0,0,0,0)
  const isOverdue = dueDate < now;
  const formattedDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <span className={`text-sm font-medium px-3 py-1 rounded-md ${
      isOverdue ? 'bg-error/10 text-error' : 'bg-muted/50 text-foreground'
    }`}>
      {isOverdue && 'Overdue: '}
      {formattedDate}
    </span>
  )
}

// --- Checklist ---
// This is now a "dumb" component. The parent 'page' handles logic.
const ChecklistComponent = ({ 
  cardId, 
  checklist,
  onUpdateItem,
  onDeleteItem,
}: { 
  cardId: string, 
  checklist: Checklist,
  onUpdateItem: (itemId: string, updates: { text?: string; is_done?: boolean }) => void,
  onDeleteItem: (itemId: string) => void,
}) => {
  const doneItems = checklist.items.filter((item) => item.is_done).length
  const totalItems = checklist.items.length
  const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase">
        {checklist.title} ({doneItems}/{totalItems})
      </h3>
      <div className="w-full bg-surface-alt rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="space-y-2">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 group">
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={item.is_done}
              onChange={(e) => onUpdateItem(item.id, { is_done: e.target.checked })}
              className="w-5 h-5 text-primary bg-surface border-border rounded focus:ring-primary"
            />
            <label
              htmlFor={`item-${item.id}`}
              className={`text-sm flex-1 ${
                item.is_done ? "line-through text-muted" : "text-foreground"
              }`}
            >
              {item.text}
            </label>
            <button 
              onClick={() => onDeleteItem(item.id)}
              className="text-muted-foreground hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {/* TODO: Add "Add an item" button here */}
      </div>
    </div>
  )
}

// ---
// --- THE MAIN MODAL (NOW MODULAR) ---
// ---

interface ModalProps {
  card: Card | null
  listTitle: string
  allLists: List[] // Need this for the "Move" dropdown
  onClose: () => void
  // These are the handlers passed down from page.tsx
  onUpdateCard: (cardId: string, updates: { 
    title?: string, 
    description?: string, 
    due_date?: string | null,
    priority?: string | null,
    list_id?: string 
  }) => Promise<void>
  onDeleteCard: (cardId: string) => Promise<void>
  onAddComment: (cardId: string, content: string) => Promise<Activity | null>
  onAddChecklist: (cardId: string, title: string) => Promise<void>
  onDeleteChecklist: (cardId: string, checklistId: string) => Promise<void>
  onAddChecklistItem: (cardId: string, checklistId: string, text: string) => Promise<void>
  onUpdateChecklistItem: (cardId: string, checklistId: string, itemId: string, updates: { text?: string; is_done?: boolean }) => Promise<void>
  onUpdateChecklistTitle: (cardId: string, checklistId: string, title: string) => Promise<void>
  onDeleteChecklistItem: (cardId: string, checklistId: string, itemId: string) => Promise<void>
}

export default function CardModal({ 
  card, 
  listTitle,
  allLists,
  onClose, 
  onUpdateCard,
  onDeleteCard,
  onAddComment,
  onUpdateChecklistItem,
  onDeleteChecklistItem
}: ModalProps) {
  
  if (!card) return null

  const {
    id, // Use 'id' directly from card
    assignees,
    due_date,
    priority,
    description,
    checklists,
    activity,
  } = card

  // --- Handlers that just call the parent (page.tsx) ---
  
  const handleDescriptionSave = (newDesc: string) => {
    return onUpdateCard(card.id, { description: newDesc })
  }
  
  const handleTitleSave = (newTitle: string) => {
    return onUpdateCard(card.id, { title: newTitle })
  }
  
  const handleSidebarUpdate = (updates: { 
    due_date?: string | null, 
    priority?: string | null,
    list_id?: string 
  }) => {
    return onUpdateCard(card.id, updates)
  }
  
  const handleSidebarDelete = () => {
    return onDeleteCard(card.id)
  }
  
  const handleSidebarAttach = () => {
    // TODO: Wire up file attachment
    console.log("TODO: Attach file")
  }
  
  const handleCommentAdd = (cardId: string , content: string) => {
    return onAddComment(card.id, content)
  }
  
  const handleChecklistItemUpdate = (checklistId: string, itemId: string, updates: { text?: string; is_done?: boolean }) => {
    return onUpdateChecklistItem(card.id, checklistId, itemId, updates)
  }

  const handleChecklistItemDelete = (checklistId: string, itemId: string) => {
    return onDeleteChecklistItem(card.id, checklistId, itemId)
  }
  

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-xl w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground z-10"
        >
          <X size={24} />
        </button>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN (Content) --- */}
            <div className="col-span-3 md:col-span-2 space-y-8 border-r border-border pr-8">
              
              {/* Title (Now Editable) */}
              <EditableText
                initialValue={card.title}
                onSave={handleTitleSave}
                className="text-3xl font-bold text-foreground pr-10"
                inputClassName="text-3xl font-bold"
              />
              
              <p className="text-sm text-muted -mt-6">
                In list:{" "}
                <span className="font-medium text-foreground">{listTitle}</span>
              </p>

              {/* Meta data: Assignees, Due Date, Priority */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {assignees && assignees.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                      Assigned Members
                    </h3>
                    <AvatarStack members={assignees} />
                  </div>
                )}
                {due_date && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                      Due Date
                    </h3>
                    <DueDate dateString={due_date} />
                  </div>
                )}
                {priority && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                      Priority
                    </h3>
                    <Tag 
                      text={priority.charAt(0).toUpperCase() + priority.slice(1)}
                      type={priority}
                    />
                  </div>
                )}
              </div>

              {/* Description (Now Editable) */}
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Type size={20} />
                  Description
                </h3>
                <EditableText
                  initialValue={description || ''}
                  onSave={handleDescriptionSave}
                  textarea
                />
              </section>

              {/* Checklists (Now Data-Driven) */}
              {checklists && checklists.length > 0 && (
                <section className="space-y-4">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <CheckSquare size={20} />
                    Checklists
                  </h3>
                  {checklists.map(cl => (
                    <ChecklistComponent 
                      key={cl.id}
                      cardId={card.id}
                      checklist={cl} 
                      onUpdateItem={(itemId, updates) => handleChecklistItemUpdate(cl.id, itemId, updates)}
                      onDeleteItem={(itemId) => handleChecklistItemDelete(cl.id, itemId)}
                    />
                  ))}
                </section>
              )}
            </div>

            {/* --- RIGHT COLUMN (Actions & Activity) --- */}
            <div className="col-span-3 md:col-span-1 space-y-6">
              
              {/* Modular Sidebar */}
              <ModalSidebar
                card={card}
                allLists={allLists}
                onUpdateCard={handleSidebarUpdate}
                onDeleteCard={handleSidebarDelete}
                onAttachFile={handleSidebarAttach}
              />

              {/* Modular Activity */}
              <ModalActivity
                cardId={card.id}
                activity={activity || []}
                onAddComment={handleCommentAdd}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
