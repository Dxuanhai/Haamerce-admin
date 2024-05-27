import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    if (!params.profileId) {
      return new NextResponse("profile id is required", { status: 400 });
    }

    const profile = await prismadb.profile.findUnique({
      where: {
        userId: params.profileId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[profile_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const profile = await prismadb.profile.delete({
      where: {
        userId: params.profileId,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.log("[profile_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const body = await req.json();

    const { name, imageUrl } = body;

    if (!name) {
      return new NextResponse("name is required", { status: 400 });
    }

    if (!params.profileId) {
      return new NextResponse("userId is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("imageUrl is required", { status: 400 });
    }

    const newProfile = await prismadb.profile.update({
      where: {
        userId: params.profileId,
      },
      data: {
        imageUrl,
        name,
      },
    });

    return NextResponse.json(newProfile);
  } catch (error) {
    console.log("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
