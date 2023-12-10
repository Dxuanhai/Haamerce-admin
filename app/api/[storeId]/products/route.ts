import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizes,
      images,
      discount,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (typeof discount !== "number") {
      return new NextResponse("discount is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!sizes) {
      return new NextResponse("sizes is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        discount,
        storeId: params.storeId,
        productColors: {
          create: {
            color: { connect: { id: colorId } },
            images: {
              createMany: {
                data: images,
              },
            },
            sizes: {
              createMany: {
                data: sizes,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colors = searchParams.getAll("colors") || undefined;
    const sizes = searchParams.getAll("sizes") || undefined;
    const minPrice = parseInt(searchParams.get("min") || "0");
    const maxPrice = parseInt(searchParams.get("max") || "100000000");
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Construct the filter object conditionally
    const filter: any = {
      storeId: params.storeId,
      categoryId,
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      isFeatured: isFeatured ? true : undefined,
      isArchived: false,
    };

    // Add color-related filter only if colors are provided
    if (colors && colors.length > 0) {
      filter.productColors = {
        some: {
          color: {
            name: { in: colors },
          },
          sizes: {
            some: {
              value: { in: sizes },
            },
          },
        },
      };
    }

    const products = await prismadb.product.findMany({
      where: filter,
      include: {
        productColors: {
          select: {
            color: true,
            images: true,
            sizes: true,
          },
        },
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
