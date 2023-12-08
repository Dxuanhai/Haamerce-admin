"use client";

import React from "react";
import { Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  email: string;
  fullname: string;
  data: {
    id: string;
    name: string;
    price: string;
    color: string;
    size: string;
    quantity: number;
  }[];
  isOpen: boolean;
  onchange: () => void;
}

function DetailOrder({ data, isOpen, fullname, email, onchange }: Props) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onchange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription>
              {fullname} / {email}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-5">
            {data.length > 0 &&
              data.map((item) => (
                <div
                  key={item.id}
                  className="w-full  h-[100px] flex  items-center relative "
                >
                  <div className="flex flex-col gap-y-2 px-4 ">
                    <span>{item.name}</span>
                    <div className="flex gap-x-2">
                      <span>{item.color}</span> /<span>{item.size}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex flex-col items-end gap-y-2">
                    <div className=" text-base">{item.price}</div>
                    <div className="  ">
                      <span className="text-sm">quantity: </span>
                      <span className="ml-auto font-bold">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DetailOrder;
