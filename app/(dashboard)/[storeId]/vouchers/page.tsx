import VouchersClient from "@/components/dashboard/voucher/client";
import { VouchersColumn } from "@/components/dashboard/voucher/columns";
import prismadb from "@/lib/prismadb";
import { formatterVND } from "@/lib/utils";
import { format } from "date-fns";

const VoucherPage = async ({ params }: { params: { storeId: string } }) => {
  const voychers = await prismadb.voucher.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: VouchersColumn[] = voychers.map((item) => ({
    id: item.id,
    code: item.code,
    discount: formatterVND.format(item.discount),
    isActive: item.isActive,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VouchersClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default VoucherPage;
