import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { createProject, listProjects, slugExists } from "@/lib/project-repo";
import { normalizeProjectInput } from "@/lib/validators/project";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await listProjects("admin");
  if (error) {
    return NextResponse.json({ ok: false, error: "Failed to load projects" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, projects: data });
}

export async function POST(request: NextRequest) {
  const isAdmin = await isAdminRequest(request);
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const input = normalizeProjectInput(body);

    const { exists, error: slugError } = await slugExists(input.slug);
    if (slugError) {
      return NextResponse.json({ ok: false, error: "Failed to validate slug" }, { status: 500 });
    }

    if (exists) {
      return NextResponse.json({ ok: false, error: "Slug already exists" }, { status: 409 });
    }

    const { data: project, error: createError } = await createProject(input);
    if (createError || !project) {
      return NextResponse.json({ ok: false, error: "Failed to create project" }, { status: 500 });
    }

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
