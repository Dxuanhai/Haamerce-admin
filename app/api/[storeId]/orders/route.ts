import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    console.log("🚀  / body:", body);

    const {
      fullName,
      phoneNumber,
      email,
      address,
      province,
      district,
      ward,
      paymentMethod,
      products,
      voucher,
      idGiftCode,
      userId,
    } = body;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    if (!fullName) {
      return new NextResponse("fullName  is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("userId  is required", { status: 400 });
    }
    if (!paymentMethod) {
      return new NextResponse("paymentMethod  is required", { status: 400 });
    }

    if (!phoneNumber) {
      return new NextResponse("phoneNumber  is required", { status: 400 });
    }
    if (!email) {
      return new NextResponse("email  is required", { status: 400 });
    }
    if (!address) {
      return new NextResponse("address  is required", { status: 400 });
    }
    if (!province) {
      return new NextResponse(" province  is required", { status: 400 });
    }
    if (!district) {
      return new NextResponse("district is required", { status: 400 });
    }
    if (!ward) {
      return new NextResponse("district is required", { status: 400 });
    }
    if (!products) {
      return new NextResponse("district is required", { status: 400 });
    }

    const storeId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }
    const newOrder = await prismadb.order.create({
      data: {
        fullName,
        email,
        address: `${province} /${district} /${ward} /${address}`,
        phone: phoneNumber,
        voucher: voucher ? voucher : 0,
        paymentMethod,
        storeId: params.storeId,
        bills: {
          createMany: {
            //@ts-ignore
            data: products.map((product) => ({
              color: product.color,
              image: product.image,
              price: product.price,
              name: product.name, // Include the name from the products array
              size: product.size,
              quantity: product.quantity,
            })),
          },
        },
      },
    });

    prismadb.purchased.create({
      data: {
        userId,
        color: products.color,
        image: products.image,
        price: products.price,
        name: products.name, // Include the name from the products array
        size: products.size,
        quantity: products.quantity,
        productId: products.id,
      },
    });
    if (idGiftCode) {
      await prismadb.voucher.update({
        where: {
          code: idGiftCode,
        },
        data: {
          isActive: false,
        },
      });
    }

    return NextResponse.json(newOrder);
  } catch (error) {
    console.log("[ORDER_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.log("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
