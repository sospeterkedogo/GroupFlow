'use client'

import Image from 'next/image'
import { MessageSquare, Paperclip, Clock, AlertOctagon, ArrowUp, ArrowDown, CheckCircle, CheckSquare as CheckSquareIcon } from 'lucide-react'
import { Card } from '@/lib/types' // Imports the contract
import { JSX } from 'react'
export { Tag }

// --- Tag Component (co-located) ---
const Tag = ({ text, type }: { text: string; type: string }) => {
  const tagColors: Record<string, string> = {
    // FIX: 'medium' was yellow, which is confusing. I made it blue.
    high: "bg-error/10 text-error", // Red
    medium: "bg-warning/10 text-warning", // Yellow
    low: "bg-info/10 text-info", // Blue
    due: "bg-error/10 text-error",
    completed: "bg-success/10 text-success",
    default: "bg-muted/10 text-muted",
  };
  const tagIcons: Record<string, JSX.Element | null> = {
    high: <AlertOctagon className="w-3.5 h-3.5" />,
    medium: <ArrowUp className="w-3.5 h-3.5" />, // Changed from warning
    low: <ArrowDown className="w-3.5 h-3.5" />,
    due: <Clock className="w-3.5 h-3.5" />,
    completed: <CheckCircle className="w-3.5 h-3.5" />,
  };
  const colorClass = tagColors[type] || tagColors.default;
  const icon = tagIcons[type] || null; 
  return (
   <span
    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}
   >
    {icon}
    {text}
   </span>
  );
};



// THIS IS A "DUMB" COMPONENT
// It only renders props.

interface CardProps {
  card: Card
  onClick: () => void
}

export default function CardComponent({ card, onClick }: CardProps) {
  // Derive counts from the REAL data
  const commentsCount = card.activity?.filter(a => a.type === 'comment').length || 0
  const attachmentsCount = 0 // Your schema still doesn't support this
  const assignees = card.assignees || []
  
  const allChecklistItems = card.checklists?.flatMap(c => c.items) || []
  const doneChecklistItems = allChecklistItems.filter(item => item.is_done).length
  const totalChecklistItems = allChecklistItems.length
  
  // Simple due date logic
  const isDue = card.due_date && new Date(card.due_date + 'T00:00:00') < new Date() // Fix timezone issue
  
  // --- NEW: Priority Logic ---
  // This reads the priority from the card data.
  // It will do nothing until you add `priority` to your
  // 'cards' table and your 'get_project_board_details' SQL function.
  const priority = card.priority || null; // e.g., 'high', 'medium', 'low'

  return (
    <div
      className="bg-background p-4 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <span className="text-foreground font-medium text-sm">{card.title}</span>
      
      {/* --- NEW: Priority Tag --- */}
      {/* This renders *before* the other tags, as it's most important */}
      <div className="flex flex-wrap items-center gap-2 text-muted mt-3">
        {priority && (
          <Tag 
            text={priority.charAt(0).toUpperCase() + priority.slice(1)} // Capitalize
            type={priority}
          />
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        {/* Left side: Tags and Counts */}
        <div className="flex flex-wrap items-center gap-3 text-muted">
          
          {/* Real Tag: Due Date */}
          {isDue && <Tag text="Overdue" type="due" />}

          {/* Real Tag: Checklist Progress */}
          {totalChecklistItems > 0 && (
             <span className={`flex items-center gap-1 text-xs font-medium ${doneChecklistItems === totalChecklistItems ? 'text-success' : 'text-muted'}`}>
              <CheckSquareIcon className="w-3.5 h-3.5" />
              {doneChecklistItems}/{totalChecklistItems}
            </span>
          )}
          
          {/* Real Tag: Comment Count */}
          {commentsCount > 0 && (
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              {commentsCount}
            </span>
          )}
          {/* (Attachments still 0) */}
        </div>
        
        {/* Right side: Assignees */}
        <div className="flex -space-x-2">
          {assignees.map((assignee) => (
            <Image
              key={assignee.user_id}
              src={assignee.avatar_url || "/default-avatar.png"}
              width={24}
              height={24}
              className="rounded-full border-2 border-background"
              alt={assignee.username || 'Assignee'}
              title={assignee.username || 'Assignee'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

