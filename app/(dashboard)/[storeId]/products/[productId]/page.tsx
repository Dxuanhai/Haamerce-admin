import prismadb from "@/lib/prismadb";

import { ProductForm } from "@/components/dashboard/product/form";
import { randomUUID } from "crypto";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = [
    {
      id: "1",
      storeId: params.storeId,
      name: "Small",
      value: "S",
    },
    {
      id: "2",
      storeId: params.storeId,
      name: "Medium",
      value: "M",
    },
    {
      id: "3",
      storeId: params.storeId,
      name: "Large",
      value: "L",
    },

    {
      id: "4",
      storeId: params.storeId,
      name: "Extra-Large",
      value: "XL",
    },
  ];
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={product}
        />
      </div>
    </div>
  );
};

export default ProductPage;
