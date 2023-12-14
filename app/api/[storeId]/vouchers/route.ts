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

    const { code, discount } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!code) {
      return new NextResponse("code  is required", { status: 400 });
    }
    if (!discount) {
      return new NextResponse("discount  is required", { status: 400 });
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

    const voucher = await prismadb.voucher.create({
      data: {
        code,
        discount,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.log("[VOUCHER_POST]", error);
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

    const vouchers = await prismadb.voucher.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(vouchers);
  } catch (error) {
    console.log("[VOUCHERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
