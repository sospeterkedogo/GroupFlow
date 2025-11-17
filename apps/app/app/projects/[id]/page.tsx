'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DragDropContext, DropResult } from '@hello-pangea/dnd' 
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AppHeader from '@/components/board/AppHeader'
import Board from '@/components/board/Board' // This is our updated "dumb" board
import CardModal from '@/components/board/CardModal'
import AddCardModal from '@/components/board/AddCardModal' // <-- THE NEW MODAL
import { useSession } from '@/app/context/SessionContext'
import { Project, List, Card, Checklist, ChecklistItem, Activity } from '@/lib/types'

import EditProjectModal from '@/components/board/EditProjectModal'
import DeleteProjectModal from '@/components/board/DeleteProjectModal'
import InviteModal from '@/components/board/InviteModal'
import DeleteListModal from '@/components/board/DeleteListModal'



export default function ProjectBoardPage() {
 const params = useParams()
 const router = useRouter()
 const { user, loading: authLoading } = useSession() 
 const [board, setBoard] = useState<Project | null>(null)
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState<string | null>(null)

 // --- NEW MODAL STATE ---
 // For VIEWING a card
 const [selectedCard, setSelectedCard] = useState<Card | null>(null)
 const [currentListTitle, setCurrentListTitle] = useState<string>('')
  // For ADDING a card
  const [addCardModalListId, setAddCardModalListId] = useState<string | null>(null)

  // For editing/deleting the *project*
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)

  // New state for delete list confirmation
  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false)
  const closeDeleteListModal = () => {
    setIsDeleteListModalOpen(false)
    setListToDelete(null)
    }

  const [listToDelete, setListToDelete] = useState<List | null>(null)

 const id = params.id as string 
 type Priority = 'low' | 'medium' | 'high';

 // --- (useEffect for fetching the board) ---
 useEffect(() => {
   if (authLoading || !user || !id) return
    const fetchBoard = async () => {
     setLoading(true)
     setError(null)
     try {
        const res = await fetch(`/api/projects/${id}`) 
        if (!res.ok) {
          const err = await res.json()
          if (res.status === 401 || res.status === 404) {
           setError(err.error || 'Board not found or unauthorized')
           setTimeout(() => router.push('/dashboard'), 2000)
          }
          throw new Error(err.error || 'Failed to fetch board')
        }
        const data: Project = await res.json()
        data.lists = data.lists || []
        data.lists.forEach((list: List) => {
          list.cards = list.cards || []
          list.cards.sort((a, b) => a.position - b.position)
        })
        data.lists.sort((a, b) => a.position - b.position)
        setBoard(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }
    fetchBoard()
 }, [id, user, authLoading, router])

 // --- ALL HANDLER FUNCTIONS ---

   // Edit Project Modal Logic
  const handleOpenEditModal = () => setIsEditModalOpen(true)
  const closeEditModal = () => setIsEditModalOpen(false)
  const handleSaveEdit = async (updatedData: { name: string, course: string | undefined, due_date: string | undefined }) => {
    if (!board) return
    
    const oldBoard = board
    // Optimistic Update
    setBoard({ ...board, ...updatedData })
    closeEditModal() // Close modal immediately

    // API Call
    try {
      const res = await fetch(`/api/projects/${board.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      if (!res.ok) throw new Error('Failed to save')
    } catch (e) {
      console.error(e)
      setError('Failed to save changes. Reverting.')
      setBoard(oldBoard) // Rollback on error
    }
  }

  // Delete Project Modal Logic
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true)
  const closeDeleteModal = () => setIsDeleteModalOpen(false)
  const handleConfirmDelete = async () => {
    setIsDeleteListModalOpen(false)
    setListToDelete(null)

    if (!board) return
    try {
      const res = await fetch(`/api/projects/${board.id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete')
      closeDeleteModal()
      router.push('/') // Redirect on success
    } catch (e) {
      console.error(e)
      setError('Failed to delete project.')
      closeDeleteModal() // Close modal on error
    }
  }

  
 const handleCardClick = (card: Card, listTitle: string) => {
   setSelectedCard(card)
   setCurrentListTitle(listTitle)
 }
 const closeModal = () => setSelectedCard(null)

  // --- Add Card Modal Logic ---
  const handleOpenAddCard = (listId: string) => {
    setAddCardModalListId(listId)
  }
  const closeAddCardModal = () => {
    setAddCardModalListId(null)
  }

  // --- HANDLERS FOR CREATE/EDIT/DELETE LIST ---
  const handleCreateList = async (title: string) => {
    if (!board) return
    
    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: board.id, title })
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create list')
      }
      const newList: List = await res.json()
      
      // Optimistic update
      setBoard({ ...board, lists: [...board.lists, newList] })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage)
    }
  }

  /**  Called by ListComponent to save an inline title edit.*/
  const handleEditList = async (listId: string, newTitle: string) => {
    if (!board) return
    
    const list = board.lists.find(l => l.id === listId)
    if (!list || list.title === newTitle) return
    
    const oldTitle = list.title
    
    // Optimistic Update
    const newLists = board.lists.map(l => 
      l.id === listId ? { ...l, title: newTitle } : l
    )
    setBoard({ ...board, lists: newLists })

    // API Call
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
      })

      const data = await res.json();
      if (!res.ok) {
        console.error('Supabase Returned:', data)
        throw new Error(data.error || 'Failed to update list title')
    }
    } catch (e) {
      console.error(e)
      setError('Failed to save list name. Reverting.')
      // Rollback
      setBoard(currentBoard => {
         if (!currentBoard) return null
         const revertedLists = currentBoard.lists.map(l => 
           l.id === listId ? { ...l, title: oldTitle } : l
         )
         return { ...currentBoard, lists: revertedLists }
      })
    }
  }

  /** Called by ListComponent. Doesn't delete, just opens the confirmation modal. */
  const handleDeleteList = (listId: string) => {
    if (!board) return
    const list = board.lists.find(l => l.id === listId)
    if (list) {
      setListToDelete(list)
      setIsDeleteListModalOpen(true)
    }
  }

  /** Called by the *new modal* to confirm the deletion. */
  const handleConfirmDeleteList = async () => {
    if (!board || !listToDelete) return

    const listId = listToDelete.id
    
    // Optimistic Update
    const oldLists = board.lists
    const newLists = oldLists.filter(l => l.id !== listId)
    setBoard({ ...board, lists: newLists })
    setListToDelete(null) // Close modal

    // API Call
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete list')
    } catch (e) {
      console.error(e)
      setError('Failed to delete list. Reverting.')
      // Rollback
      setBoard({ ...board, lists: oldLists })
    }
  }

// **** Handlers for CardModal ****

/**
 * Helper function to update the board state immutably.
 * This is the *core* of our modularity and prevents state bugs.
 */


// --- CARD CRUD HANDLERS ---
// (You'll need `board`, `setBoard`, `setSelectedCard`, `setError` from your page's useState)

/**
 * Handles all generic updates to a card (title, description, due_date, etc.)
 */
const updateCardInBoard = (
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  cardId: string, 
  updateFn: (card: Card) => Card 
) => {
  setBoard(currentBoard => {
    if (!currentBoard) return null;
    
    const newBoard = JSON.parse(JSON.stringify(currentBoard)) as Project;
    let cardFound = false;
    let updatedCard: Card | null = null;

    for (const list of newBoard.lists) {
      const cardIndex = list.cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        const oldCard = list.cards[cardIndex];
        if (oldCard) {
          list.cards[cardIndex] = updateFn(oldCard);
          updatedCard = list.cards[cardIndex];
        }
        cardFound = true;
        break;
      }
    }
    
    if (cardFound && updatedCard) {
      setSelectedCard(updatedCard);
      return newBoard;
    }
    
    return currentBoard; // No change
  });
};


// --- CARD CRUD HANDLERS ---
// (You'll need `board`, `setBoard`, `setSelectedCard`, `setError` from your page's useState)

/**
 * Handles all generic updates to a card (title, description, due_date, etc.)
 */
const handleUpdateCard = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  updates: { 
    title?: string, 
    description?: string, 
    due_date?: string | null | undefined,
    priority?: string | null | undefined,
    list_id?: string
  }
) => {
  if (!board) return;
  
  const oldBoard = JSON.parse(JSON.stringify(board)); 

  // 1. Optimistic Update
  updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
    return { ...card, ...updates };
  });

  // 2. API Call
  try {
    const res = await fetch(`/api/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update card');
  } catch (err) {
    console.error(err);
    setError("Failed to save card. Reverting.");
    setBoard(oldBoard);
    const oldCard = oldBoard.lists.flatMap((l: List) => l.cards).find((c: Card) => c.id === cardId);
    setSelectedCard(oldCard || null);
  }
};

/**
 * Deletes a card from the board.
 */
const handleDeleteCard = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string
) => {
  if (!board) return;
  
  const oldBoard = JSON.parse(JSON.stringify(board)); 
  
  // 1. Optimistic Update
  setSelectedCard(null); 
  setBoard(currentBoard => {
    if (!currentBoard) return null;
    const newBoard = { ...currentBoard };
    newBoard.lists = newBoard.lists.map(list => {
      list.cards = list.cards.filter(c => c.id !== cardId);
      return list;
    });
    return newBoard;
  });

  // 2. API Call
  try {
    const res = await fetch(`/api/cards/${cardId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete card');
  } catch (err) {
    console.error(err);
    setError("Failed to delete card. Reverting.");
    setBoard(oldBoard);
  }
};


// --- CARD ACTIVITY (COMMENT) HANDLERS ---

/**
 * Adds a new comment to a card.
 */
const handleAddComment = async (
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  content: string
): Promise<Activity | null> => {
  try {
    // 1. API Call first
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: cardId, content: content }),
    });
    if (!res.ok) throw new Error('Failed to post comment');
    
    const newActivity: Activity = await res.json();
    
    // 2. Update state
    updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
      card.activity = [newActivity, ...(card.activity || [])]; // Add to top
      return card;
    });
    
    return newActivity;

  } catch (err) {
    console.error(err);
    setError("Failed to post comment.");
    return null;
  }
};


// --- CHECKLIST HANDLERS ---

const handleAddChecklist = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  title: string
) => {
  if (!board) return;

  try {
    const res = await fetch('/api/checklists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ card_id: cardId, title: title }),
    });
    if (!res.ok) throw new Error('Failed to create checklist');
    
    const newChecklist: Checklist = await res.json();
    
    updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
      card.checklists = [...(card.checklists || []), newChecklist];
      return card;
    });

  } catch (err) {
    console.error(err);
    setError("Failed to add checklist.");
  }
};

const handleDeleteChecklist = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  checklistId: string
) => {
  const oldBoard = JSON.parse(JSON.stringify(board));
  updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
    card.checklists = card.checklists.filter(cl => cl.id !== checklistId);
    return card;
  });

  try {
    const res = await fetch(`/api/checklists/${checklistId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete checklist');
  } catch (err) {
    console.error(err);
    setError("Failed to delete checklist. Reverting.");
    setBoard(oldBoard);
    const oldCard = oldBoard.lists.flatMap((l: List) => l.cards).find((c: Card) => c.id === cardId);
    setSelectedCard(oldCard || null);
  }
};

const handleUpdateChecklistTitle = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  checklistId: string, 
  newTitle: string
) => {
  const oldBoard = JSON.parse(JSON.stringify(board));
  updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
    const checklist = card.checklists.find(cl => cl.id === checklistId);
    if (checklist) checklist.title = newTitle;
    return card;
  });

  try {
    const res = await fetch(`/api/checklists/${checklistId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!res.ok) throw new Error('Failed to update checklist title');
  } catch (err) {
    console.error(err);
    setError("Failed to save checklist title. Reverting.");
    setBoard(oldBoard);
    const oldCard = oldBoard.lists.flatMap((l: List) => l.cards).find((c: Card) => c.id === cardId);
    setSelectedCard(oldCard || null);
  }
};

// --- CHECKLIST ITEM HANDLERS ---

const handleAddChecklistItem = async (
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  checklistId: string, 
  text: string
) => {
  try {
    const res = await fetch('/api/checklist-items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checklist_id: checklistId, text: text }),
    });
    if (!res.ok) throw new Error('Failed to create item');
    
    const newItem: ChecklistItem = await res.json();
    
    updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
      const checklist = card.checklists.find(cl => cl.id === checklistId);
      if (checklist) {
        checklist.items = [...(checklist.items || []), newItem];
      }
      return card;
    });
  } catch (err) {
    console.error(err);
    setError("Failed to add item.");
  }
};

const handleUpdateChecklistItem = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string,
  checklistId: string,
  itemId: string,
  updates: { text?: string; is_done?: boolean }
) => {
  const oldBoard = JSON.parse(JSON.stringify(board));
  updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
    const checklist = card.checklists.find(cl => cl.id === checklistId);
    if (checklist) {
      const item = checklist.items.find(i => i.id === itemId);
      if (item) Object.assign(item, updates);
    }
    return card;
  });

  try {
    const res = await fetch(`/api/checklist-items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update item');
  } catch (err) {
    console.error(err);
    setError("Failed to update item. Reverting.");
    setBoard(oldBoard);
    const oldCard = oldBoard.lists.flatMap((l: List) => l.cards).find((c: Card) => c.id === cardId);
    setSelectedCard(oldCard || null);
  }
};

const handleDeleteChecklistItem = async (
  board: Project | null,
  setBoard: React.Dispatch<React.SetStateAction<Project | null>>,
  setSelectedCard: React.Dispatch<React.SetStateAction<Card | null>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  cardId: string, 
  checklistId: string, 
  itemId: string
) => {
  const oldBoard = JSON.parse(JSON.stringify(board));
  updateCardInBoard(setBoard, setSelectedCard, cardId, (card) => {
    const checklist = card.checklists.find(cl => cl.id === checklistId);
    if (checklist) {
      checklist.items = checklist.items.filter(i => i.id !== itemId);
    }
    return card;
  });

  try {
    const res = await fetch(`/api/checklist-items/${itemId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete item');
  } catch (err) {
    console.error(err);
    setError("Failed to delete item. Reverting.");
    setBoard(oldBoard);
    const oldCard = oldBoard.lists.flatMap((l: List) => l.cards).find((c: Card) => c.id === cardId);
    setSelectedCard(oldCard || null);
  }
};

  // Invite Modal Logic
  const handleOpenInviteModal = () => setIsInviteModalOpen(true)
  const closeInviteModal = () => setIsInviteModalOpen(false)

const handleCreateCard = async (newCardData: {
    title: string
    description: string | null
    priority: Priority | null
    due_date: string | null
}) => {
if (!board || !addCardModalListId) return

// This will throw an error if it fails, caught by the modal
const res = await fetch('/api/cards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    ...newCardData,
    list_id: addCardModalListId,
    project_id: board.id
    })
})

if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create card')
}

const newCard: Card = await res.json()

// Optimistic update
const newBoard = { ...board }
const list = newBoard.lists.find(l => l.id === addCardModalListId)
if (list) {
    list.cards.push(newCard)
    setBoard(newBoard)
}
}

/**
 * Calculates a new fractional position for an item being moved.
 * @param items The array of items (lists or cards) being sorted.
 * @param index The target index the item is being dropped at.
 * @returns A new fractional position.
 */

function getNewPosition(items: { position: number }[], index: number): number {
  // If the list is empty, return the default first position.
  if (!items || items.length === 0) {
    return 1.0;
  }

  // Case 1: Dropped at the beginning of the list
  if (index === 0) {
    // We must check if items[0] actually exists.
    const firstItem = items[0];
    if (firstItem) {
      return firstItem.position / 2.0;
    }
    // Failsafe, though logically this shouldn't be hit if items.length > 0
    return 1.0;
  }

  // Case 2: Dropped at the end of the list
  if (index === items.length) {
    // We must check if the last item actually exists.
    const lastItem = items[items.length - 1];
    if (lastItem) {
      return lastItem.position + 1.0;
    }
    // Failsafe
    return items.length + 1.0;
  }

  // Case 3: Dropped in the middle
  // We must check *both* surrounding items.
  const prevItem = items[index - 1];
  const nextItem = items[index];

  if (prevItem && nextItem) {
    // Both items exist. This is the happy path.
    return (prevItem.position + nextItem.position) / 2.0;
  }

  // Failsafe: This should be logically impossible, but we handle it.
  // If we can't find surrounding items, just put it at the end.
  const lastItem = items[items.length - 1];
  return lastItem ? lastItem.position + 1.0 : items.length + 1.0;
}

// --- Drag & Drop Logic (with API calls) ---
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result
    if (!destination || !board) return // Dropped outside
    
    // Dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    // --- 1. RE-ORDERING LISTS ---
    if (type === 'list') {
      // Create a deep copy for our optimistic update
      const newBoard = JSON.parse(JSON.stringify(board)) as Project;
      const [movedList] = newBoard.lists.splice(source.index, 1);
      if (!movedList) return;

      // Calculate new fractional position
      const newPosition = getNewPosition(newBoard.lists, destination.index);
      movedList.position = newPosition; // <-- IMPORTANT: Update the item itself

      // Optimistic update
      newBoard.lists.splice(destination.index, 0, movedList);
      setBoard(newBoard);

      // Fire and forget API call
      fetch(`/api/lists/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: newPosition }),
      }).catch((err) => {
        console.error("Failed to update list position:", err);
        // TODO: Implement rollback on error (e.g., re-fetch board or show toast)
        // For now, we just log the error.
        setError("Failed to save list order. Please refresh.");
      });
    }

    // --- 2. RE-ORDERING CARDS ---
    if (type === 'card') {
      if (!board.lists) return;
      
      // Deep copy
      const newBoard = JSON.parse(JSON.stringify(board)) as Project;
      const sourceList = newBoard.lists.find(l => l.id === source.droppableId);
      const destList = newBoard.lists.find(l => l.id === destination.droppableId);
      if (!sourceList || !destList) return;

      const [movedCard] = sourceList.cards.splice(source.index, 1);
      if (!movedCard) return;

      // --- Moving in *same* list ---
      if (source.droppableId === destination.droppableId) {
        // Calculate new position
        const newPosition = getNewPosition(sourceList.cards, destination.index);
        movedCard.position = newPosition; // Update the card's position

        // Optimistic update
        sourceList.cards.splice(destination.index, 0, movedCard);
        setBoard(newBoard);

        // Fire and forget API call
        fetch(`/api/cards/${draggableId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ position: newPosition }), // Only send position
        }).catch((err) => {
          console.error("Failed to update card position:", err);
          setError("Failed to save card order. Please refresh.");
        });

      } else {
        // --- Moving to a *different* list ---
        
        // Calculate new position *in the destination list*
        const newPosition = getNewPosition(destList.cards, destination.index);
        movedCard.position = newPosition; // Update the card's position
        movedCard.list_id = destList.id; // Update the card's list_id

        // Optimistic update
        destList.cards.splice(destination.index, 0, movedCard);
        setBoard(newBoard);
        
        // Fire and forget API call
        fetch(`/api/cards/${draggableId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            position: newPosition, 
            list_id: destList.id // Send both position and new list_id
          }), 
        }).catch((err) => {
          console.error("Failed to move card:", err);
          setError("Failed to save card move. Please refresh.");
        });
      }
    }
  } 

  // --- RENDER ---
if (loading || authLoading) { return ( <DashboardLayout><div className="flex-1 flex items-center justify-center h-full"><p className="text-muted">Loading board...</p></div> </DashboardLayout> ) }
 if (error) { return ( <DashboardLayout> <div className="flex-1 flex items-center justify-center h-full"><p className="text-error">Error: {error}</p></div></DashboardLayout>) }
 if (!board) return ( <DashboardLayout> <div className="flex-1 flex items-center justify-center h-full"><p className="text-muted">Board not found.</p></div> </DashboardLayout>)

 return (
   <DashboardLayout>
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen w-full bg-background text-foreground">
      <AppHeader 
            title={board.name} 
            course={board.course}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteModal}
            onInvite={handleOpenInviteModal}
        />
          {/* We pass the new handlers down to the "dumb" board */}
        <Board 
            lists={board.lists} 
            onCardClick={handleCardClick}
            onAddCard={handleOpenAddCard}
            onAddList={handleCreateList}
            onDelete={handleDeleteList}
            onEditList={handleEditList}
          />
        </div>
      </DragDropContext>
    
      {/* View Card Modal */}
      <CardModal
        card={selectedCard}
        listTitle={currentListTitle}
        onClose={closeModal}
        allLists={board.lists}
        onUpdateCard={(cardId, updates) => handleUpdateCard(board, setBoard, setSelectedCard, setError, cardId, updates)}
        onDeleteCard={(cardId) => handleDeleteCard(board, setBoard, setSelectedCard, setError, cardId)}
        onAddComment={(cardId, comment) => handleAddComment(setBoard, setSelectedCard, setError, cardId, comment)}
        onAddChecklist={(cardId, title) => handleAddChecklist(board, setBoard, setSelectedCard, setError, cardId, title)}
        onDeleteChecklist={(cardId, checklistId) => handleDeleteChecklist(board, setBoard, setSelectedCard, setError, cardId, checklistId)}
        onAddChecklistItem={(cardId, checklistId, text) => handleAddChecklistItem(setBoard, setSelectedCard, setError, cardId, checklistId, text)}
        onUpdateChecklistTitle={(cardId, checklistId, title) => handleUpdateChecklistTitle(board, setBoard, setSelectedCard, setError, cardId, checklistId, title)}
        onUpdateChecklistItem={(cardId, checklistId, itemId, updates) => handleUpdateChecklistItem(board, setBoard, setSelectedCard, setError, cardId, checklistId, itemId, updates)}
        onDeleteChecklistItem={(cardId, checklistId, itemId) => handleDeleteChecklistItem(board, setBoard, setSelectedCard, setError, cardId, checklistId, itemId)}
      />

      {/* Add Card Modal */}
      {addCardModalListId && (
        <AddCardModal
          // We find the list object to pass its title
          list={board.lists.find(l => l.id === addCardModalListId)!}
          onClose={closeAddCardModal}
          onSubmit={handleCreateCard}
        />
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <EditProjectModal
          project={board}
          onClose={closeEditModal}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Project Modal */}
      {isDeleteModalOpen && (
        <DeleteProjectModal
          projectName={board.name}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Delete List Modal */}
      {isDeleteListModalOpen && listToDelete && (
        <DeleteListModal
          listTitle={listToDelete.title}
          cardCount={listToDelete.cards ? listToDelete.cards.length : 0}
          onClose={closeDeleteListModal}
          onConfirm={handleConfirmDeleteList}
        />
      )}

      {/* Invite Modal (from your Canvas) */}
      {isInviteModalOpen && (
        <InviteModal
          id={board.id}
          onClose={closeInviteModal}
        />
      )}
   </DashboardLayout>
 )
}

