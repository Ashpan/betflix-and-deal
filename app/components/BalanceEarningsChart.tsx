"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IGameHistory } from "@/lib/types/types";
import { format, parseISO } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

interface BalanceEarningsChartProps {
  history: IGameHistory[];
}

interface ICumulativeData {
  date: string;
  profit: number;
  totalProfit: number;
  buyIn: number;
  cashOut: number;
}

export const BalanceEarningsChart = ({
  history,
}: BalanceEarningsChartProps) => {
  const cumulativeData = history
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .reduce((acc, game, index) => {
      const profit = (game.final_stack || 0) - game.buy_ins;
      const previousTotal = index > 0 ? acc[index - 1].totalProfit : 0;

      acc.push({
        date: format(parseISO(game.created_at), "MMM d"),
        profit: profit,
        totalProfit: previousTotal + profit,
        buyIn: game.buy_ins,
        cashOut: game.final_stack || 0,
      });

      return acc;
    }, [] as ICumulativeData[]);

  const chartConfig = {
    totalProfit: {
      label: "Total Profit",
      color: "hsl(var(--chart-1))",
    },
    profit: {
      label: "Session Profit",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile/Loss Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] w-full">
        <ChartContainer config={chartConfig}>
          <LineChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" interval="preserveStartEnd" />
            <YAxis />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="profit"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="totalProfit"
              name="Total Profit"
              stroke="var(--color-totalProfit)"
              strokeWidth={2}
              dot
            />
            <Line
              type="monotone"
              dataKey="profit"
              name="Session Profit"
              stroke="var(--color-profit)"
              strokeWidth={2}
              dot
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
