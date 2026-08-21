import { cookies } from "next/headers";
import crypto from "node:crypto";
import { prisma } from "./db";

const COOKIE_NAME = "admin-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET env variable is not set");
  return secret;
}

// ── Password Hashing ──────────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, storedHash] = hash.split(":");
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(crypto.timingSafeEqual(
        Buffer.from(storedHash, "hex"),
        derivedKey
      ));
    });
  });
}

// ── HMAC Session Tokens ───────────────────────────────────────────────────────

function signAdminId(adminId: string): string {
  const secret = getAuthSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(adminId);
  const signature = hmac.digest("hex");
  return `${adminId}.${signature}`;
}

function verifyToken(token: string): string | null {
  const [adminId, signature] = token.split(".");
  if (!adminId || !signature) return null;

  const secret = getAuthSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(adminId);
  const expected = hmac.digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))) {
    return null;
  }
  return adminId;
}

// ── Session Management ────────────────────────────────────────────────────────

export async function createSession(adminId: string): Promise<string> {
  const token = signAdminId(adminId);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
  return token;
}

export async function getSession(): Promise<{ adminId: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const adminId = verifyToken(token);
    if (!adminId) return null;

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true },
    });
    if (!admin) return null;

    return { adminId: admin.id };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
