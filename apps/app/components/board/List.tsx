'use client'

import { Droppable, Draggable } from '@hello-pangea/dnd'
import CardComponent from './Card' // Renamed to avoid name collision
import { MoreHorizontal, Plus, Trash2, Edit } from 'lucide-react'
import { List, Card } from '@/lib/types' // 1. IMPORT YOUR ACTUAL TYPES
import { useState } from 'react'

// 2. DEFINE YOUR PROPS INTERFACE. NO MORE 'any'.
interface ListComponentProps {
  list: List;
  onCardClick: (card: Card, listTitle: string) => void;
  onAddCard: () => void; // The parent (page.tsx) already knows the listId
  onDelete: (listId: string) => void;
  onEdit: (listId: string, title: string) => void;
  onEditList: (listId: string, title: string) => void;

}

// This component just renders one list and its cards.
export default function ListComponent({ list, onCardClick, onAddCard, onEdit, onDelete }: ListComponentProps) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState(list.title)


  return (
    <div className="relative"> {/*  EDIT/DELETE DROPDOWN (Aesthetic & Safe) */}
    <div className="shrink-0 w-80 bg-surface-alt bg-opacity-30 p-3 rounded-lg shadow-sm self-start">
      <div className="flex justify-between items-center mb-4 px-1">
        {isEditing ? (
        <input
            type="text"
            className="w-full bg-transparent border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={() => {
            onEdit(list.id, tempTitle)
            setIsEditing(false)
            }}
            onKeyDown={(e) => {
            if (e.key === 'Enter') {
                onEdit(list.id, tempTitle)
                setIsEditing(false)
            }
            }}
            autoFocus
        />
        ) : (
        <h2
            className="flex items-center gap-2 font-medium text-foreground cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
        >
            {list.title}
            <span className="text-xs font-normal text-muted bg-border/50 px-2 py-0.5 rounded-full">
            {list.cards ? list.cards.length : 0}
            </span>
        </h2>
        )}

        <button className="text-muted hover:text-foreground">
          <MoreHorizontal onClick = {() => setIsMenuOpen(!isMenuOpen)} className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
            <div 
            className="absolute right-0 top-8 w-48 bg-background border border-border rounded-md shadow-lg z-10"
            onMouseLeave={() => setIsMenuOpen(false)} // Auto-close
            >
            <button
                onClick={() => {
                setIsEditing(true)
                setIsMenuOpen(false)
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted"
            >
                <Edit className="w-4 h-4" />
                Edit List Title
            </button>
            <button
                onClick={() => {
                onDelete(list.id)
                setIsMenuOpen(false)
                }}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-error hover:bg-muted"
            >
                <Trash2 className="w-4 h-4" />
                Delete List
            </button>
            </div>
        )}
      </div>
      
      <Droppable droppableId={list.id} type="card">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-3 pr-1 min-h-[50px]"
          >
            {/* 4. FIX: Handle empty list.cards */}
            {list.cards && list.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    
                    <CardComponent 
                      card={card} 
                      onClick={() => onCardClick(card, list.title)} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          
        )}
      </Droppable>

      {/* 6. THE FIX YOU ASKED FOR:
           Actually attach the onClick handler to the button. */}
      <button 
        onClick={onAddCard}
        className="flex items-center gap-2 w-full text-left p-2 mt-3 rounded-md text-muted hover:bg-border  border-dashed border border-border/10 hover:text-background transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add a card
      </button>
    </div>
    </div>
  )
}
