import { verifyPassword, createSession, json, errorResponse } from "./_lib/auth.js";
import { getUser, saveUser, bannedIpsStore } from "./_lib/store.js";
import { applyRegen, publicUser } from "./_lib/regen.js";
import { getClientIp } from "./_lib/ip.js";

const IP_HISTORY_LIMIT = 20;

export default async (req, context) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const ip = getClientIp(req, context);
  const ipBan = await bannedIpsStore().get(ip, { type: "json" });
  if (ipBan) {
    return errorResponse(`This connection is banned. Reason: ${ipBan.reason}`, 403);
  }

  const body = await req.json().catch(() => ({}));
  const username = (body.username || "").trim();
  const password = body.password || "";

  const user = await getUser(username);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return errorResponse("Incorrect username or password.", 401);
  }

  if (user.banned) {
    return errorResponse(`Your account has been banned. Reason: ${user.banReason || "No reason given"}`, 403);
  }

  applyRegen(user);
  user.lastIp = ip;
  user.ipHistory = [ip, ...(user.ipHistory || []).filter((i) => i !== ip)].slice(0, IP_HISTORY_LIMIT);
  await saveUser(user);

  const token = await createSession(username);
  return json({ token, user: publicUser(user) });
};
