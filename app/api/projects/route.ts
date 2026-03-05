import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizeProjectInput } from "@/lib/validators/project";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ ok: true, projects });
}

export async function POST(request: NextRequest) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = normalizeProjectInput(body);

    const existing = await prisma.project.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 409 });
    }

    const project = await prisma.project.create({
      data: input,
    });

    return NextResponse.json({ ok: true, project }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", issues: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: false, error: "Failed to create project" }, { status: 500 });
  }
}
