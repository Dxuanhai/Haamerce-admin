import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb"; // Adjust the import according to your project structure
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!userId || typeof userId !== "string") {
    return new NextResponse("user id is required", { status: 400 });
  }
  if (!productId || typeof productId !== "string") {
    return new NextResponse("user id is required", { status: 400 });
  }

  try {
    const purchases = await prisma.purchased.findFirst({
      where: {
        AND: { userId, productId },
      },
      include: {
        user: true, // Include related user data
      },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("[PURCHASES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
