import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
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
      <Header title={metadata.title as string} />
      <div className="flex-1 flex flex-row gap-6 px-4">
        <div className="basis-2/3">
          <div className="pb-4">
            <CreateSessionForm user={user} />
          </div>
          <Separator />
          <div>
            <JoinSessionForm user={user} />
          </div>
        </div>
        <div className="basis-1/3">
          <ActiveSessions userId={user.id} />
        </div>
      </div>
    </>
  );
};

export default SessionsPage;
