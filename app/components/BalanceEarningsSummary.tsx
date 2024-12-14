import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceEarningsSummaryProps {
  totalGames: number;
  totalBuyIns: number;
  totalCashOuts: number;
  profitableGames: number;
}

export const BalanceEarningsSummary = ({
  totalGames,
  totalBuyIns,
  totalCashOuts,
  profitableGames,
}: BalanceEarningsSummaryProps) => {
  const totalProfit = totalCashOuts - totalBuyIns;
  const averageProfit = totalGames > 0 ? totalProfit / totalGames : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">Games</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalGames}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">
            Buy-ins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalBuyIns.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">
            Cash-outs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${totalCashOuts.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">
            Profit/Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            ${totalProfit.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">
            Profitable Games
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {profitableGames}/{totalGames}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm text-muted-foreground">
            Avg. Profit/Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${averageProfit >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            ${averageProfit.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
