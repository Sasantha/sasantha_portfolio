import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
  });

  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, project });
}
