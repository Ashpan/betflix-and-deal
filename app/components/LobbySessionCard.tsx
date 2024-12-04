"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { addMemberToSession, leaveSession } from "@/lib/supabase/queries";
import { PlayCircle, QrCode } from "lucide-react";
import { useQRCode } from "next-qrcode";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IMember {
  id: string;
  username: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
}

interface LobbySessionCardProps {
  sessionName: string;
  sessionCode: string;
  buyInAmount: number;
  allMembers: IMember[];
}

export const LobbySessionCard = ({
  sessionName,
  sessionCode,
  buyInAmount,
  allMembers,
}: LobbySessionCardProps) => {
  const router = useRouter();
  const { SVG } = useQRCode();
  const { toast } = useToast();
  const { profile } = useProfile();
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

  const userId = profile ? profile.id : "";

  const leaveSessionHandler = () => {
    leaveSession(sessionCode);
    router.push("/session");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {sessionName}
        </CardTitle>
        <div className="text-center text-muted-foreground">
          Session Code:{" "}
          <span className="font-mono font-bold">{sessionCode}</span>
        </div>
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
                text={window.location.toString()}
                options={{
                  width: 256,
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <span className="text-lg font-semibold">Buy-in Amount: </span>
          <span className="text-xl font-bold">${buyInAmount.toFixed(2)}</span>
        </div>

        <Combobox
          items={allMembers
            .filter((member) => member.id !== userId)
            .map((member) => ({
              label: member.display_name || member.email,
              value: member.id,
            }))}
          placeholder="Add member to session..."
          onSelect={async (value) => {
            const { error } = await addMemberToSession(value, sessionCode);
            if (error) {
              console.error(error);
              toast({
                title: "Error Adding Member",
                description: error.message,
              });
            } else {
              toast({
                title: "Member Added",
              });
            }
          }}
        />
      </CardContent>
      <CardFooter>
        <>
          <Button
            variant="destructive"
            className="w-full"
            onClick={leaveSessionHandler}
          >
            Leave Session
          </Button>
          <Button variant="default" className="w-full">
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Session
          </Button>
        </>
      </CardFooter>
    </Card>
  );
};
