import { isUserInSession } from "@/lib/supabase/queries";
import { SessionCard } from "./SessionCard";
import SessionMembers from "./SessionMembers";
import { createClient } from "@/utils/supabase/server";
import { JoinSessionDialog } from "./JoinSessionDialog";
import { LeaveSessionButton } from "./LeaveSessionButton";

const SessionLobby = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const code = (await params).code;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) {
    return;
  }
  if (!(await isUserInSession(user.id, code))) {
    return <JoinSessionDialog sessionCode={code} />;
  }

  return (
    <div>
      <h1>Session Lobby</h1>
      <SessionCard sessionCode={code} />
      <SessionMembers sessionCode={code} />
      <LeaveSessionButton sessionCode={code} />
    </div>
  );
};

export default SessionLobby;
