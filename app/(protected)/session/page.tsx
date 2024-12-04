import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { CreateSessionForm } from "@/app/components/CreateSessionForm";
import { JoinSessionForm } from "@/app/components/JoinSessionForm";
import { ActiveSessions } from "@/app/components/ActiveSessions";

export const metadata: Metadata = {
  title: "Sessions",
};

const SessionsPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8">{metadata.title as string}</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CreateSessionForm user={user} />
          <JoinSessionForm user={user} />
          <ActiveSessions userId={user.id} />
        </div>
      </div>
    </>
  );
};

export default SessionsPage;
