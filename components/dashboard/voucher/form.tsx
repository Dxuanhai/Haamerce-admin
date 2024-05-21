"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Billboard, Voucher } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  code: z.string().min(10),
  discount: z.coerce.number().min(10000),
  isActive: z.boolean(),
});

type VouchersFormValues = z.infer<typeof formSchema>;

interface VouchersFormProps {
  initialData: Voucher | null;
}

export const VouchersForm: React.FC<VouchersFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Vouchers" : "Create Vouchers";
  const description = initialData ? "Edit a Vouchers." : "Add a new Vouchers";
  const toastMessage = initialData ? "Vouchers updated." : "Vouchers created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<VouchersFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      discount: 0,
      isActive: true,
    },
  });

  const onSubmit = async (data: VouchersFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/vouchers/${params.voucherId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/vouchers`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/vouchers`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/vouchers/${params.voucherId}`);
      router.refresh();
      router.push(`/${params.storeId}/vouchers`);
      toast.success("Vouchers deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this Vouchers first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8 items-center">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="voucher code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="discount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel>IsActive</FormLabel>
                  <FormControl>
                    <Checkbox
                      className="w-8 h-8"
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
