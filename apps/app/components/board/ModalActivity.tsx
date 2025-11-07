'use client'
import { Activity } from '@/lib/types'
import { useSession } from '@/app/context/SessionContext'
import Image from 'next/image'
import { Activity as ActivityIcon } from 'lucide-react'
import { useState } from 'react'

// --- timeAgo helper ---
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

// --- ActivityFeed (data-driven) ---
const ActivityFeed = ({ activity }: { activity: Activity[] }) => {
  if (!activity || activity.length === 0) {
    return <p className="text-sm text-muted">No activity yet.</p>
  }
  return (
    <div className="space-y-4">
      {activity.map((item) => (
        <div key={item.id} className="flex gap-3">
          <Image
            src={item.user_avatar_url || "/default-avatar.png"}
            alt={item.user_username}
            width={32}
            height={32}
            className="rounded-full h-8 w-8 mt-1"
          />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-bold text-foreground">{item.user_username}</span>{" "}
              {item.type === "action" && (
                <span className="text-muted">{item.content}</span>
              )}
              <span className="text-xs text-muted-foreground ml-2">
                {timeAgo(item.created_at)}
              </span>
            </p>
            {item.type === "comment" && (
              <div className="bg-surface border border-border rounded-lg p-3 mt-1 text-sm text-foreground shadow-sm">
                {item.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// --- Main Component ---
interface ModalActivityProps {
  cardId: string
  activity: Activity[]
  onAddComment: (cardId: string, content: string) => Promise<Activity | null> // Returns new comment
}

export default function ModalActivity({ cardId, activity, onAddComment }: ModalActivityProps) {
  const { profile } = useSession()
  
  // This component ENCAPSULATES the state for a new comment.
  // The "smart" parent page.tsx doesn't need to know about this.
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    
    setIsCommenting(true)
    try {
      await onAddComment(cardId, newComment.trim())
      setNewComment("") // Clear input on success
    } catch (e) {
      console.error("Failed to post comment", e)
      // (Optionally show an error)
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <section className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
        <ActivityIcon size={20} />
        Activity
      </h3>

      {/* Activity Feed */}
      <ActivityFeed activity={activity || []} />

      {/* Comment Box */}
      <div className="flex gap-3">
        <Image
          src={profile?.avatar_url || "/default-avatar.png"}
          alt="Current User"
          width={32}
          height={32}
          className="rounded-full h-8 w-8"
        />
        <div className="flex-1 space-y-2">
          <textarea
            placeholder="Add a comment..."
            className="w-full p-3 rounded-md border border-border bg-surface text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={isCommenting}
          />
          <button 
            onClick={handleCommentSubmit}
            disabled={isCommenting || !newComment.trim()}
            className="px-4 py-2 bg-primary text-background rounded-md text-sm font-medium hover:opacity-80 focus:outline-none disabled:opacity-50"
          >
            {isCommenting ? "Posting..." : "Comment"}
          </button>
        </div>
      </div>

      
    </section>
  )
}
