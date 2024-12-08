import { Player } from "@/lib/types/poker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SessionStatusProps = {
  players: Player[];
};

export default function SessionStatus({ players }: SessionStatusProps) {
  const calculateNetAmount = (player: Player) => {
    const totalBuyIn = player.buyIns.reduce((sum, buyIn) => sum + buyIn, 0);
    const totalCashOut = player.cashOuts.reduce(
      (sum, cashOut) => sum + cashOut,
      0,
    );
    return totalCashOut - totalBuyIn;
  };

  return (
    <div className="mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Total Buy-In</TableHead>
            <TableHead>Total Cash-Out</TableHead>
            <TableHead>Net Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>
                ${player.buyIns.reduce((sum, buyIn) => sum + buyIn, 0)}
              </TableCell>
              <TableCell>
                ${player.cashOuts.reduce((sum, cashOut) => sum + cashOut, 0)}
              </TableCell>
              <TableCell>${calculateNetAmount(player)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
