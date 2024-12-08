import { useState } from "react";
import { Player } from "@/lib/types/poker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PlayerManagementProps = {
  players: Player[];
  onAddPlayer: (name: string, buyIn: number) => void;
  onAddBuyIn: (playerId: string, amount: number) => void;
  onCashOut: (playerId: string, amount: number) => void;
};

export default function PlayerManagement({
  players,
  onAddPlayer,
  onAddBuyIn,
  onCashOut,
}: PlayerManagementProps) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerBuyIn, setNewPlayerBuyIn] = useState("");
  const [buyInAmount, setBuyInAmount] = useState("");
  const [cashOutAmount, setCashOutAmount] = useState("");

  const handleAddPlayer = () => {
    if (newPlayerName && newPlayerBuyIn) {
      onAddPlayer(newPlayerName, parseFloat(newPlayerBuyIn));
      setNewPlayerName("");
      setNewPlayerBuyIn("");
    }
  };

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="playerName">Player Name</Label>
          <Input
            id="playerName"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Enter player name"
          />
        </div>
        <div>
          <Label htmlFor="initialBuyIn">Initial Buy-In</Label>
          <Input
            id="initialBuyIn"
            type="number"
            value={newPlayerBuyIn}
            onChange={(e) => setNewPlayerBuyIn(e.target.value)}
            placeholder="Enter initial buy-in amount"
          />
        </div>
      </div>
      <Button onClick={handleAddPlayer}>Add Player</Button>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Player Actions</h3>
        {players.map((player) => (
          <div key={player.id} className="mb-4 p-4 border rounded">
            <h4 className="text-lg font-medium mb-2">{player.name}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`buyIn-${player.id}`}>Buy-In Amount</Label>
                <Input
                  id={`buyIn-${player.id}`}
                  type="number"
                  value={buyInAmount}
                  onChange={(e) => setBuyInAmount(e.target.value)}
                  placeholder="Enter buy-in amount"
                />
                <Button
                  className="mt-2"
                  onClick={() => {
                    onAddBuyIn(player.id, parseFloat(buyInAmount));
                    setBuyInAmount("");
                  }}
                >
                  Add Buy-In
                </Button>
              </div>
              <div>
                <Label htmlFor={`cashOut-${player.id}`}>Cash-Out Amount</Label>
                <Input
                  id={`cashOut-${player.id}`}
                  type="number"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                  placeholder="Enter cash-out amount"
                />
                <Button
                  className="mt-2"
                  onClick={() => {
                    onCashOut(player.id, parseFloat(cashOutAmount));
                    setCashOutAmount("");
                  }}
                >
                  Cash Out
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
