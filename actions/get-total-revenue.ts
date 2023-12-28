import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    select: {
      bills: true,
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.bills.reduce((orderSum, item) => {
      return orderSum + item.price;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
