import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/context/SessionContext';
import { Project, List, Card, Activity, Checklist, ChecklistItem, Priority } from '@/lib/types';
import { DropResult } from '@hello-pangea/dnd';

// --- CORE IMMUTABILITY HELPER ---
/**
 * Finds and updates a card within the board state immutably.
 * This is the crucial, complex state logic, centralized here.
 */
const updateCardInBoardState = (
    currentBoard: Project,
    cardId: string, 
    updateFn: (card: Card) => Card 
): Project => {
    const newBoard = JSON.parse(JSON.stringify(currentBoard)) as Project;
    for (const list of newBoard.lists) {
        const cardIndex = list.cards.findIndex(c => c.id === cardId);
        if (cardIndex !== -1) {
            const oldCard = list.cards[cardIndex];
            // Execute the update function on a deep copy of the card
            if (!oldCard) return currentBoard;
            list.cards[cardIndex] = updateFn(oldCard);
            return newBoard; // Found and updated, return new state
        }
    }
    return currentBoard; // No change
};

// --- DND POSITION HELPER (Moved from Component to Hook) ---
function getNewPosition(items: { position: number }[], index: number): number {
    if (!items || items.length === 0) return 1.0;
    
    if (index === 0) {
        const firstItem = items[0];
        return firstItem ? firstItem.position / 2.0 : 1.0;
    }

    if (index === items.length) {
        const lastItem = items[items.length - 1];
        return lastItem ? lastItem.position + 1.0 : items.length + 1.0;
    }

    const prevItem = items[index - 1];
    const nextItem = items[index];

    if (prevItem && nextItem) {
        return (prevItem.position + nextItem.position) / 2.0;
    }
    return items.length + 1.0;
}


export const useBoardData = (id: string | undefined) => {
    const router = useRouter();
    const { user, loading: authLoading } = useSession(); 

    // --- Primary State ---
    const [board, setBoard] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [currentListTitle, setCurrentListTitle] = useState<string>('');

    // --- Modal/Contextual State Functions ---
    const handleCardClick = useCallback((card: Card, listTitle: string) => {
        setSelectedCard(card);
        setCurrentListTitle(listTitle);
    }, []);
    const closeCardModal = useCallback(() => setSelectedCard(null), []);

    // --- Data Fetching Effect ---
    const fetchBoard = useCallback(async () => {
        if (!user || !id) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/projects/${id}`); 
            if (!res.ok) {
                const err = await res.json();
                if (res.status === 401 || res.status === 404) {
                    setError(err.error || 'Board not found or unauthorized');
                    setTimeout(() => router.push('/dashboard'), 2000);
                }
                throw new Error(err.error || 'Failed to fetch board');
            }
            const data: Project = await res.json();
            // Sorting/initialization logic (Important for DND position logic)
            data.lists = data.lists || [];
            data.lists.forEach((list: List) => {
                list.cards = list.cards || [];
                list.cards.sort((a, b) => a.position - b.position);
            });
            data.lists.sort((a, b) => a.position - b.position);
            setBoard(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [id, user, router]);

    useEffect(() => {
        if (authLoading || !id) return;
        fetchBoard();
    }, [id, authLoading, fetchBoard]);

    // --- Card Update Helper (Handles optimistic updates and selected card sync) ---
    // This helper is used internally by handlers for simple updates (like title, description)
    const updateCardOptimistic = useCallback((cardId: string, updates: Partial<Card>) => {
        if (!board) return;
        setBoard(currentBoard => {
            if (!currentBoard) return null;
            const newBoard = updateCardInBoardState(currentBoard, cardId, (card) => {
                return { ...card, ...updates };
            });
            // Sync the selected card in the modal
            setSelectedCard(prevCard => 
                prevCard && prevCard.id === cardId ? { ...prevCard, ...updates } as Card : prevCard
            );
            return newBoard;
        });
    }, [board]);

    // =================================================================
    // DND HANDLERS (New centralized logic)
    // =================================================================

    const handleMoveListOrCard = useCallback(async (listId: string, cardId: string | null, updates: { position: number, list_id?: string }) => {
        const idToUpdate = cardId || listId;
        const endpoint = cardId ? `/api/cards/${idToUpdate}` : `/api/lists/${idToUpdate}`;

        try {
            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Failed to update position');
        } catch (err) {
            setError("Failed to save drag and drop changes. Please refresh.");
            // NOTE: In a real rollback scenario, you would need to force a refetch or manually revert DND state here.
        }
    }, []);

    const handleDragEndWrapper = useCallback((result: DropResult) => {
        const { source, destination, type, draggableId } = result;
        if (!destination || !board) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;
        
        const oldBoard = JSON.parse(JSON.stringify(board)) as Project;
        let apiCall: Promise<void> | null = null;

        // Functional update to handle optimistic state change
        setBoard(currentBoard => {
            if (!currentBoard) return null;
            const newBoard = JSON.parse(JSON.stringify(currentBoard)) as Project;
            
            if (type === 'list') {
                const [movedList] = newBoard.lists.splice(source.index, 1);
                if (!movedList) return currentBoard;

                const newPosition = getNewPosition(newBoard.lists, destination.index);
                movedList.position = newPosition; 
                newBoard.lists.splice(destination.index, 0, movedList);
                
                // Prepare API call
                apiCall = handleMoveListOrCard(draggableId, null, { position: newPosition });
            }

            if (type === 'card') {
                const sourceList = newBoard.lists.find(l => l.id === source.droppableId);
                const destList = newBoard.lists.find(l => l.id === destination.droppableId);
                if (!sourceList || !destList) return currentBoard;

                const [movedCard] = sourceList.cards.splice(source.index, 1);
                if (!movedCard) return currentBoard;

                let newPosition: number;
                let listIdUpdate: string | undefined = undefined;

                if (source.droppableId === destination.droppableId) {
                    newPosition = getNewPosition(sourceList.cards, destination.index);
                    sourceList.cards.splice(destination.index, 0, movedCard);
                } else {
                    newPosition = getNewPosition(destList.cards, destination.index);
                    listIdUpdate = destList.id;
                    destList.cards.splice(destination.index, 0, movedCard);
                }
                
                movedCard.position = newPosition; 
                if (listIdUpdate) movedCard.list_id = listIdUpdate;
                
                // Prepare API call
                apiCall = handleMoveListOrCard(movedCard.list_id, draggableId, { 
                    position: newPosition, 
                    list_id: listIdUpdate 
                });
            }
            
            // Execute API call (fire and forget, errors handled by handleMoveListOrCard)
            if (apiCall) apiCall.catch(() => setBoard(oldBoard)); // Simple rollback on error
            return newBoard;
        });
    }, [board, handleMoveListOrCard]);




    // =================================================================
    // PROJECT & LIST CRUD HANDLERS (Unchanged from previous revision)
    // =================================================================

    const handleProjectUpdate = useCallback(async (updatedData: { name: string, course: string | undefined, due_date: string | undefined }) => {
        if (!board) return;
        const oldBoard = board;
        setBoard({ ...board, ...updatedData }); // Optimistic Update
        try {
            const res = await fetch(`/api/projects/${board.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            if (!res.ok) throw new Error('Failed to save project changes');
        } catch (e) {
            setError('Failed to save project changes. Reverting.');
            setBoard(oldBoard); // Rollback
            throw e;
        }
    }, [board]);

    const handleDeleteProject = useCallback(async () => {
        if (!board) return;
        try {
            const res = await fetch(`/api/projects/${board.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete project');
            router.push('/'); // Redirect on success
        } catch (e) {
            setError('Failed to delete project.');
            throw e;
        }
    }, [board, router]);

    const handleCreateList = useCallback(async (title: string) => {
        if (!board) return;
        try {
            const res = await fetch('/api/lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_id: board.id, title })
            });
            if (!res.ok) throw new Error('Failed to create list');
            const newList: List = await res.json();
            
            setBoard(currentBoard => ({ ...currentBoard!, lists: [...currentBoard!.lists, newList] }));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            throw err;
        }
    }, [board]);

    const handleEditList = useCallback(async (listId: string, newTitle: string) => {
        if (!board) return;
        const oldTitle = board.lists.find(l => l.id === listId)?.title;
        if (!oldTitle || oldTitle === newTitle) return;

        const oldLists = board.lists;
        const newLists = board.lists.map(l => l.id === listId ? { ...l, title: newTitle } : l);
        setBoard({ ...board, lists: newLists }); // Optimistic

        try {
            const res = await fetch(`/api/lists/${listId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTitle }) });
            if (!res.ok) throw new Error('Failed to update list title');
        } catch (e) {
            setError('Failed to save list name. Reverting.');
            setBoard(currentBoard => ({ ...currentBoard!, lists: oldLists })); // Rollback
            throw e;
        }
    }, [board]);

    const handleConfirmDeleteList = useCallback(async (listToDelete: List) => {
        if (!board) return;
        const listId = listToDelete.id;
        
        const oldLists = board.lists;
        const newLists = oldLists.filter(l => l.id !== listId);
        setBoard({ ...board, lists: newLists }); // Optimistic

        try {
            const res = await fetch(`/api/lists/${listId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete list');
        } catch (e) {
            setError('Failed to delete list. Reverting.');
            setBoard(currentBoard => ({ ...currentBoard!, lists: oldLists })); // Rollback
            throw e;
        }
    }, [board]);


    // =================================================================
    // CARD CRUD HANDLERS
    // =================================================================

    const handleCreateCard = useCallback(async (listId: string, newCardData: { title: string, description: string | null, priority: Priority | null, due_date: string | null }) => {
        if (!board) return;
        
        const res = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newCardData, list_id: listId, project_id: board.id })
        });

        if (!res.ok) throw new Error('Failed to create card');

        const newCard: Card = await res.json();

        // Use strictly immutable array push logic to prevent state corruption/doubling
        setBoard(currentBoard => {
            if (!currentBoard) return null;
            const newLists = currentBoard.lists.map(list => {
                if (list.id === listId) {
                    return {
                        ...list,
                        cards: [...list.cards, newCard] // Strictly immutable array push
                    };
                }
                return list;
            });
            return { ...currentBoard, lists: newLists };
        });
    }, [board]);

    const handleUpdateCard = useCallback(async (cardId: string, updates: { [key: string]: any }) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board)); 

        updateCardOptimistic(cardId, updates); // Optimistic Update

        try {
            const res = await fetch(`/api/cards/${cardId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Failed to update card');
        } catch (err) {
            setError("Failed to save card. Reverting.");
            setBoard(oldBoard); // Rollback
            const oldCard = oldBoard.lists.flatMap((l: List) => l.cards).find((c: Card) => c.id === cardId);
            setSelectedCard(oldCard || null);
            throw err;
        }
    }, [board, updateCardOptimistic]);

    const handleDeleteCard = useCallback(async (cardId: string) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board)); 
        
        // 1. Optimistic Update (Remove from UI)
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

        // 2. API Call & Rollback
        try {
            const res = await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete card');
        } catch (err) {
            setError("Failed to delete card. Reverting.");
            setBoard(oldBoard); // Rollback
            throw err;
        }
    }, [board]);


    // =================================================================
    // ACTIVITY (COMMENT) HANDLERS
    // =================================================================

    const handleAddComment = useCallback(async (cardId: string, content: string): Promise<Activity | null> => {
        try {
            // 1. API Call first (to get the generated ID and timestamp)
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ card_id: cardId, content: content }),
            });
            if (!res.ok) throw new Error('Failed to post comment');
            const newActivity: Activity = await res.json();
            
            // 2. Optimistic Update (using functional update to avoid type mismatch)
            setBoard(currentBoard => {
                if (!currentBoard) return null;
                return updateCardInBoardState(currentBoard, cardId, (card) => {
                    // Correctly merge the new activity into the activities array
                    card.activity = [newActivity, ...(card.activity || [])]; 
                    return card;
                });
            });

            // 3. Sync selected card state
            setSelectedCard(prevCard => {
                if (!prevCard || prevCard.id !== cardId) return prevCard;
                const newActivityList = [newActivity, ...(prevCard.activity || [])];
                return { ...prevCard, activity: newActivityList };
            });
            
            return newActivity;

        } catch (err) {
            setError("Failed to post comment.");
            return null;
        }
    }, []);


    // =================================================================
    // CHECKLIST HANDLERS
    // =================================================================

    const handleAddChecklist = useCallback(async (cardId: string, title: string) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board));
        try {
            const res = await fetch('/api/checklists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ card_id: cardId, title: title }),
            });
            if (!res.ok) throw new Error('Failed to create checklist');
            const newChecklist: Checklist = await res.json();
            
            // Optimistic Update
            setBoard(currentBoard => updateCardInBoardState(currentBoard!, cardId, (card) => {
                 card.checklists = [...(card.checklists || []), newChecklist];
                 return card;
            }));

            setSelectedCard(prevCard => ({ ...prevCard!, checklists: [...(prevCard!.checklists || []), newChecklist] }));

        } catch (err) {
            setError("Failed to add checklist. Reverting.");
            setBoard(oldBoard);
            throw err; 
        }
    }, [board]);

    const handleDeleteChecklist = useCallback(async (cardId: string, checklistId: string) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board));
        
        // Optimistic Update
        setBoard(currentBoard => updateCardInBoardState(currentBoard!, cardId, (card) => {
             card.checklists = card.checklists.filter(cl => cl.id !== checklistId);
             return card;
        }));
        setSelectedCard(prevCard => ({ ...prevCard!, checklists: prevCard!.checklists.filter(cl => cl.id !== checklistId) }));

        try {
            const res = await fetch(`/api/checklists/${checklistId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete checklist');
        } catch (err) {
            setError("Failed to delete checklist. Reverting.");
            setBoard(oldBoard); // Rollback
            throw err;
        }
    }, [board]);

    const handleUpdateChecklistTitle = useCallback(async (cardId: string, checklistId: string, newTitle: string) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board));
        
        // Optimistic Update
        setBoard(currentBoard => updateCardInBoardState(currentBoard!, cardId, (card) => {
             const checklist = card.checklists.find(cl => cl.id === checklistId);
             if (checklist) checklist.title = newTitle;
             return card;
        }));
        setSelectedCard(prevCard => {
            const checklist = prevCard!.checklists.find(cl => cl.id === checklistId);
            if (checklist) checklist.title = newTitle;
            return { ...prevCard! };
        });

        try {
            const res = await fetch(`/api/checklists/${checklistId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle }),
            });
            if (!res.ok) throw new Error('Failed to update checklist title');
        } catch (err) {
            setError("Failed to save checklist title. Reverting.");
            setBoard(oldBoard);
            throw err;
        }
    }, [board]);


    // =================================================================
    // CHECKLIST ITEM HANDLERS
    // =================================================================

    const handleAddChecklistItem = useCallback(async (cardId: string, checklistId: string, text: string) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board));
        try {
            const res = await fetch('/api/checklist-items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ checklist_id: checklistId, text: text }),
            });
            if (!res.ok) throw new Error('Failed to create item');
            
            const newItem: ChecklistItem = await res.json();
            
            // Optimistic Update
            setBoard(currentBoard => updateCardInBoardState(currentBoard!, cardId, (card) => {
                 const checklist = card.checklists.find(cl => cl.id === checklistId);
                 if (checklist) checklist.items = [...(checklist.items || []), newItem];
                 return card;
            }));
            setSelectedCard(prevCard => {
                const checklist = prevCard!.checklists.find(cl => cl.id === checklistId);
                if (checklist) checklist.items = [...(checklist.items || []), newItem];
                return { ...prevCard! };
            });

        } catch (err) {
            setError("Failed to add checklist item. Reverting.");
            setBoard(oldBoard);
            throw err;
        }
    }, [board]);

    const handleUpdateChecklistItem = useCallback(async (cardId: string, checklistId: string, itemId: string, updates: { text?: string; is_done?: boolean }) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board));
        
        // Optimistic Update
        setBoard(currentBoard => updateCardInBoardState(currentBoard!, cardId, (card) => {
             const checklist = card.checklists.find(cl => cl.id === checklistId);
             if (checklist) {
                 const item = checklist.items.find(i => i.id === itemId);
                 if (item) Object.assign(item, updates);
             }
             return card;
        }));
        setSelectedCard(prevCard => {
             const checklist = prevCard!.checklists.find(cl => cl.id === checklistId);
             if (checklist) {
                 const item = checklist.items.find(i => i.id === itemId);
                 if (item) Object.assign(item, updates);
             }
             return { ...prevCard! };
        });

        try {
            const res = await fetch(`/api/checklist-items/${itemId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Failed to update item');
        } catch (err) {
            setError("Failed to update item. Reverting.");
            setBoard(oldBoard);
            throw err;
        }
    }, [board]);

    const handleDeleteChecklistItem = useCallback(async (cardId: string, checklistId: string, itemId: string) => {
        if (!board) return;
        const oldBoard = JSON.parse(JSON.stringify(board));
        
        // Optimistic Update
        setBoard(currentBoard => updateCardInBoardState(currentBoard!, cardId, (card) => {
             const checklist = card.checklists.find(cl => cl.id === checklistId);
             if (checklist) {
                 checklist.items = checklist.items.filter(i => i.id !== itemId);
             }
             return card;
        }));
        setSelectedCard(prevCard => {
             const checklist = prevCard!.checklists.find(cl => cl.id === checklistId);
             if (checklist) {
                 checklist.items = checklist.items.filter(i => i.id !== itemId);
             }
             return { ...prevCard! };
        });

        try {
            const res = await fetch(`/api/checklist-items/${itemId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete item');
        } catch (err) {
            setError("Failed to delete item. Reverting.");
            setBoard(oldBoard);
            throw err;
        }
    }, [board]);


    // =================================================================
    // EXPOSE THE CLEAN INTERFACE
    // =================================================================
    return {
        // State
        board, 
        loading, 
        error, 
        setError,
        setBoard,
        selectedCard, 
        currentListTitle,
        // Card/Modal Actions
        handleCardClick,
        closeCardModal,
        handleUpdateCard,
        handleDeleteCard,
        handleCreateCard,
        handleAddComment,
        handleAddChecklist,
        handleDeleteChecklist,
        handleUpdateChecklistTitle,
        handleAddChecklistItem,
        handleUpdateChecklistItem,
        handleDeleteChecklistItem,
        // DND
        handleDragEndWrapper,
        // Project/List Actions
        handleProjectUpdate,
        handleDeleteProject,
        handleCreateList,
        handleEditList,
        handleConfirmDeleteList,
    };
};