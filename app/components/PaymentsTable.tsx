"use client";

import { DataTable } from "@/components/DataTable";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

export const PaymentsTable = ({ data }) => {
  const columns = [
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        return <div className="">${row.original.amount.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      accessorKey: "payer",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payer" />
      ),
      cell: ({ row }) => {
        return (
          <div className="">
            {row.original.payer.display_name || row.original.payee.username}
          </div>
        );
      },
    },
    {
      accessorKey: "payee",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Payee" />
      ),
      cell: ({ row }) => {
        return (
          <div className="">
            {row.original.payee.display_name || row.original.payee.username}
          </div>
        );
      },
    },
  ];
  return <DataTable columns={columns} data={data} />;
};
