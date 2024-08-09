

import prismadb from "@/lib/prismadb";

interface DailyGraphData {
  name: string;
  total: number;
}

export const getDailyGraphRevenue = async (
  storeId: string
): Promise<DailyGraphData[]> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      bills: true,
    },
  });

  const dailyRevenue: { [key: string]: number } = {};

  // Get the current date
  const currentDate = new Date();
  
  // Calculate the date 30 days ago
  const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Grouping the orders by day and summing the revenue
  for (const order of paidOrders) {
    if (order.createdAt >= thirtyDaysAgo) {
      const day = order.createdAt.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      let revenueForOrder = 0;

      for (const item of order.bills) {
        revenueForOrder += item.price;
      }

      // Adding the revenue for this order to the respective day
      dailyRevenue[day] = (dailyRevenue[day] || 0) + revenueForOrder;
    }
  }

  // Creating an array of the last 30 days
  const graphData: DailyGraphData[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
    const day = date.toISOString().split('T')[0];
    graphData.push({
      name: day,
      total: dailyRevenue[day] || 0,
    });
  }

  return graphData;
};