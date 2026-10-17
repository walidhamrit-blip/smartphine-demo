import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "mp_admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "myphone2026";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "myphone-console-secret-2026";

function signature(payload: string): string {
  return createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
}

export function createAdminToken(): string {
  const payload = String(Date.now() + 1000 * 60 * 60 * 12);
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  if (Number(payload) < Date.now()) return false;
  const expected = signature(payload);
  if (expected.length !== mac.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(mac));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
