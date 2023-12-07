"use client";

import { ColumnDef } from "@tanstack/react-table";

export type OrderColumn = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  isPaid: boolean;

  totalPrice: number;

  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "fullName",
    header: "FullName",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },

  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
