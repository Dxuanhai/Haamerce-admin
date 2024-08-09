// In a new file, e.g., @/actions/get-yearly-graph-revenue.ts

import prismadb from "@/lib/prismadb";

interface YearlyGraphData {
  name: string;
  total: number;
}

export const getYearlyGraphRevenue = async (
  storeId: string
): Promise<YearlyGraphData[]> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      bills: true,
    },
  });

  const yearlyRevenue: { [key: number]: number } = {};

  // Get the current year
  const currentYear = new Date().getFullYear();
  
  // Number of years to show (e.g., last 5 years)
  const yearsToShow = 5;

  // Grouping the orders by year and summing the revenue
  for (const order of paidOrders) {
    const year = order.createdAt.getFullYear();
    if (year >= currentYear - yearsToShow + 1) {
      let revenueForOrder = 0;

      for (const item of order.bills) {
        revenueForOrder += item.price;
      }

      // Adding the revenue for this order to the respective year
      yearlyRevenue[year] = (yearlyRevenue[year] || 0) + revenueForOrder;
    }
  }

  // Creating an array of the last 5 years
  const graphData: YearlyGraphData[] = [];
  for (let i = yearsToShow - 1; i >= 0; i--) {
    const year = currentYear - i;
    graphData.push({
      name: year.toString(),
      total: yearlyRevenue[year] || 0,
    });
  }

  return graphData;
};