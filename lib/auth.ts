import { jwtVerify, SignJWT } from "jose";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "admin_session";

type AdminPayload = {
  role: "admin";
};

const getSecret = () => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
};

export async function signAdminSession() {
  return new SignJWT({ role: "admin" } satisfies AdminPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminSession(token?: string | null) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

export async function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminSession(token);
}
