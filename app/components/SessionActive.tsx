import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface ActiveSessionsProps {
  userId: string;
}

interface ISession {
  id: string;
  name: string;
  code: string;
  session_participants: {
    buy_ins: number;
  }[];
}

export const ActiveSessions = async ({ userId }: ActiveSessionsProps) => {
  console.log(userId);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, name, code, session_participants!inner(buy_ins)")
    .neq("status", "completed")
    .neq("status", "cancelled")
    .eq("session_participants.user_id", userId);

  const sessions: ISession[] = error || !data ? [] : data;

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
                    Buy-in: ${session.session_participants[0].buy_ins}
                  </p>
                  <p className="text-sm text-muted-foreground font-bold">
                    {session.code}
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
