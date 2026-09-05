import crypto from "node:crypto";
import { sessionsStore, getUser } from "./store.js";

const SESSION_DAYS = 30;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  const check = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(check, "hex"));
}

export async function createSession(username) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const store = sessionsStore();
  await store.setJSON(token, { username: username.toLowerCase(), expiresAt });
  return token;
}

export async function destroySession(token) {
  if (!token) return;
  const store = sessionsStore();
  await store.delete(token);
}

export function getToken(req) {
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

// Returns the authenticated user object, or null if unauthenticated/expired
// or banned. A banned user is treated as logged out everywhere except the
// login endpoint, which gives them an explicit ban message instead.
export async function requireUser(req) {
  const token = getToken(req);
  if (!token) return null;
  const store = sessionsStore();
  const session = await store.get(token, { type: "json" });
  if (!session || session.expiresAt < Date.now()) return null;
  const user = await getUser(session.username);
  if (!user || user.banned) return null;
  return user;
}

// Returns the authenticated user if they're an admin, otherwise null.
export async function requireAdmin(req) {
  const user = await requireUser(req);
  if (!user || !user.isAdmin) return null;
  return user;
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export function errorResponse(message, status = 400) {
  return json({ error: message }, status);
}
