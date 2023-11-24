import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatterVND } from "@/lib/utils";

import { ProductsClient } from "@/components/dashboard/product/client";
import { ProductColumn } from "@/components/dashboard/product/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,

      productColors: {
        select: {
          color: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatterVND.format(item.price),
    category: item.category.name,
    discount: formatterVND.format(item.discount),

    color: item.productColors.map((item) => ({
      id: item.color.id,
      storeId: item.color.storeId,
      name: item.color.name,
      value: item.color.value,
      createdAt: item.color.createdAt,
      updatedAt: item.color.updatedAt,
    })),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
