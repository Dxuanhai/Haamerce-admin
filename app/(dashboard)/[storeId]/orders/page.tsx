import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterVND } from "@/lib/utils";

import { OrderColumn } from "@/components/dashboard/order/columns";
import { OrderClient } from "@/components/dashboard/order/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
      isPaid: false,
    },
    include: {
      bills: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    fullName: item.fullName,
    phone: item.phone,
    address: item.address,
    email: item.email,
    totalPrice: formatterVND.format(
      item.bills.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price,
        0
      )
    ),
    isPaid: item.isPaid,
    products: item.bills.map((item) => {
      return {
        id: item.id,
        name: item.name,
        price: formatterVND.format(item.price),
        color: item.color,
        size: item.size,
        quantity: item.quantity,
      };
    }),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
