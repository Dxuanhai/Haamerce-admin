// In a new file, e.g., @/actions/get-weekly-graph-revenue.ts

import prismadb from "@/lib/prismadb";

interface WeeklyGraphData {
  name: string;
  total: number;
}

export const getWeeklyGraphRevenue = async (
  storeId: string
): Promise<WeeklyGraphData[]> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      bills: true,
    },
  });

  const weeklyRevenue: { [key: number]: number } = {};

  // Grouping the orders by week and summing the revenue
  for (const order of paidOrders) {
    const week = getWeekNumber(order.createdAt);
    let revenueForOrder = 0;

    for (const item of order.bills) {
      revenueForOrder += item.price;
    }

    // Adding the revenue for this order to the respective week
    weeklyRevenue[week] = (weeklyRevenue[week] || 0) + revenueForOrder;
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: WeeklyGraphData[] = Array.from({ length: 52 }, (_, i) => ({
    name: `Week ${i + 1}`,
    total: 0,
  }));

  // Filling in the revenue data
  for (const week in weeklyRevenue) {
    graphData[parseInt(week) - 1].total = weeklyRevenue[parseInt(week)];
  }

  return graphData;
};

// Helper function to get the week number of a date
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
}