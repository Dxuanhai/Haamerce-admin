import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    const { name, userId, imageUrl } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("id is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const profile = await prismadb.profile.create({
      data: {
        name: name ? name : "",
        userId,
        imageUrl: imageUrl ? imageUrl : "",
        storeId: params.storeId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[PROFILE_POST]", error);
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

    const profiles = await prismadb.profile.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.log("[PROFILES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
