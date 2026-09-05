import { hashPassword, createSession, json, errorResponse } from "./_lib/auth.js";
import { getUser, saveUser, listUsernames, bannedIpsStore } from "./_lib/store.js";
import { startingState } from "./_lib/gamedata.js";
import { publicUser } from "./_lib/regen.js";
import { getClientIp } from "./_lib/ip.js";

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

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    return errorResponse("Username must be 3-20 characters: letters, numbers, underscores only.");
  }
  if (password.length < 6) {
    return errorResponse("Password must be at least 6 characters.");
  }

  const existing = await getUser(username);
  if (existing) {
    return errorResponse("That username is already taken.");
  }

  // The very first account created becomes the admin, since there's no
  // other bootstrap mechanism for a brand new deployment.
  const isFirstAccount = (await listUsernames()).length === 0;

  const passwordHash = hashPassword(password);
  const user = startingState(username, passwordHash);
  user.isAdmin = isFirstAccount;
  user.lastIp = ip;
  user.ipHistory = [ip];
  await saveUser(user);

  const token = await createSession(username);
  return json({ token, user: publicUser(user) });
};
