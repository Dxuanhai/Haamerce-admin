import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "5");

    if (!params.profileId) {
      return new NextResponse("Profile id is required", { status: 400 });
    }

    const profile = await prismadb.profile.findUnique({
      where: {
        userId: params.profileId,
      },
      include: {
        purchased: {
          orderBy: {
            createdAt: "desc",
          },
          skip: skip,
          take: take,
        },
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
          skip: skip,
          take: take,
        },
        _count: true,
      },
    });

    if (!profile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

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
