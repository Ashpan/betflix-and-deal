import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { CreateSessionForm } from "./CreateSessionForm";
import { JoinSessionForm } from "./JoinSessionForm";

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
    <div className="flex-1 flex flex-col gap-6 px-4">
      <Header title={metadata.title as string} />
      <div>
        <CreateSessionForm user={user} />
      </div>
      <Separator />
      <div className="basis-1/2">
        <JoinSessionForm user={user} />
      </div>
    </div>
  );
};

export default SessionsPage;
