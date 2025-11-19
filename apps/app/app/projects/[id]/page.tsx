'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DragDropContext, DropResult } from '@hello-pangea/dnd' 
import DashboardLayout from '@/components/layouts/DashboardLayout'
import AppHeader from '@/components/board/AppHeader'
import Board from '@/components/board/Board'
import CardModal from '@/components/board/CardModal'
import AddCardModal from '@/components/board/AddCardModal'
import EditProjectModal from '@/components/board/EditProjectModal'
import DeleteProjectModal from '@/components/board/DeleteProjectModal'
import InviteModal from '@/components/board/InviteModal'
import DeleteListModal from '@/components/board/DeleteListModal'
import { useBoardData } from '@/hooks/useBoardData'
import { BoardLoader} from '@/components/BoardLoader'
import { Project, List, Priority} from '@/lib/types'

export default function ProjectBoardPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string 

    // --- 1. Consume the Hook: All data, logic, and state management is here ---
    const { 
        board, 
        loading, 
        error, 
        setError,
        setBoard,
        selectedCard, 
        currentListTitle,
        closeCardModal,
        handleCardClick,

        // DND logic
        handleDragEndWrapper,
         

        handleUpdateCard,
        handleDeleteCard,
        handleCreateCard,
        handleAddComment,
        handleAddChecklist,
        handleDeleteChecklist, // NEW
        handleUpdateChecklistTitle, // NEW
        handleAddChecklistItem, // NEW
        handleUpdateChecklistItem, // NEW
        handleDeleteChecklistItem, // NEW
        handleProjectUpdate,
        handleDeleteProject,
        handleCreateList,
        handleEditList,
        handleConfirmDeleteList,
    } = useBoardData(id) 

    // --- 2. Local UI State: Only concerned with modal visibility and specific context ---
    const [addCardModalListId, setAddCardModalListId] = useState<string | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false)
    const [listToDelete, setListToDelete] = useState<List | null>(null)


    // --- 3. Wrapper Functions (Manage local state, call hook logic) ---

    // Project Modals
    const handleOpenEditModal = () => setIsEditModalOpen(true)
    const closeEditModal = () => setIsEditModalOpen(false)
    const handleSaveEdit = async (updatedData: { name: string, course: string | undefined, due_date: string | undefined }) => {
        try {
            await handleProjectUpdate(updatedData)
            closeEditModal()
        } catch (e) {
            // Error handled by hook
        }
    }

    const handleOpenDeleteModal = () => setIsDeleteModalOpen(true)
    const closeDeleteModal = () => setIsDeleteModalOpen(false)
    const handleConfirmDelete = async () => {
        try {
            await handleDeleteProject()
            closeDeleteModal()
        } catch (e) {
            // Error handled by hook
        }
    }

    // List Delete Modals
    const closeDeleteListModal = () => {
        setIsDeleteListModalOpen(false)
        setListToDelete(null)
    }
    const handleDeleteListClick = (listId: string) => {
        if (!board) return
        const list = board.lists.find(l => l.id === listId)
        if (list) {
            setListToDelete(list)
            setIsDeleteListModalOpen(true)
        }
    }
    const handleConfirmDeleteWrapper = async () => {
        if (!listToDelete) return
        try {
            await handleConfirmDeleteList(listToDelete)
            closeDeleteListModal()
        } catch (e) {
            // Error handled by hook
        }
    }

    // Card Add Modal
    const handleOpenAddCard = (listId: string) => setAddCardModalListId(listId)
    const closeAddCardModal = () => setAddCardModalListId(null)
    const handleCreateCardWrapper = async (newCardData: { title: string, description: string | null, priority: Priority | null, due_date: string | null }) => {
        if (!addCardModalListId) return
        try {
            await handleCreateCard(addCardModalListId, newCardData)
        } catch (e) {
            // Re-throw the error so the modal component can display it
            throw e
        }
    }

    // Invite Modal
    const handleOpenInviteModal = () => setIsInviteModalOpen(true)
    const closeInviteModal = () => setIsInviteModalOpen(false)

    // --- 4. Drag & Drop Logic (Now a clean wrapper) ---
    const handleDragEnd = (result: DropResult) => {
        // Delegate all DND complexity to the hook
        handleDragEndWrapper(result);
    } 

    // --- RENDER ---
    if (loading) { return <DashboardLayout><BoardLoader message="Loading project board..." /></DashboardLayout> }
    if (error) { return <DashboardLayout><BoardLoader message={`Error: ${error}`} isError={true} /></DashboardLayout> }
    if (!board) { return <DashboardLayout><BoardLoader message="Board not found." /></DashboardLayout> }

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
                    <Board 
                        lists={board.lists} 
                        onCardClick={handleCardClick}
                        onAddCard={handleOpenAddCard}
                        onAddList={handleCreateList} 
                        onDelete={handleDeleteListClick} 
                        onEditList={handleEditList} 
                    />
                </div>
            </DragDropContext>
        
            {/* View Card Modal - CLEAN INTERFACE, ONLY PASSING DATA HANDLERS */}
            <CardModal
                card={selectedCard}
                listTitle={currentListTitle}
                onClose={closeCardModal}
                allLists={board.lists}
                onUpdateCard={handleUpdateCard}
                onDeleteCard={handleDeleteCard}
                onAddComment={handleAddComment}
                
                // --- COMPLETE CHECKLIST HANDLERS ---
                onAddChecklist={handleAddChecklist}
                onDeleteChecklist={handleDeleteChecklist}
                onUpdateChecklistTitle={handleUpdateChecklistTitle}
                onAddChecklistItem={handleAddChecklistItem}
                onUpdateChecklistItem={handleUpdateChecklistItem}
                onDeleteChecklistItem={handleDeleteChecklistItem}
            />

            {/* Add Card Modal */}
            {addCardModalListId && (
                <AddCardModal
                    list={board.lists.find(l => l.id === addCardModalListId)!}
                    onClose={closeAddCardModal}
                    onSubmit={handleCreateCardWrapper}
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
                    onConfirm={handleConfirmDeleteWrapper}
                />
            )}

            {/* Invite Modal */}
            {isInviteModalOpen && (
                <InviteModal
                    id={board.id}
                    onClose={closeInviteModal}
                />
            )}
        </DashboardLayout>
    )
}