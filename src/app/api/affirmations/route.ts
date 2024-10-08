import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/utils/auth";

export const POST = async (req: NextRequest) => {
  const session = await auth();
  if (!session?.user.id) return new NextResponse("", { status: 404 });

  const body = await req.json();

  const data = await prisma.affirmation.create({
    data: {
      text: body.text,
      userId: session.user.id,
      visible: true,
    },
  });

  return new NextResponse(JSON.stringify(data));
};
