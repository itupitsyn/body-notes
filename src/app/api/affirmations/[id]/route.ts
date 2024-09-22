import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";

type RouteParams = {
  params: { id: string };
};

export const PATCH = async (req: NextRequest, { params }: RouteParams) => {
  const [data, session] = await Promise.all([prisma.affirmation.findFirst({ where: { id: params.id } }), auth()]);

  if (!data || data.userId !== session?.user.id) return new NextResponse("", { status: 404 });

  const body = await req.json();

  const updated = await prisma.affirmation.update({ where: { id: params.id }, data: { text: body.text } });

  return new NextResponse(JSON.stringify(updated));
};