import { createClient } from "@/utils/supabase/server";
import { GameManagementClient } from "@/app/components/GameManagementClient";
import { IMember, ISessionDetails } from "@/lib/types/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface GameManagementPageProps {
  params: Promise<{ code: string }>;
}

const GameManagementPage = async ({ params }: GameManagementPageProps) => {
  const code = (await params).code;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("sessions")
    .update({
      status: "active",
    })
    .eq("code", code);

  const { data: session } = (await supabase
    .from("sessions")
    .select(
      `
      id,
      name,
      code,
      status,
      buy_in_amount,
      created_by,
      session_participants (
        id,
        user_id,
        buy_ins,
        final_stack,
        status,
        profiles (
          id,
          display_name,
          email,
          avatar_url
        )
      )
    `,
    )
    .eq("code", code)
    .single()) as PostgrestSingleResponse<ISessionDetails>;

  const { data: members } = (await supabase
    .from("profiles")
    .select("*")) as PostgrestSingleResponse<IMember[]>;

  if (!session?.session_participants.some((p) => p.user_id === user?.id)) {
    redirect("/home");
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GameManagementClient
        session={session as ISessionDetails}
        members={members as IMember[]}
        isOwner={
          session?.created_by === (await supabase.auth.getUser()).data.user?.id
        }
      />
    </Suspense>
  );
};

export default GameManagementPage;
