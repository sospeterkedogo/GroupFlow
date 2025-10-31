import React from "react";
import Image from "next/image";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Sample activity data
const activities = [
  {
    id: 1,
    type: "mention",
    user: "Sarah Smith",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    message: 'mentioned you in a comment on "Write Introduction".',
    time: "2 hours ago",
    project: "CS Capstone",
    unread: true,
  },
  {
    id: 2,
    type: "move",
    user: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    message: 'moved the card "Finalize Slides" from In Progress to Done.',
    time: "5 hours ago",
    project: "History Presentation",
    unread: true,
  },
  {
    id: 3,
    type: "add",
    user: "You",
    avatar: null,
    message: "added Mark Johnson to the project CS Capstone.",
    time: "Yesterday at 3:45 PM",
    project: "CS Capstone",
    unread: false,
  },
  {
    id: 4,
    type: "comment",
    user: "Emily White",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    message: 'commented on "Literature Review".',
    time: "Yesterday at 11:10 AM",
    project: "Biology 101 Report",
    unread: false,
  },
];

const ActivityFeed = () => {
  return (
    <DashboardLayout>
    <div className="min-h-screen bg-[var(--color-background)] p-8 font-sans">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-heading font-extrabold text-[var(--color-foreground)]">
          Activity Feed
        </h1>
        <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-hover)] transition">
          Mark all as read
        </button>
      </div>
      <p className="text-[var(--color-muted)] mb-4">
        Recent activities, mentions, and updates across your projects.
      </p>

      <div className="flex items-center mb-6">
        <input
          type="text"
          placeholder="Filter activities by keyword or user..."
          className="flex-1 px-4 py-2 border border-[var(--color-border)] rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <div className="ml-4 flex space-x-2">
          <button className="px-3 py-2 border border-[var(--color-border)] rounded text-[var(--color-foreground)] hover:bg-[var(--color-hover)] transition">
            Unread
          </button>
          <button className="px-3 py-2 border border-[var(--color-border)] rounded text-[var(--color-foreground)] hover:bg-[var(--color-hover)] transition">
            All Activity
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[var(--color-foreground)] font-semibold">Today</h2>
        {activities
          .filter((a) => a.time.includes("hours ago"))
          .map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between p-4 rounded border border-[var(--color-border)] ${
                activity.unread ? "bg-[var(--color-accent)]/10" : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-4">
                {activity.avatar && (
                  <Image
                    src={'/default-avatar.png'}
                    alt={activity.user}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-[var(--color-foreground)]">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.message}{" "}
                    <span className="text-[var(--color-primary)]">
                      {activity.project}
                    </span>
                  </p>
                  <p className="text-[var(--color-muted)] text-sm">{activity.time}</p>
                </div>
              </div>
              {activity.unread && <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div>}
            </div>
          ))}

        <h2 className="text-[var(--color-foreground)] font-semibold mt-6">Yesterday</h2>
        {activities
          .filter((a) => a.time.includes("Yesterday"))
          .map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center justify-between p-4 rounded border border-[var(--color-border)] ${
                activity.unread ? "bg-[var(--color-accent)]/10" : "bg-background"
              }`}
            >
              <div className="flex items-center space-x-4">
                {activity.avatar && (
                  <Image
                    src={'/default-avatar.png'}
                    alt={activity.user}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-[var(--color-foreground)]">
                    <span className="font-semibold">{activity.user}</span> {activity.message}
                  </p>
                  <p className="text-[var(--color-muted)] text-sm">{activity.time}</p>
                </div>
              </div>
              {activity.unread && <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]"></div>}
            </div>
          ))}
      </div>
    </div>
    </DashboardLayout>
  );
};

export default ActivityFeed;
