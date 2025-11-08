// This is the shape of the data our SQL function returns.
// This is your new single source of truth.

export interface Assignee {
  user_id: string;
  username: string;
  avatar_url: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  is_done: boolean;
  position: number;
}

export interface Checklist {
  id: string;
  title: string;
  position: number;
  items: ChecklistItem[];
}

export interface Activity {
  id: string;
  user_id: string;
  type: 'comment' | 'action'; // 'action' for "moved this card..."
  content: string;
  created_at: string;
  user_username: string;
  user_avatar_url: string;
}

export interface Card {
  id: string;
  title: string;
  position: number;
  description?: string;
  priority?: string | null | undefined;
  list_id: string;
  due_date?: string | null | undefined;
  assignees: Assignee[];
  checklists: Checklist[];
  activity: Activity[];
}

export interface List {
  id: string;
  title: string;
  position: number;
  cards: Card[];
}

export interface Project {
  id: string;
  name: string;
  course?: string;
  due_date?: string;
  lists: List[];
}
