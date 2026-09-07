import { hashPassword, json, errorResponse } from "./_lib/auth.js";
import { getUser, saveUser } from "./_lib/store.js";

// Recovery-only endpoint. Requires RESET_SECRET to be set as an
// environment variable in Netlify (Site settings > Environment variables).
// Without that variable set, this endpoint refuses every request.
export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const secret = process.env.RESET_SECRET;
  if (!secret) {
    return errorResponse("RESET_SECRET is not configured on this site.", 503);
  }

  const body = await req.json().catch(() => ({}));
  if (body.secret !== secret) {
    return errorResponse("Incorrect secret.", 403);
  }

  const username = (body.username || "").trim();
  const newPassword = body.newPassword || "";
  if (newPassword.length < 6) {
    return errorResponse("New password must be at least 6 characters.");
  }

  const user = await getUser(username);
  if (!user) return errorResponse("User not found.");

  user.passwordHash = hashPassword(newPassword);
  if (body.makeAdmin) user.isAdmin = true;
  if (body.clearBan) {
    user.banned = false;
    user.banReason = null;
    user.bannedAt = null;
    user.bannedBy = null;
  }

  await saveUser(user);
  return json({ ok: true, username: user.username, isAdmin: user.isAdmin });
};
