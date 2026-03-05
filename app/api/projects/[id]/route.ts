import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeProjectInput } from "@/lib/validators/project";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, project });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const input = normalizeProjectInput(body);

    const existing = await prisma.project.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });

    if (existing && existing.id !== id) {
      return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 409 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: input,
    });

    return NextResponse.json({ ok: true, project });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: false, error: "Failed to delete project" }, { status: 500 });
  }
}
