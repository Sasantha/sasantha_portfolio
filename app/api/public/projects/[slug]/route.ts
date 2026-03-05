import { NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/project-repo";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Params) {
  const { slug } = await params;

  const { data: project, error } = await getProjectBySlug(slug);
  if (error) {
    return NextResponse.json({ ok: false, error: "Failed to load project" }, { status: 500 });
  }

  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, project });
}
