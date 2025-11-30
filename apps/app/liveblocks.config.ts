import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { LiveList, LiveObject } from "@liveblocks/client";

type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[] | null;
};

type Storage = {
  projectMeta: LiveObject<{
    id: string;
    name: string;
    course: string | null;
    due_date: string | null;
  }>;
  lists: LiveList<LiveObject<{
    id: string;
    title: string;
    position: number;
    cards: LiveList<LiveObject<{
      id: string;
      title: string;
      description: string | null;
      priority: string | null; 
      due_date: string | null;
      position: number;
      list_id: string;
      
      // --- NEW NESTED STRUCTURES ---
      activity: LiveList<LiveObject<{
        id: string;
        user_id: string;
        type: string;
        content: string;
        created_at: string;
        // We store denormalized user info for ease of display
        user_username: string | null;
        user_avatar_url: string | null;
      }>>;
      
      checklists: LiveList<LiveObject<{
        id: string;
        title: string;
        position: number;
        items: LiveList<LiveObject<{
          id: string;
          text: string;
          is_done: boolean;
          position: number;
        }>>;
      }>>;
    }>>
  }>>
};

type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
  };
};

type RoomEvent = {
  type: "TOAST";
  message: string;
}

export const client = createClient({
  authEndpoint: "/api/liveblocks-auth", 
});

export const {
  RoomProvider,
  useOthers,
  useSelf,
  useStorage,
  useMutation,
  useRoom,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);