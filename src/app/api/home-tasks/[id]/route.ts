import { prisma } from "@/prisma";
import { auth } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: { id: string };
};

export const PATCH = async (req: NextRequest, { params }: RouteParams) => {
  const [data, session] = await Promise.all([prisma.hometask.findFirst({ where: { id: params.id } }), auth()]);

  if (!data || data.userId !== session?.user.id) return new NextResponse("", { status: 404 });

  const body = await req.json();

  const updated = await prisma.hometask.update({
    where: { id: params.id },
    data: { text: body.text, date: body.date },
  });

  return new NextResponse(JSON.stringify(updated));
};

export const DELETE = async (req: NextRequest, { params }: RouteParams) => {
  const [data, session] = await Promise.all([prisma.hometask.findFirst({ where: { id: params.id } }), auth()]);

  if (!data || data.userId !== session?.user.id) return new NextResponse("", { status: 404 });

  await prisma.hometask.delete({ where: { id: params.id } });

  return new NextResponse();
};
