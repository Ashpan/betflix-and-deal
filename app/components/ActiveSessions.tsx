import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Your Active Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length > 0 ? (
          <ul className="space-y-4">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{session.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Buy-in: ${session.buyIn}
                  </p>
                </div>
                <Link
                  className="basis-* px-5"
                  href={`/session/${session.code}/lobby`}
                >
                  <Button>Join</Button>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">
            No active sessions
          </p>
        )}
      </CardContent>
    </Card>
  );
};
