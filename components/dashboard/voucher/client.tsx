"use client";
import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { VouchersColumn, columns } from "./columns";
import { useParams, useRouter } from "next/navigation";
interface Props {
  data: VouchersColumn[];
}
const VouchersClient = ({ data }: Props) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Vouchers (${data.length})`}
          description="Manage vouchers for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/vouchers/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Vouchers" />
      <Separator />
      <ApiList entityName="vouchers" entityIdName="VoucherId" />
    </>
  );
};

export default VouchersClient;
