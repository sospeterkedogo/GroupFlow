import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/context/SessionContext'; 
import { Project, Card, List, Priority, Checklist, ChecklistItem, Activity } from '@/lib/types';
import { DropResult } from '@hello-pangea/dnd';
import { useStorage, useMutation } from "@/liveblocks.config";
import { LiveObject, LiveList } from "@liveblocks/client";

// --- HELPER: Strict Null to Undefined Conversion ---
const toUndefined = <T>(val: T | null | undefined): T | undefined => {
    return (val === null || val === undefined) ? undefined : val;
};

// --- DND HELPER ---
function getNewPosition(items: { position: number }[], index: number): number {
    if (!items || items.length === 0) return 1.0;
    
    if (index === 0) {
        const first = items[0];
        return (first?.position ?? 1.0) / 2.0;
    }
    
    if (index === items.length) {
        const last = items[items.length - 1];
        return (last?.position ?? 0) + 1.0;
    }

    const prev = items[index - 1];
    const next = items[index];
    
    if (!prev || !next) return 1.0; 
    return (prev.position + next.position) / 2.0;
}

export const useBoardData = (id: string) => {
    const router = useRouter();
    const { user } = useSession(); 

    // --- 1. READ STATE ---
    const projectMeta = useStorage((root) => root.projectMeta);
    const liveLists = useStorage((root) => root.lists);

    const board: Project | null = projectMeta && liveLists ? {
        id: projectMeta.id,
        name: projectMeta.name,
        course: toUndefined(projectMeta.course),
        due_date: toUndefined(projectMeta.due_date),
       
        lists: liveLists.map(l => ({
            id: l.id,
            title: l.title,
            position: l.position,
            cards: l.cards.map(c => ({
                id: c.id,
                title: c.title,
                description: toUndefined(c.description),
                priority: (c.priority as Priority) || 'Medium',
                due_date: toUndefined(c.due_date),
                position: c.position,
                list_id: c.list_id,
                activity: c.activity ? c.activity.map(a => ({
                    id: a.id,
                    user_id: a.user_id,
                    type: a.type as "comment" | "action", 
                    content: a.content,
                    created_at: a.created_at,
                    user_username: a.user_username || "", 
                    user_avatar_url: a.user_avatar_url || ""
                })) : [], 
                checklists: c.checklists ? c.checklists.map(cl => ({
                    id: cl.id,
                    title: cl.title,
                    position: cl.position,
                    items: cl.items ? cl.items.map(i => ({ 
                        id: i.id,
                        text: i.text,
                        is_done: i.is_done,
                        position: i.position
                    })) : []
                })) : [],
                assignees: [] 
            }))
        })) 
    } : null;

    // --- 2. LOCAL UI STATE ---
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [currentListTitle, setCurrentListTitle] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const activeCard = board?.lists
        .flatMap(l => l.cards)
        .find(c => c.id === selectedCard?.id);

    if (selectedCard && !activeCard && board) {
        setTimeout(() => setSelectedCard(null), 0);
    }

    const handleCardClick = useCallback((card: Card, listTitle: string) => {
        setSelectedCard(card);
        setCurrentListTitle(listTitle);
    }, []);
    
    const closeCardModal = useCallback(() => setSelectedCard(null), []);

    // =================================================================
    // MUTATIONS
    // =================================================================

    const handleProjectUpdate = useMutation(async ({ storage }, updatedData: any) => {
        const meta = storage.get("projectMeta");
        meta.update(updatedData);
        await fetch(`/api/projects/${id}`, {
             method: 'PATCH',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(updatedData),
        }).catch(e => setError("Failed to save project"));
    }, [id]);

    const handleDeleteProject = useCallback(async () => {
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed');
            router.push('/');
        } catch (e) {
            setError('Failed to delete project.');
        }
    }, [id, router]);

    const handleCreateList = useMutation(async ({ storage }, title: string) => {
        const res = await fetch('/api/lists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: id, title })
        });
        if (!res.ok) throw new Error("Failed to create list");
        const newList: List = await res.json();

        const lists = storage.get("lists");
        lists.push(new LiveObject({
            id: newList.id,
            title: newList.title,
            position: newList.position,
            cards: new LiveList([])
        }));
    }, [id]);

    const handleEditList = useMutation(async ({ storage }, listId: string, newTitle: string) => {
        const lists = storage.get("lists");
        for (const l of lists) {
            if (l.get("id") === listId) {
                l.set("title", newTitle);
                await fetch(`/api/lists/${listId}`, { 
                    method: 'PATCH', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ title: newTitle }) 
                });
                return;
            }
        }
    }, []);

    const handleConfirmDeleteList = useMutation(async ({ storage }, listToDelete: List) => {
        const lists = storage.get("lists");
        const index = lists.findIndex((l) => l.get("id") === listToDelete.id);
        if (index !== -1) {
            lists.delete(index);
            await fetch(`/api/lists/${listToDelete.id}`, { method: 'DELETE' });
        }
    }, []);

    const handleCreateCard = useMutation(async ({ storage }, listId: string, cardData: any) => {
        const res = await fetch('/api/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...cardData, list_id: listId, project_id: id })
        });
        const newCard = await res.json();

        const lists = storage.get("lists");
        for (const l of lists) {
             if (l.get("id") === listId) {
                 l.get("cards").push(new LiveObject({
                    ...newCard,
                    description: newCard.description || null,
                    priority: newCard.priority || null,
                    due_date: newCard.due_date || null,
                    list_id: listId,
                    checklists: new LiveList([]),
                    activity: new LiveList([])
                }));
                 return;
             }
        }
    }, [id]);

    const handleUpdateCard = useMutation(async ({ storage }, cardId: string, updates: Partial<Card>) => {
        const lists = storage.get("lists");
        
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    card.update(updates as any); 
                    await fetch(`/api/cards/${cardId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updates),
                    }).catch(e => setError("Failed to save card update"));
                    return;
                }
            }
        }
    }, []);

    const handleDeleteCard = useMutation(async ({ storage }, cardId: string) => {
         const lists = storage.get("lists");
         for (const list of lists) {
             const cards = list.get("cards");
             const index = cards.findIndex((c) => c.get("id") === cardId);
             if (index !== -1) {
                 cards.delete(index);
                 await fetch(`/api/cards/${cardId}`, { method: 'DELETE' });
                 return;
             }
         }
    }, []);

    // --- FIXED DND HANDLER ---
    const handleDragEndWrapper = useMutation(async ({ storage }, result: DropResult) => {
        const { source, destination, type, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const lists = storage.get("lists");
        let apiCall: Promise<Response> | null = null;

        // --- CASE 1: MOVING A LIST ---
        if (type === 'list') {
            // FIX: Use .move() instead of delete/insert to avoid "already attached" error
            lists.move(source.index, destination.index);
            
            // Update position field
            const list = lists.get(destination.index);
            if (list) {
                const currentItems = lists.toArray().map(l => ({ position: l.get("position") }));
                const newPos = getNewPosition(currentItems, destination.index);
                list.set("position", newPos);

                apiCall = fetch(`/api/lists/${draggableId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ position: newPos })
                });
            }
        } 
        // --- CASE 2: MOVING A CARD ---
        else if (type === 'card') {
            const sourceListIndex = lists.findIndex(l => l.get("id") === source.droppableId);
            const destListIndex = lists.findIndex(l => l.get("id") === destination.droppableId);
            
            if (sourceListIndex === -1 || destListIndex === -1) return;

            const sourceList = lists.get(sourceListIndex);
            const destList = lists.get(destListIndex);
            const sourceCards = sourceList?.get("cards");
            const destCards = destList?.get("cards");

            if (!sourceCards || !destCards) return;

            // Calculate new position FIRST
            const currentDestItems = destCards.toArray().map(c => ({ position: c.get("position") }));
            // Note: If moving to same list, we need to account for index shift if we calculated before move. 
            // But getNewPosition handles index logic usually.
            const newPos = getNewPosition(currentDestItems, destination.index);

            if (source.droppableId === destination.droppableId) {
                // --- SAME LIST: Use .move() ---
                sourceCards.move(source.index, destination.index);
                
                const card = sourceCards.get(destination.index);
                card?.set("position", newPos);
                
                apiCall = fetch(`/api/cards/${draggableId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ position: newPos })
                });
            } else {
                // --- DIFFERENT LIST: Must Clone and Insert ---
                const oldCard = sourceCards.get(source.index);
                if (!oldCard) return;

                // 1. Create a FULL CLONE of the card structure
                // We cannot just move the LiveObject because it's attached to the old list.
                const newCard = new LiveObject({
                    id: oldCard.get("id"),
                    title: oldCard.get("title"),
                    description: oldCard.get("description"),
                    priority: oldCard.get("priority"),
                    due_date: oldCard.get("due_date"),
                    list_id: destination.droppableId, // Update List ID
                    position: newPos,                 // Update Position
                    // Clone Nested LiveLists deeply
                    checklists: new LiveList(
                        oldCard.get("checklists").map(cl => new LiveObject({
                            id: cl.get("id"),
                            title: cl.get("title"),
                            position: cl.get("position"),
                            items: new LiveList(cl.get("items").map(i => new LiveObject({ ...i.toObject() })))
                        }))
                    ),
                    activity: new LiveList(
                        oldCard.get("activity").map(a => new LiveObject({ ...a.toObject() }))
                    )
                });

                // 2. Delete from Source
                sourceCards.delete(source.index);

                // 3. Insert into Destination
                destCards.insert(newCard, destination.index);

                apiCall = fetch(`/api/cards/${draggableId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ position: newPos, list_id: destination.droppableId })
                });
            }
        }
        if (apiCall) await apiCall.catch(e => console.error("Failed to sync drag", e));
    }, []);

    const handleAddComment = useMutation(async ({ storage }, cardId: string, content: string) => {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ card_id: cardId, content: content }),
        });
        const newActivity: Activity = await res.json();

        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    const activityList = card.get("activity");
                    activityList.insert(new LiveObject({
                        id: newActivity.id,
                        user_id: newActivity.user_id,
                        type: newActivity.type,
                        content: newActivity.content,
                        created_at: newActivity.created_at,
                        user_username: newActivity.user_username || null,
                        user_avatar_url: newActivity.user_avatar_url || null
                    }), 0);
                    return newActivity;
                }
            }
        }
        return newActivity;
    }, []);

    const handleAddChecklist = useMutation(async ({ storage }, cardId: string, title: string) => {
        const res = await fetch('/api/checklists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ card_id: cardId, title: title }),
        });
        const newChecklist: Checklist = await res.json();

        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    card.get("checklists").push(new LiveObject({
                        id: newChecklist.id,
                        title: newChecklist.title,
                        position: newChecklist.position,
                        items: new LiveList([])
                    }));
                    return;
                }
            }
        }
    }, []);

    const handleDeleteChecklist = useMutation(async ({ storage }, cardId: string, checklistId: string) => {
        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    const checklists = card.get("checklists");
                    const index = checklists.findIndex((cl) => cl.get("id") === checklistId);
                    if (index !== -1) {
                        checklists.delete(index);
                        await fetch(`/api/checklists/${checklistId}`, { method: 'DELETE' });
                    }
                    return;
                }
            }
        }
    }, []);

    const handleUpdateChecklistTitle = useMutation(async ({ storage }, cardId: string, checklistId: string, newTitle: string) => {
        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    const checklist = card.get("checklists").toArray().find((cl) => cl.get("id") === checklistId);
                    if (checklist) {
                        checklist.set("title", newTitle);
                        await fetch(`/api/checklists/${checklistId}`, { 
                            method: 'PATCH', 
                            headers: { 'Content-Type': 'application/json' }, 
                            body: JSON.stringify({ title: newTitle }) 
                        });
                        return;
                    }
                }
            }
        }
    }, []);

    const handleAddChecklistItem = useMutation(async ({ storage }, cardId: string, checklistId: string, text: string) => {
        const res = await fetch('/api/checklist-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ checklist_id: checklistId, text: text }),
        });
        const newItem: ChecklistItem = await res.json();

        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    const checklist = card.get("checklists").toArray().find((cl) => cl.get("id") === checklistId);
                    if (checklist) {
                        checklist.get("items").push(new LiveObject({
                            id: newItem.id,
                            text: newItem.text,
                            is_done: newItem.is_done,
                            position: newItem.position
                        }));
                        return;
                    }
                }
            }
        }
    }, []);

    const handleUpdateChecklistItem = useMutation(async ({ storage }, cardId: string, checklistId: string, itemId: string, updates: any) => {
        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    const checklist = card.get("checklists").toArray().find((cl) => cl.get("id") === checklistId);
                    if (checklist) {
                        const item = checklist.get("items").toArray().find((i) => i.get("id") === itemId);
                        if (item) {
                            item.update(updates);
                            await fetch(`/api/checklist-items/${itemId}`, { 
                                method: 'PATCH', 
                                headers: { 'Content-Type': 'application/json' }, 
                                body: JSON.stringify(updates) 
                            });
                            return;
                        }
                    }
                }
            }
        }
    }, []);

    const handleDeleteChecklistItem = useMutation(async ({ storage }, cardId: string, checklistId: string, itemId: string) => {
        const lists = storage.get("lists");
        for (const list of lists) {
            const cards = list.get("cards");
            for (const card of cards) {
                if (card.get("id") === cardId) {
                    const checklists = card.get("checklists").toArray().find((cl) => cl.get("id") === checklistId);
                    if (checklists) {
                        const items = checklists.get("items");
                        const index = items.findIndex((i) => i.get("id") === itemId);
                        if (index !== -1) {
                            items.delete(index);
                            await fetch(`/api/checklist-items/${itemId}`, { method: 'DELETE' });
                        }
                        return;
                    }
                }
            }
        }
    }, []);

    return {
        board: board as Project | null,
        loading: board === null,
        error,
        setError,
        setBoard: () => console.warn("setBoard deprecated"),
        selectedCard: activeCard || selectedCard, 
        currentListTitle,
        closeCardModal,
        handleCardClick,
        handleDragEndWrapper,
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
        handleProjectUpdate,
        handleDeleteProject,
        handleCreateList,
        handleEditList,
        handleConfirmDeleteList,
    };
};