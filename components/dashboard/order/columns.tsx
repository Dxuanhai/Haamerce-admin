"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  isPaid: boolean;
  voucher?: string;
  paymentMethod: string;
  totalPrice: string;
  products: {
    id: string;
    name: string;
    price: string;
    color: string;
    size: string;
    quantity: number;
  }[];
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "fullName",
    header: "FullName",
  },
  {
    accessorKey: "email",
    header: "Email",
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
    accessorKey: "voucher",
    header: "Voucher",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
