import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BuyInDialog } from "./BuyInDialog";
import { CashOutDialog } from "./CashOutDialog";
import { ISessionParticipantProfile } from "@/lib/types/types";

interface GamePlayerRowProps {
  participant: ISessionParticipantProfile;
  sessionBuyIn: number;
  isOwner: boolean;
  onBuyIn: (userId: string, amount: number) => void;
  onCashOut: (userId: string, amount: number) => void;
  isActive: boolean;
}

export const GamePlayerRow = ({
  participant,
  sessionBuyIn,
  isOwner,
  onBuyIn,
  onCashOut,
  isActive,
}: GamePlayerRowProps) => {
  const [showBuyInDialog, setShowBuyInDialog] = useState(false);
  const [showCashOutDialog, setShowCashOutDialog] = useState(false);

  const netResult = participant.final_stack
    ? participant.final_stack - participant.buy_ins
    : null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <p className="font-medium">
          {participant.profiles.display_name || participant.profiles.email}
        </p>
        <div className="text-sm space-y-0.5">
          <p className="text-muted-foreground">
            Total Buy-in: ${participant.buy_ins.toFixed(2)}
          </p>
          {participant.final_stack && (
            <>
              <p className="text-muted-foreground">
                Cash-out: ${participant.final_stack.toFixed(2)}
              </p>
              <p
                className={`font-medium ${netResult !== null && netResult >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                Net: ${netResult?.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>

      {isActive && isOwner && (
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowBuyInDialog(true)}
            disabled={participant.status === "completed"}
          >
            Add Buy-in
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCashOutDialog(true)}
            disabled={participant.status === "completed"}
          >
            Cash Out
          </Button>
        </div>
      )}

      <BuyInDialog
        open={showBuyInDialog}
        onOpenChange={setShowBuyInDialog}
        defaultAmount={sessionBuyIn}
        onConfirm={(amount) => {
          onBuyIn(participant.user_id, amount);
          setShowBuyInDialog(false);
        }}
      />

      <CashOutDialog
        open={showCashOutDialog}
        onOpenChange={setShowCashOutDialog}
        onConfirm={(amount) => {
          onCashOut(participant.user_id, amount);
          setShowCashOutDialog(false);
        }}
      />
    </div>
  );
};
