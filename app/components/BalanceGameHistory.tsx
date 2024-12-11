import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IGameHistory } from "@/lib/types/types";
import { format } from "date-fns";

interface BalanceGameHistoryProps {
  history: IGameHistory[];
}

export const BalanceGameHistory = ({ history }: BalanceGameHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Game History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Game</TableHead>
              <TableHead className="text-right">Buy-in</TableHead>
              <TableHead className="text-right">Cash-out</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((game) => {
              const profit = (game.final_stack || 0) - game.buy_ins;
              return (
                <TableRow key={game.session.id}>
                  <TableCell>
                    {format(new Date(game.session.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {game.session.name || `Game #${game.session.code}`}
                  </TableCell>
                  <TableCell className="text-right">
                    ${game.buy_ins.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(game.final_stack || 0).toFixed(2)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    ${profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
