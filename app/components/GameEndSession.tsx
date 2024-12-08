import { useState } from "react";
import { Player } from "@/lib/types/poker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EndSessionProps = {
  players: Player[];
  onEndSession: (finalCashOuts: { [playerId: string]: number }) => void;
};

export default function EndSession({ players, onEndSession }: EndSessionProps) {
  const [finalCashOuts, setFinalCashOuts] = useState<{
    [playerId: string]: number;
  }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCashOutChange = (playerId: string, amount: string) => {
    setFinalCashOuts((prev) => ({
      ...prev,
      [playerId]: parseFloat(amount) || 0,
    }));
  };

  const handleEndSession = () => {
    onEndSession(finalCashOuts);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>End Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>End Session</DialogTitle>
          <DialogDescription>
            Enter the final cash-out amounts for each player.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {players.map((player) => (
            <div
              key={player.id}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Label
                htmlFor={`finalCashOut-${player.id}`}
                className="text-right"
              >
                {player.name}
              </Label>
              <Input
                id={`finalCashOut-${player.id}`}
                type="number"
                value={finalCashOuts[player.id] || ""}
                onChange={(e) => handleCashOutChange(player.id, e.target.value)}
                placeholder="Final cash-out"
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <Button onClick={handleEndSession} className="w-full">
          Submit and End Session
        </Button>
      </DialogContent>
    </Dialog>
  );
}
