import prismadb from "@/lib/prismadb";
import { VouchersForm } from "@/components/dashboard/voucher/form";

const BillboardPage = async ({ params }: { params: { voucherId: string } }) => {
  const voucher = await prismadb.voucher.findUnique({
    where: {
      id: params.voucherId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <VouchersForm initialData={voucher} />
      </div>
    </div>
  );
};

export default BillboardPage;
