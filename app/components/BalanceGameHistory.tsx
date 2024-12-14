"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { IGameHistory } from "@/lib/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useState } from "react";
import { BalanceSessionDetails } from "./BalanceSessionDetails";

interface BalanceGameHistoryProps {
  history: IGameHistory[];
}

export const BalanceGameHistory = ({ history }: BalanceGameHistoryProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState<boolean>(false);

  const columns: ColumnDef<IGameHistory>[] = [
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return format(new Date(row.original.created_at), "MMM d, yyyy");
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Game" />
      ),
      cell: ({ row }) => {
        return row.original.name || `Game #${row.original.code}`;
      },
    },
    {
      accessorKey: "buy_ins",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Buy-in"
          className="text-right"
        />
      ),
      cell: ({ row }) => {
        return <div className="">${row.original.buy_ins.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "final_stack",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cash-out" />
      ),
      cell: ({ row }) => {
        return (
          <div className="">${(row.original.final_stack || 0).toFixed(2)}</div>
        );
      },
    },
    {
      accessorKey: "profit",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Profit/Loss" />
      ),
      cell: ({ row }) => {
        const profit = (row.original.final_stack || 0) - row.original.buy_ins;
        return (
          <div
            className={` font-medium ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${profit.toFixed(2)}
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button
            className="p-4 h-0"
            variant="ghost"
            onClick={() => {
              setSessionId(row.original.id);
              setSessionDetailsOpen(true);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Game History</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={history} columns={columns} />
      </CardContent>
      <BalanceSessionDetails
        open={sessionDetailsOpen}
        setOpen={setSessionDetailsOpen}
        id={sessionId}
      />
    </Card>
  );
};
