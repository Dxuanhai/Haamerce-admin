"use client";

import axios from "axios";
import { useState } from "react";
import { Eye, Check, MoreHorizontal, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AlertModal } from "@/components/modals/alert-modal";

import { OrderColumn } from "./columns";
import DetailOrder from "./deltail-order";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenOderDetail, SetIsOpenOderDetail] = useState(false);

  const onConfirm = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/orders/${data.id}`);
      toast.success("Order deleted.");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };
  const handleConfirmOrder = async () => {
    await axios.patch(`/api/${params.storeId}/orders/${data.id}`, data);
    toast.success("Confirmed successfully");
    router.refresh();
    try {
    } catch (error) {
      console.log("🚀  / handleConfirmOrder  / error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <DetailOrder
        data={data.products}
        isOpen={isOpenOderDetail}
        fullname={data.fullName}
        email={data.email}
        onchange={() => SetIsOpenOderDetail(false)}
      />
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => SetIsOpenOderDetail(true)}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirmOrder()}>
            <Check className="mr-2 h-4 w-4" /> Confirm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
