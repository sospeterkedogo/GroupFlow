'use client'

// This component is DUMB. It just renders what it's given.
// It imports the List component and passes props to it.

import { Droppable, Draggable, DroppableProvided } from '@hello-pangea/dnd'
import ListComponent from '@/components/board/List' // Make sure this path is correct
import { Plus } from 'lucide-react'
import { List, Card } from '@/lib/types' // Your types file
import { useState } from 'react' // We need state for the "Add List" input

interface BoardProps {
  lists: List[]
  onCardClick: (card: Card, listTitle: string) => void
  onAddCard: (listId: string) => void
  onAddList: (title: string) => void
  onEditList: (listId: string, title: string) => void
  onDelete: (listId: string) => void
}

export default function Board({ lists, onCardClick, onAddCard, onAddList, onEditList, onDelete }: BoardProps) {
  // This state is fine to live here, as it only controls
  // the visibility of the "Add List" input, which is
  // a UI concern *within* the Board.
  const [isAddingList, setIsAddingList] = useState(false)
  const [newListName, setNewListName] = useState('')

  const handleAddList = () => {
    if (newListName.trim()) {
      onAddList(newListName.trim()) // Tell the "smart" parent
      setNewListName('')
      setIsAddingList(false)
    }
  }

  return (
    <main className="flex flex-1 gap-4 overflow-x-auto p-4 md:px-8 pb-4 w-full">
      <Droppable droppableId="board" type="list" direction="horizontal">
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-4 min-w-full w-auto items-start"
          >
            {lists.map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index}>
                {(providedDnd) => ( // Renamed to avoid conflict
                  <div
                    ref={providedDnd.innerRef}
                    {...providedDnd.draggableProps}
                    {...providedDnd.dragHandleProps}
                  >
                    {/* *** THE FIX IS HERE ***
                      You are now passing the onAddCard prop down
                      to the ListComponent where the button lives.
                      We also pass the list.id so the parent knows
                      *which* list to add the card to.
                    */}
                    <ListComponent 
                      list={list} 
                      onCardClick={onCardClick} 
                      onAddCard={() => onAddCard(list.id)} 
                      onEdit={onEditList}
                      onEditList={onEditList}
                      onDelete={onDelete}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            
            {/* *** THE SECOND FIX IS HERE ***
              This button is now wired up to the onAddList prop.
            */}
            <div className="shrink-0 w-80">
              {isAddingList ? (
                <div className="bg-[rgba(255,255,255,0.02)] p-3 rounded-lg">
                  <input
                    type="text"
                    placeholder="Enter list title..."
                    autoFocus
                    className="w-full p-2 rounded-md border border-border bg-background text-foreground"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={handleAddList}
                      className="px-4 py-2 bg-primary text-background rounded-md text-sm font-medium hover:opacity-80"
                    >
                      Add List
                    </button>
                    <button
                      onClick={() => setIsAddingList(false)}
                      className="text-muted hover:text-foreground p-2"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingList(true)}
                  className="shrink-0 flex items-center justify-start gap-2 w-full h-12 p-3 rounded-lg bg-background/50 border border-transparent text-muted hover:bg-border hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add another list
                </button>
              )}
            </div>

          </div>
        )}
      </Droppable>
    </main>
  )
}

