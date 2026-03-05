import { NextResponse } from "next/server";
import { listProjects } from "@/lib/project-repo";

export async function GET() {
  const { data, error } = await listProjects("public");
  if (error) {
    return NextResponse.json({ ok: false, error: "Failed to load projects" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, projects: data });
}
