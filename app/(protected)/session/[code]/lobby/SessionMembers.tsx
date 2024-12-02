"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getMember, getMembers } from "@/lib/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const SessionMembers = ({ sessionCode }: { sessionCode: string }) => {
  const [members, setMembers] = useState<[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await getMembers(sessionCode);
        if (error) {
          throw error;
        }
        const members =
          data === null
            ? []
            : data.session_participants.map((member) => {
                return { ...member.profiles, sp_id: member.id };
              });
        setMembers(members);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchMembers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleSub = async (payload: any) => {
      switch (payload.eventType) {
        case "INSERT":
          // eslint-disable-next-line no-case-declarations
          const { data, error } = await getMember(
            payload.new.user_id,
            sessionCode,
          );
          if (error) {
            console.error(error);
            break;
          }
          setMembers((prev) => [...prev, data]);
          break;
        case "DELETE":
          setMembers((prev) => prev.filter((m) => m.sp_id !== payload.old.id));
          break;
        default:
          break;
      }
    };

    const supabase = createClient();
    // Subscribe to changes in the session_participants table
    supabase
      .channel(`session-${sessionCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "session_participants" },
        handleSub,
      )
      .subscribe();
  }, [sessionCode]);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Session Members</h2>
      {members.length === 0 ? (
        <LoadingSpinner size={36} color="text-green-500" />
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.sp_id}>{member.username || member.id}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionMembers;
