import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string; colorId: String } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    if (!params.colorId) {
      return new NextResponse("color id is required", { status: 400 });
    }

    const product = await prismadb.productColor.findMany({
      where: {
        productId: params.productId,
        colorId: params.colorId as string,
      },
      select: {
        images: true,
        color: true,
        sizes: true,
        id: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
