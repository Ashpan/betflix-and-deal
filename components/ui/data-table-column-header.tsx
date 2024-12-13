import { Column } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span
        onClick={column.getToggleSortingHandler()}
        style={{ cursor: "pointer" }}
      >
        {title}
      </span>
      {column.getIsSorted() === "desc" ? (
        <ChevronDown />
      ) : column.getIsSorted() === "asc" ? (
        <ChevronUp />
      ) : (
        <ChevronsUpDown className="invisible" />
      )}
    </div>
  );
}
