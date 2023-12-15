import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { voucherId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code") || undefined;

    if (!params.voucherId) {
      return new NextResponse("voucher id is required", { status: 400 });
    }

    const voucher = await prismadb.voucher.findFirst({
      where: {
        OR: [
          {
            id: params.voucherId,
          },
          {
            code: code,
          },
        ],
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.log("[VOUCHER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { voucherId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.voucherId) {
      return new NextResponse("voucherId id is required", { status: 400 });
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

    const voucher = await prismadb.voucher.delete({
      where: {
        id: params.voucherId,
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.log("[VOUCHER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { voucherId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { code, discount, isActive } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!code) {
      return new NextResponse("code is required", { status: 400 });
    }
    if (!discount) {
      return new NextResponse("discount is required", { status: 400 });
    }
    if (typeof isActive !== "boolean") {
      return new NextResponse("isActive is required", { status: 400 });
    }

    if (!params.voucherId) {
      return new NextResponse("voucher id is required", { status: 400 });
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

    const voucher = await prismadb.voucher.update({
      where: {
        id: params.voucherId,
      },
      data: {
        code,
        discount,
        isActive,
      },
    });

    return NextResponse.json(voucher);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
