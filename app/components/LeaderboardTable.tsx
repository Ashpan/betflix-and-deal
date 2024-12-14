"use client";

import { DataTable } from "@/components/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";

interface LeaderboardTableProps {
  leaderboardData: Leaderboard[];
}

type Leaderboard = {
  display_name: string;
  net_profit: number;
  avg_profit_per_session: number;
  total_sessions: number;
};

export const LeaderboardTable = ({
  leaderboardData,
}: LeaderboardTableProps) => {
  const columns: ColumnDef<Leaderboard>[] = [
    {
      accessorKey: "display_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Player" />
      ),
    },
    {
      accessorKey: "net_profit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Total Balance" />
      ),
      cell: ({ row }) => {
        const netProfit: number = row.getValue("net_profit");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(netProfit);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "avg_profit_per_session",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avg Profit/Session" />
      ),
      cell: ({ row }) => {
        const netProfit: number = row.getValue("avg_profit_per_session");
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(netProfit);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "total_sessions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sessions Played" />
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        <DataTable data={leaderboardData} columns={columns} />
      </CardContent>
    </Card>
  );
};
