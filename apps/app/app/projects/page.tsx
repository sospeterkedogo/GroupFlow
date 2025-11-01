"use client";

import React, { JSX, useState } from "react";
import {
  LayoutGrid,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  CheckCircle,
  Clock,
  AlertOctagon,
  ArrowDown,
  ArrowUp,
  // --- ICONS I HAD TO ADD ---
  Type,
  CheckSquare as CheckSquareIcon, // Renamed to avoid conflict
  ArrowRight,
  Trash2,
  Activity,
  X,
} from "lucide-react";
import Image from "next/image";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// --- Mock Data (Your original, simple data for the board) ---
const initialBoardData = {
  lists: [
    {
      id: "list-1",
      title: "To Do",
      cards: [
        {
          id: "card-1",
          title: "Research topic ideas",
          tags: [{ id: "tag-1", text: "High", type: "high" }],
          comments: 0,
          attachments: 0,
          assignees: ["/default-avatar.png"],
          description: "Brainstorm ideas for research paper topics.",
          due: "2025-11-05",
        },
        {
          id: "card-2",
          title: "Outline research paper structure",
          tags: [{ id: "tag-2", text: "Low", type: "low" }],
          comments: 2,
          attachments: 0,
          assignees: ["/default-avatar.png"],
          description: "Create an outline for the research paper structure.",
          due: "2025-11-12",
        },
      ],
    },
    {
      id: "list-2",
      title: "In Progress",
      cards: [
        {
          // This card ID ("card-research-report") now matches the detailed data
          id: "card-research-report",
          title: "Finalize User Research Report", // Title changed to match image
          tags: [{ id: "tag-4", text: "Medium", type: "medium" }],
          comments: 3,
          attachments: 1, // Added attachment to match activity
          assignees: [
            "/default-avatar.png",
            "/default-avatar.png",
            "/default-avatar.png",
          ],
          description: "Compile all findings from the user interviews...", // Simple description
          due: "2025-10-26", // Set date to be overdue
        },
        {
          id: "card-5",
          title: "Create presentation slides",
          tags: [{ id: "tag-2", text: "Low", type: "low" }],
          comments: 0,
          attachments: 0,
          assignees: ["/default-avatar.png"],
          description: "Create presentation slides for the research paper.",
          due: "2025-12-02",
        },
      ],
    },
    {
      id: "list-3",
      title: "Done",
      cards: [
        {
          id: "card-6",
          title: "Submit final paper",
          tags: [{ id: "tag-5", text: "Completed", type: "completed" }],
          comments: 0,
          attachments: 1,
          assignees: ["/default-avatar.png"],
          description: "Submit the final version of the research paper.",
          due: "2025-12-09",
        },
      ],
    },
  ],
};

// --- NEW DATA STORE ---
// This is the *detailed* data for the modal.
// Your simple board data is not enough.
const modalDataStore: Record<string, any> = {
  "card-research-report": {
    // This ID matches the card in the "In Progress" list
    // This data PERFECTLY matches the image
    assignedMembers: [
      { id: 1, name: "Sarah Day", avatar: "/default-avatar.png" },
      { id: 2, name: "Jane Doe", avatar: "/default-avatar.png" },
      { id: 3, name: "Current User", avatar: "/default-avatar.png" },
    ],
    dueDate: "2025-10-26T12:00:00Z", // ISO string, this is OVERDUE
    description:
      "Compile all findings from the user interviews and survey data into a comprehensive report. The report should include an executive summary, key insights, user personas, and actionable recommendations for the design team.\n\nMake sure to reference the project brief for formatting guidelines and required sections.",
    checklist: {
      title: "Checklist",
      items: [
        { id: 1, text: "Draft executive summary", isDone: true },
        { id: 2, text: "Create user personas", isDone: true },
        { id: 3, text: "Finalize recommendations", isDone: false },
      ],
    },
    activity: [
      {
        id: 1,
        type: "comment",
        user: { name: "Sarah Day", avatar: "/default-avatar.png" },
        timestamp: "2h ago",
        content:
          "Looks good! Just a heads-up, I've added the survey result spreadsheet to the Google Drive folder.",
      },
      {
        id: 2,
        type: "action",
        user: { name: "Jane Doe", avatar: "/default-avatar.png" },
        timestamp: "1d ago",
        content: "moved this card from 'To Do' to 'In Progress'",
      },
    ],
    currentUserAvatar: "/default-avatar.png",
  },
  // Other cards will fall back to basic data
};

// --- Tag Component (Your original) ---
const Tag = ({ text, type }: { text: string; type: string }) => {
  const tagColors: Record<string, string> = {
    high: "bg-warning/10 text-warning",
    medium: "bg-warning/10 text-warning",
    low: "bg-info/10 text-info",
    due: "bg-error/10 text-error",
    completed: "bg-success/10 text-success",
    default: "bg-muted/10 text-muted",
  };

  const tagIcons: Record<string, JSX.Element | null> = {
    high: <AlertOctagon className="w-3.5 h-3.5" />,
    medium: <ArrowUp className="w-3.5 h-3.5" />,
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

// --- Card Component (Your original, with one fix) ---
const Card = ({ card, onClick }: any) => {
  return (
    <div
      className="bg-background p-4 rounded-lg border border-border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      // *** MODIFIED: Pass the whole card object ***
      onClick={() => onClick(card)}
    >
      <span className="text-foreground font-medium">{card.title}</span>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-wrap items-center gap-2 text-muted">
          {card.tags.map((tag: any) => (
            <Tag key={tag.id} text={tag.text} type={tag.type} />
          ))}
          {card.comments > 0 && (
            <span className="flex items-center gap-1 text-sm">
              <MessageSquare className="w-4 h-4" />
              {card.comments}
            </span>
          )}
          {card.attachments > 0 && (
            <span className="flex items-center gap-1 text-sm">
              <Paperclip className="w-4 h-4" />
              {card.attachments}
            </span>
          )}
        </div>
        <div className="flex -space-x-2">
          {card.assignees.map((assignee: string, idx: number) => (
            <Image
              key={idx}
              src={assignee || "/default-avatar.png"} // Fallback
              width={24}
              height={24}
              className="rounded-full"
              alt={`Assignee ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// --- List Component (Your original, with one fix) ---
const List = ({ list, onCardClick }: any) => {
  return (
    <div className="shrink-0 w-80 bg-[rgba(255,255,255,0.02)] bg-opacity-30 p-3 rounded-lg shadow-sm self-start">
      <div className="flex justify-between items-center mb-4 px-1">
        <h2 className="flex items-center gap-2 font-medium text-foreground">
          {list.title}
          <span className="text-xs font-normal text-muted bg-border/50 px-2 py-0.5 rounded-full">
            {list.cards.length}
          </span>
        </h2>
        <button className="text-muted hover:text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-col gap-3 pr-1">
        {list.cards.map((card: any) => (
          <Card
            key={card.id}
            card={card}
            // *** MODIFIED: Pass card and list title ***
            onClick={() => onCardClick(card, list.title)}
          />
        ))}
      </div>
      <button className="flex items-center gap-2 w-full text-left p-2 mt-3 rounded-md text-muted hover:bg-border hover:text-foreground transition-colors">
        <Plus className="w-4 h-4" />
        Add a card
      </button>
    </div>
  );
};

// --- 
// --- 
// --- HERE ARE THE NEW MODAL AND HELPER COMPONENTS ---
// --- 
// --- 

// --- Helper: Avatar Stack for Assigned Members ---
const AvatarStack = ({
  members,
}: {
  members: { avatar: string; name: string; id: number }[];
}) => (
  <div className="flex -space-x-2 relative">
    {members.map((member, idx) => (
      <Image
        key={member.id || idx}
        src={member.avatar || "/default-avatar.png"} // Fallback
        alt={member.name}
        width={32}
        height={32}
        className="rounded-full border-2 border-white"
        onError={(e) => (e.currentTarget.src = "/default-avatar.png")} // Fallback
      />
    ))}
    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 border-2 border-white">
      +
    </button>
  </div>
);

// --- Helper: Due Date Pill ---
const DueDate = ({ dateString }: { dateString: string }) => {
  const dueDate = new Date(dateString);
  const now = new Date("2025-10-30T23:40:42Z"); // Hardcoding "now" to match image's "Overdue"
  const isOverdue = dueDate < now;
  const formattedDate = dueDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric", // Added year for clarity
  });

  if (isOverdue) {
    return (
      <span className="bg-red-100 text-red-700 text-sm font-medium px-3 py-1 rounded-md">
        Overdue: {formattedDate.replace(", 2025", "")} {/* Match image */}
      </span>
    );
  }
  return (
    <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-md">
      {formattedDate}
    </span>
  );
};

// --- Helper: Checklist with Progress Bar ---
const Checklist = ({
  checklist,
}: {
  checklist: { title: string; items: { id: number; text: string; isDone: boolean }[] };
}) => {
  if (!checklist || !checklist.items || checklist.items.length === 0) {
    return null; // Don't render if there's no checklist
  }

  const doneItems = checklist.items.filter((item) => item.isDone).length;
  const totalItems = checklist.items.length;
  const progress = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700">
          Checklist ({doneItems}/{totalItems})
        </h3>
      </div>
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Checklist Items */}
      <div className="space-y-2">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={item.isDone}
              readOnly // In a real app, this would have an onChange
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor={`item-${item.id}`}
              className={`text-sm ${
                item.isDone ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {item.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Helper: Activity Feed ---
const ActivityFeed = ({
  activity,
}: {
  activity: {
    id: number;
    type: string;
    user: { name: string; avatar: string };
    timestamp: string;
    content: string;
  }[];
}) => {
  if (!activity || activity.length === 0) {
    return <p className="text-sm text-gray-500">No activity yet.</p>;
  }

  return (
    <div className="space-y-4">
      {activity.map((item) => (
        <div key={item.id} className="flex gap-3">
          <Image
            src={item.user.avatar || "/default-avatar.png"} // Fallback
            alt={item.user.name}
            width={32}
            height={32}
            className="rounded-full h-8 w-8 mt-1"
            onError={(e) => (e.currentTarget.src = "/default-avatar.png")} // Fallback
          />
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-bold">{item.user.name}</span>{" "}
              {item.type === "action" ? (
                <span className="text-gray-600">{item.content}</span>
              ) : (
                ""
              )}
              <span className="text-xs text-gray-400 ml-2">
                {item.timestamp}
              </span>
            </p>
            {item.type === "comment" && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 mt-1 text-sm text-gray-700 shadow-sm">
                {item.content}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const Modal = ({ card, onClose }: any) => {
  if (!card) return null;

  // Destructure the *detailed* data.
  // This data comes from the `modalDataStore` via `handleCardClick`.
  const {
    title,
    listTitle,
    assignedMembers,
    dueDate,
    description,
    checklist,
    activity,
    currentUserAvatar,
  } = card;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      {/* Main modal card: Using your theme's background */}
      <div className="bg-background rounded-xl w-full max-w-5xl h-[90vh] flex flex-col relative overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground z-10"
        >
          <X size={24} />
        </button>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Main 2-column grid */}
          <div className="grid grid-cols-3 gap-8">
            {/* --- LEFT COLUMN (Content) --- */}
            <div className="col-span-3 md:col-span-2 space-y-6 border-r border-border pr-6">
              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground pr-10">
                {title}
              </h1>
              <p className="text-sm text-muted">
                In list:{" "}
                <span className="font-medium text-foreground">{listTitle}</span>
              </p>

              {/* Meta data: Assignees & Due Date */}
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {assignedMembers && assignedMembers.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                      Assigned Members
                    </h3>
                    <AvatarStack members={assignedMembers} />
                  </div>
                )}
                {dueDate && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                      Due Date
                    </h3>
                    <DueDate dateString={dueDate} />
                  </div>
                )}
             </div>

              {/* Description */}
              {description && (
                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Type size={20} />
                    Description
                  </h3>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {description}
                  </p>
                </section>
              )}

              {/* Checklist */}
              {checklist && checklist.items.length > 0 && (
                <section className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <CheckSquareIcon size={20} />
                    Checklist
                  </h3>
                  <Checklist checklist={checklist} />
                </section>
              )}
            </div>

            {/* --- RIGHT COLUMN (Actions & Activity) --- */}
            <div className="col-span-3 md:col-span-1 space-y-6">
              {/* Actions */}
              <section>
                <h3 className="text-xs font-semibold text-muted uppercase mb-2">
                  Actions
                </h3>
                {/* Using your theme's 'border' and 'error' colors */}
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-2 w-full bg-border/70 hover:bg-border text-foreground px-3 py-2 rounded-md text-sm">
                    <Paperclip size={16} /> Attach File
                  </button>
                  <button className="flex items-center gap-2 w-full bg-border/70 hover:bg-border text-foreground px-3 py-2 rounded-md text-sm">
                    <ArrowRight size={16} /> Move Card
                  </button>
                  <button className="flex items-center gap-2 w-full bg-border/70 hover:bg-error/10 text-foreground hover:text-error px-3 py-2 rounded-md text-sm">
                    <Trash2 size={16} /> Delete Card
                  </button>
                </div>
              </section>

              {/* Activity */}
              <section className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Activity size={20} />
                  Activity
                </h3>

                {/* Comment Box */}
               <div className="flex gap-3">
                  <Image
                    src={currentUserAvatar || "/default-avatar.png"} // Fallback
                    alt="Current User"
                    width={32}
                    height={32}
                    className="rounded-full h-8 w-8"
                    onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
                  />
                  <div className="flex-1 space-y-2">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-3 rounded-md border border-border bg-white text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                      rows={3}
                    />
                    <button className="px-4 py-2 bg-primary text-background rounded-md text-sm font-medium hover:bg-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                      Comment
                    </button>
                  </div>
                </div>

                {/* Activity Feed */}
                <ActivityFeed activity={activity || []} />
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- App Header (Your original) ---
const AppHeader = () => {
  return (
    <nav className="bg-background border-b border-border px-4 py-3 md:px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <LayoutGrid className="w-6 h-6 text-primary" />
          <span className="w-px h-6 bg-border hidden sm:block"></span>
          <h1 className="text-lg font-semibold text-foreground hidden sm:block">
            PSY101: Research Paper
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-6 text-muted" />
            <input
              type="text"
              placeholder="Search cards..."
              className="pl-10 pr-4 py-2 w-48 md:w-64 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex -space-x-2">
            <Image
              src="/default-avatar.png"
              alt="Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <Image
              src="/default-avatar.png"
              alt="Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
            <Image
              src="/default-avatar.png"
              alt="Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow-sm hover:bg-(--color-hover) transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Invite
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- Board Header (Your original) ---
const BoardHeader = () => {
  return (
    <div className="px-4 pt-8 md:px-8 flex justify-between items-center">
      <h1 className="text-2xl font-extrabold font-heading text-foreground">
        Research Paper Board
      </h1>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border text-sm font-medium rounded-md shadow-sm hover:bg-border/50 transition-colors">
          <Filter className="w-4 h-4 text-muted" />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border text-sm font-medium rounded-md shadow-sm hover:bg-border/50 transition-colors">
          <ArrowUpDown className="w-4 h-4 text-muted" />
          Sort
        </button>
      </div>
    </div>
  );
};

// --- 
// --- Main App: MODIFIED TO USE THE NEW DATA ---
// --- 
export default function App() {
  const [board, setBoard] = useState(initialBoardData);
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // *** THIS IS THE CRITICAL CHANGE ***
  // It now finds DETAILED data from the modalDataStore
  // instead of just passing the simple card data.
  const handleCardClick = (card: any, listTitle: string) => {
    // 1. Find detailed data from our new store
    const detailedData = modalDataStore[card.id];

    // 2. Create a complete card object for the modal
    let modalCardData;
    if (detailedData) {
      // If we have detailed data, use it, but keep board-level title/list
      modalCardData = {
        ...detailedData,
        title: card.title, // Keep the original title from the board
        listTitle: listTitle, // Add the list title
      };
    } else {
      // If no detailed data exists (for other cards), create a
      // fallback structure so the modal doesn't crash.
      modalCardData = {
        ...card, // Use basic card data
        listTitle: listTitle,
        // Add *empty* or *derived* properties that the modal expects
        assignedMembers: card.assignees.map((a: string, i: number) => ({
          id: i,
          name: "User",
          avatar: a || "/default-avatar.png",
        })),
        dueDate: card.due,
        checklist: { title: "Checklist", items: [] }, // Empty checklist
        activity: [], // Empty activity
        currentUserAvatar: "/default-avatar.png",
      };
    }

    // 3. Set this new, complete object as the selectedCard
    setSelectedCard(modalCardData);
  };

  const closeModal = () => setSelectedCard(null);

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen w-full bg-background">
        <AppHeader />
        <BoardHeader />
        <main className="flex flex-1 gap-4 overflow-x-auto p-4 md:px-8 pb-4 w-full">
          <div className="flex gap-4 min-w-full w-auto">
            {board.lists.map((list) => (
              <List
                // *** MODIFIED: Pass the new handler ***
                onCardClick={handleCardClick}
                key={list.id}
                list={list}
              />
            ))}
            <button className="shrink-0 flex items-center justify-center gap-2 w-80 h-12 p-3 rounded-lg bg-background border border-border text-muted hover:bg-border hover:text-foreground transition-colors">
              <Plus className="w-4 h-4" />
              Add another list
            </button>
          </div>
        </main>
        {/* Modal */}
        <Modal card={selectedCard} onClose={closeModal} />
      </div>
    </DashboardLayout>
  );
}