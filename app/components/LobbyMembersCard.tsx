"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfile } from "@/hooks/useProfile";
import { getSessionMember } from "@/lib/supabase/queries";
import { Tables } from "@/lib/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Crown, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SessionMember {
  id: string;
  sp_id: string;
  username: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  initial_buy_in: number;
  final_stack: number;
  status: string;
  is_owner: boolean;
}

interface LobbyMembersCardProps {
  initialMembers: SessionMember[];
  sessionCode: string;
}

export const LobbyMembersCard = ({
  initialMembers,
  sessionCode,
}: LobbyMembersCardProps) => {
  const [members, setMembers] = useState<SessionMember[]>(initialMembers);

  const { profile } = useProfile();
  const currentUserId = profile ? profile.id : "";

  useEffect(() => {
    const handleRealtime = async (
      payload: RealtimePostgresChangesPayload<Tables<"session_participants">>,
    ) => {
      switch (payload.eventType) {
        case "INSERT": {
          const { data, error } = await getSessionMember(
            payload.new.user_id,
            sessionCode,
          );
          if (error) {
            console.error(error);
            break;
          }
          if (!data) {
            break;
          }
          console.log(data);
          setMembers((prev) => [...prev, data]);
          break;
        }
        case "DELETE": {
          setMembers((prev) => prev.filter((m) => m.sp_id !== payload.old.id));
          break;
        }
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
        handleRealtime,
      )
      .subscribe();
  }, [sessionCode]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Session Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] border rounded-md p-2">
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.sp_id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div className="flex items-center">
                  <UserCircle className="mr-2 h-5 w-5" />
                  <span>{member.username}</span>
                  {member.id === currentUserId && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      (You)
                    </span>
                  )}
                </div>
                {member.is_owner && (
                  <Crown
                    className="h-5 w-5 text-yellow-500"
                    aria-label="Session Owner"
                  />
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
