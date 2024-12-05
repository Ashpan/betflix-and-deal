import { LobbySessionCard } from "@/app/components/LobbySessionCard";
import {
  getAllMembers,
  getSessionDetails,
  getSessionMembers,
  isUserInSession,
} from "@/lib/supabase/queries";
import { LobbyMembersCard } from "@/app/components/LobbyMembersCard";
import { LobbyJoinDialog } from "@/app/components/LobbyJoinDialog";
import { createClient } from "@/utils/supabase/server";

const PokerSessionPage = async ({
  params,
}: {
  params: Promise<{ code: string }>;
}) => {
  const code = (await params).code;
  const { data: sessionDetails, error: detailsError } =
    await getSessionDetails(code);
  const { data: sessionMembers, error: memberError } =
    await getSessionMembers(code);
  const { data: allMembers, error: allMembersError } = await getAllMembers();

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error) {
    return;
  }
  const userInSession = await isUserInSession(user.id, code);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-7x1 mx-auto">
        <LobbySessionCard
          sessionName={sessionDetails.name}
          sessionCode={sessionDetails.code}
          buyInAmount={sessionDetails.buy_in_amount}
          allMembers={allMembers || []}
        />
        <LobbyMembersCard initialMembers={sessionMembers} sessionCode={code} />
        <LobbyJoinDialog sessionCode={code} userInSession={userInSession} />
      </div>
    </div>
  );
};

export default PokerSessionPage;
