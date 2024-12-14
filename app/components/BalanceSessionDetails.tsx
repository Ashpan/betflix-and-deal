import { DataTable } from "@/components/DataTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IGameSession, ISessionMemberHistory } from "@/lib/types/types";
import { createClient } from "@/utils/supabase/client";
import { ColumnDef } from "@tanstack/react-table";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

type BalanceSessionDetailsProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string | null;
};

export const BalanceSessionDetails = ({
  open,
  setOpen,
  id,
}: BalanceSessionDetailsProps) => {
  const [data, setData] = useState<IGameSession | null>(null);

  const columns: ColumnDef<ISessionMemberHistory>[] = [
    {
      accessorKey: "display_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Player" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage
                src={row.original.avatar_url || undefined}
                alt={row.original.display_name || row.original.username}
              />
              <AvatarFallback>
                <UserCircle className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>{row.original.display_name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "buy_ins",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Buy-in" />
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
        <DataTableColumnHeader column={column} title="Profit" />
      ),
      cell: ({ row }) => {
        const profit = row.original.profit || 0;
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
  ];

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();
    supabase
      .from("sessions")
      .select(
        `
        name,
        players:session_participants!inner(
          buy_ins,
          final_stack,
          profit,
          ...profiles!inner(
            avatar_url,
            display_name,
            username
          )
        )
        `,
      )
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (!data || error) return;
        setData(data);
      });
  }, [id]);
  return (
    data &&
    data.players && (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{data?.name}</DialogTitle>
          <DataTable columns={columns} data={data.players} />
        </DialogContent>
      </Dialog>
    )
  );
};
