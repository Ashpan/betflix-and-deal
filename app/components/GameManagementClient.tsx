"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { AddMemberCombobox } from "./AddMemberCombobox";
import PokerHands from "./GamePokerHands";
import { GamePlayerRow } from "./GamePlayerRow";
import { redirect } from "next/navigation";
import {
  IMember,
  ISessionDetails,
  ISessionParticipantProfile,
} from "@/lib/types/types";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { Tables } from "@/lib/types/database.types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { useQRCode } from "next-qrcode";

interface GameManagementClientProps {
  session: ISessionDetails;
  members: IMember[];
  isOwner: boolean;
}

export const GameManagementClient = ({
  session,
  members,
  isOwner,
}: GameManagementClientProps) => {
  const [participants, setParticipants] = useState<
    ISessionParticipantProfile[]
  >(session.session_participants);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false);
  const [qrCodeUrl, setQRCodeUrl] = useState<string>("");

  const supabase = createClient();
  const { toast } = useToast();
  const { SVG } = useQRCode();

  useEffect(() => {
    setQRCodeUrl(window.location.toString());
  }, []);

  useEffect(() => {
    const participantsChannel = supabase
      .channel("session_participants")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_participants",
          filter: `session_id=eq.${session.id}`,
        },
        (
          payload: RealtimePostgresChangesPayload<
            Tables<"session_participants">
          >,
        ) => {
          if (!payload.new) return;

          const newParticipant = payload.new as Tables<"session_participants">;

          setParticipants((current) => {
            const updated = [...current];
            const index = updated.findIndex((p) => p.id === newParticipant.id);
            if (index >= 0) {
              updated[index] = {
                ...updated[index],
                id: newParticipant.id,
                session_id: newParticipant.session_id,
                user_id: newParticipant.user_id,
                buy_ins: newParticipant.buy_ins || 0,
                final_stack: newParticipant.final_stack,
                status: (newParticipant.status ||
                  "invited") as ISessionParticipantProfile["status"],
                created_at: newParticipant.created_at,
                updated_at: newParticipant.updated_at,
                profiles: updated[index].profiles,
              };
            } else {
              const member = members.find(
                (m) => m.id === newParticipant.user_id,
              );
              if (!member) return updated;

              const newEntry: ISessionParticipantProfile = {
                id: newParticipant.id,
                session_id: newParticipant.session_id,
                user_id: newParticipant.user_id,
                buy_ins: newParticipant.buy_ins || 0,
                final_stack: newParticipant.final_stack,
                status:
                  newParticipant.status as ISessionParticipantProfile["status"],
                created_at: newParticipant.created_at,
                updated_at: newParticipant.updated_at,
                profiles: member,
              };
              updated.push(newEntry);
            }
            return updated;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(participantsChannel);
    };
  }, [session.id, supabase]);

  const handleBuyIn = async (userId: string, amount: number) => {
    if (!isOwner) return;
    const participant = participants.find((p) => p.user_id === userId);
    const newBuyIn = (participant?.buy_ins || 0) + amount;

    const { error } = await supabase
      .from("session_participants")
      .update({
        buy_ins: newBuyIn,
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error adding buy-in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCashOut = async (userId: string, amount: number) => {
    if (!isOwner) return;
    const { error } = await supabase
      .from("session_participants")
      .update({
        final_stack: amount,
        status: "completed",
      })
      .eq("session_id", session.id)
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error cashing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEndSession = async () => {
    if (!isOwner) return;

    const incomplete = participants.filter(
      (p) => p.status !== "completed" && p.status !== "declined",
    );

    if (incomplete.length > 0) {
      toast({
        title: "Cannot end session",
        description: "All players must cash out first",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (error) {
      toast({
        title: "Error ending session",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Session ended",
        description: "The session has been completed",
      });
      redirect("/home");
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{session.name}</h1>
          <p className="text-muted-foreground">Session Code: {session.code}</p>
        </div>
        {isOwner && session.status === "active" && (
          <Button variant="destructive" onClick={handleEndSession}>
            End Session
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Dialog open={isQRCodeOpen} onOpenChange={setIsQRCodeOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="mt-2">
              <QrCode className="mr-2 h-4 w-4" />
              Show QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Scan QR Code to Join Session</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-6">
              <SVG
                text={qrCodeUrl}
                options={{
                  width: 256,
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {session.status === "active" && (
        <Card>
          <CardHeader>
            <CardTitle>Add Player</CardTitle>
          </CardHeader>
          <CardContent>
            <AddMemberCombobox
              members={members.filter(
                (m) => !participants.some((p) => p.user_id === m.id),
              )}
              sessionCode={session.code}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {participants.map((participant) => (
              <GamePlayerRow
                key={participant.id}
                participant={participant}
                sessionBuyIn={session.buy_in_amount}
                isOwner={isOwner}
                onBuyIn={handleBuyIn}
                onCashOut={handleCashOut}
                isActive={session.status === "active"}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Buy-ins</p>
              <p className="text-2xl font-bold">
                $
                {participants
                  .reduce((sum, p) => sum + (p.buy_ins || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cash Outs</p>
              <p className="text-2xl font-bold">
                $
                {participants
                  .reduce((sum, p) => sum + (p.final_stack || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total in Play</p>
              <p className="text-2xl font-bold">
                $
                {(
                  participants.reduce((sum, p) => sum + (p.buy_ins || 0), 0) -
                  participants.reduce((sum, p) => sum + (p.final_stack || 0), 0)
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Players</p>
              <p className="text-2xl font-bold">
                {
                  participants.filter(
                    (p) => p.status !== "completed" && p.status !== "declined",
                  ).length
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <PokerHands />
    </div>
  );
};
