'use client'

import { ReactNode, useEffect } from "react"; // Changed useMemo to useEffect
import { RoomProvider } from "@/liveblocks.config"; 
import { ClientSideSuspense } from "@liveblocks/react";
import { BoardLoader } from "@/components/BoardLoader";
import { LiveList, LiveObject } from "@liveblocks/client";
import { useStorage, useMutation } from "@/liveblocks.config";
import { Project } from "@/lib/types";

function RoomInitializer({ id, children }: { id: string, children: ReactNode }) {
  const lists = useStorage((root) => root.lists);
  
  const initBoard = useMutation(({ storage }, initialData: Project) => {
    const rootLists = storage.get("lists");
    
    if (rootLists && rootLists.length === 0) {
       storage.set("projectMeta", new LiveObject({
         id: initialData.id,
         name: initialData.name,
         course: initialData.course || null,
         due_date: initialData.due_date || null
       }));

       initialData.lists.forEach(list => {
         const liveCards = new LiveList(
           (list.cards || []).map(card => {
             const liveChecklists = new LiveList(
               (card.checklists || []).map(cl => new LiveObject({
                 id: cl.id,
                 title: cl.title,
                 position: cl.position,
                 items: new LiveList((cl.items || []).map(item => new LiveObject({
                   id: item.id,
                   text: item.text,
                   is_done: item.is_done,
                   position: item.position
                 })))
               }))
             );

             const liveActivity = new LiveList(
                (card.activity || []).map(act => new LiveObject({
                    id: act.id,
                    user_id: act.user_id,
                    type: act.type,
                    content: act.content,
                    created_at: act.created_at,
                    user_username: act.user_username || null,
                    user_avatar_url: act.user_avatar_url || null
                }))
             );

             return new LiveObject({
               id: card.id,
               title: card.title,
               description: card.description || null,
               priority: card.priority || null,
               due_date: card.due_date || null,
               position: card.position,
               list_id: list.id,
               checklists: liveChecklists,
               activity: liveActivity
             });
           })
         );

         rootLists.push(new LiveObject({
           id: list.id,
           title: list.title,
           position: list.position,
           cards: liveCards
         }));
       });
    }
  }, []);

  // CHANGE: Using useEffect for data fetching side-effect
  useEffect(() => {
    if (lists === undefined) return; 
    if (lists && lists.length > 0) return; 

    console.log("Room empty. Fetching from DB...");
    const loadData = async () => {
        try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error("Failed to fetch initial board");
        const data: Project = await res.json();
        
        data.lists?.sort((a, b) => a.position - b.position);
        data.lists?.forEach(l => {
            l.cards?.sort((a, b) => a.position - b.position);
            l.cards?.forEach(c => {
                c.checklists?.sort((a, b) => a.position - b.position);
                c.checklists?.forEach(cl => cl.items?.sort((a, b) => a.position - b.position));
            });
        });

        initBoard(data);
        } catch (err) {
        console.error("Failed to initialize room:", err);
        }
    };
    loadData();
  }, [id, lists, initBoard]);

  return <>{children}</>;
}

export default function Room({ id, children }: { id: string, children: ReactNode }) {
  return (
    <RoomProvider 
        id={id} 
        initialPresence={{ cursor: null, selection: [] }}
        initialStorage={{
            projectMeta: new LiveObject({ id, name: "Loading...", course: null, due_date: null }),
            lists: new LiveList([])
        }}
    >
      <ClientSideSuspense fallback={<BoardLoader message="Connecting to room..." />}>
        {() => (
          <RoomInitializer id={id}>
             {children}
          </RoomInitializer>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
}