"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { leaveSession } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export const LeaveSessionButton = ({
  sessionCode,
}: {
  sessionCode: string;
}) => {
  const { toast } = useToast();

  const leaveSessionHandler = async () => {
    const { error } = await leaveSession(sessionCode);
    if (error) {
      console.error(error.message);
    } else {
      toast({
        title: "Success",
        description: "You have successfully left the session.",
      });
      redirect("/session");
    }
  };

  return (
    <Button variant="destructive" onClick={leaveSessionHandler}>
      Leave Session
    </Button>
  );
};
