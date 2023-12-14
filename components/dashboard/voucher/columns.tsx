"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type VouchersColumn = {
  id: string;
  code: string;
  discount: string;
  isActive: boolean;
  createdAt: string;
};

export const columns: ColumnDef<VouchersColumn>[] = [
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "discount",
    header: "Discount",
  },
  {
    accessorKey: "isActive",
    header: "IsActive",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
