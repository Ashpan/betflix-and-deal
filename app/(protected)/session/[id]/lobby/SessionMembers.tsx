"use client";

import { Tables } from "@/lib/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const SessionMembers = ({ sessionId }: { sessionId: string }) => {
  const [members, setMembers] = useState<Tables<"profiles">[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select(
            `
          id,
          session_participants (
            status,
            user_id,
            profiles (
              id,
              username,
              display_name,
              avatar_url
            )
          )
          `,
          )
          .eq("code", sessionId)
          .single();

        if (error) {
          throw error;
        }
        console.log(data);
        const members: Tables<"profiles">[] = data?.session_participants.map(
          (participant) => ({
            ...participant.profiles,
          }),
        );
        console.log(members);
        setMembers(members);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMembers();

    const subscription = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_participants",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setMembers((current) => [...current, payload.new]);
              break;
            case "DELETE":
              setMembers(members.filter((m) => m.id !== payload.old.id));
              break;
            case "UPDATE":
              setMembers(
                members.map((m) => (m.id === payload.new.id ? payload.new : m)),
              );
              break;
            default:
              break;
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [sessionId]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Session Members</h2>
      <ul className="space-y-2">
        {members.map((member) => (
          <li key={member.id} className="p-2 bg-gray-100 rounded">
            {member.username || member.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionMembers;
