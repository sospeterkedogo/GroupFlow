'use client'

interface InviteModalProps {
  projectId: string
  onClose: () => void
}

export default function InviteModal({ projectId, onClose }: InviteModalProps) {
  // TODO: Build invite logic (search users, etc.)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-lg p-6 w-96" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">Invite Members</h2>
        <p className="text-muted-foreground text-sm mb-4">
          User search and invite functionality will go here. (Project ID: {projectId})
        </p>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-muted-foreground hover:bg-muted">Close</button>
        </div>
      </div>
    </div>
  )
}
