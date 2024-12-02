"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { joinSession } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export const JoinSessionDialog = ({ sessionCode }: { sessionCode: string }) => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <DialogTitle>Not in session</DialogTitle>
        <DialogHeader>You are not part of this session</DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            onClick={() => {
              joinSession(sessionCode);
              redirect(`/session/${sessionCode}/lobby`);
            }}
          >
            Join Session
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              redirect("/session");
            }}
          >
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
