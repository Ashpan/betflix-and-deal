import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/types/database.types";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const ActiveSessions = async ({ userId }: { userId: string }) => {
  console.log(userId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*, session_participants!inner()")
    .neq("status", "completed")
    .neq("status", "cancelled")
    .eq("session_participants.user_id", userId);

  const sessions: Tables<"sessions">[] = error || !data ? [] : data;

  return (
    <div>
      <h1>Your Active Sessions</h1>
      <div>
        {sessions.map((session) => (
          <div key={session.id} className="container flex px-4">
            <p className="basis-*">{session.name}</p>
            <Link
              className="basis-* px-5"
              href={`/session/${session.code}/lobby`}
            >
              <Button>Join Session</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
