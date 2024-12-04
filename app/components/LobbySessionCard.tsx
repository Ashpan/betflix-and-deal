"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { leaveSession } from "@/lib/supabase/queries";
import { QrCode } from "lucide-react";
import { useQRCode } from "next-qrcode";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LobbySessionCardProps {
  sessionName: string;
  sessionCode: string;
  buyInAmount: number;
}

export const LobbySessionCard = ({
  sessionName,
  sessionCode,
  buyInAmount,
}: LobbySessionCardProps) => {
  const router = useRouter();
  const { SVG } = useQRCode();
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);

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

        {/* <Combobox
        items={availableUsers.map(user => ({ label: user.name, value: user.id.toString() }))}
        placeholder="Add member to session..."
        onSelect={() => {}}
      /> */}
      </CardContent>
      <CardFooter>
        <Button
          variant="destructive"
          className="w-full"
          onClick={leaveSessionHandler}
        >
          Leave Session
        </Button>
      </CardFooter>
    </Card>
  );
};
