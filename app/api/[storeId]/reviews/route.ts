import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, userId, parentId, productId, rating } = body;

    if (!content) {
      return new NextResponse("Content is required", { status: 400 });
    }
    if (!rating) {
      return new NextResponse("Rating is required", { status: 400 });
    }

    if (!userId) {
      return new NextResponse("Profile id is required", { status: 400 });
    }

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const reviews = await prismadb.review.create({
      data: {
        content,
        productId: productId,
        userId: userId,
        rating,
        parentId: parentId || null,
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.log("[REVIEWS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const reviews = await prismadb.review.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: true,
        replies: true, // Include replies to the REVIEWS
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.log("[REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
