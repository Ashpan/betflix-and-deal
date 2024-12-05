"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { joinSession } from "@/lib/supabase/queries";
import { useState } from "react";

interface LobbyJoinDialogProps {
  sessionCode: string;
  userInSession: boolean;
}

export const LobbyJoinDialog = ({
  sessionCode,
  userInSession,
}: LobbyJoinDialogProps) => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(!userInSession);

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    joinSession(sessionCode);
    setIsJoinDialogOpen(false);
  };

  return (
    <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Poker Session</DialogTitle>
          <DialogDescription>
            Click below to join the session with code: {sessionCode}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoinSession}>
          <DialogFooter>
            <Button type="submit">Join Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
