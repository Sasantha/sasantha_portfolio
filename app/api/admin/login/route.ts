import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, signAdminSession } from "@/lib/auth";

const loginSchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
    }

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
    }

    if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
    }

    const token = await signAdminSession();
    const response = NextResponse.json({ ok: true });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON payload" }, { status: 400 });
  }
}
