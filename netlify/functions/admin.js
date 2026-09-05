import { requireAdmin, json, errorResponse } from "./_lib/auth.js";
import { usersStore, getUser, saveUser, sessionsStore, bannedIpsStore } from "./_lib/store.js";
import { applyRegen, publicUser } from "./_lib/regen.js";

const EDITABLE_NUMERIC_FIELDS = [
  "money", "bank", "level", "exp",
  "health", "maxHealth", "energy", "maxEnergy",
  "brave", "maxBrave", "will", "maxWill",
  "strength", "defense", "speed",
  "kills", "losses",
];

async function revokeAllSessions(username) {
  const store = sessionsStore();
  const { blobs } = await store.list();
  let count = 0;
  for (const b of blobs) {
    const session = await store.get(b.key, { type: "json" });
    if (session && session.username === username.toLowerCase()) {
      await store.delete(b.key);
      count += 1;
    }
  }
  return count;
}

export default async (req, context) => {
  const admin = await requireAdmin(req);
  if (!admin) return errorResponse("Not authorized.", 403);

  if (req.method === "GET") {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();

    const store = usersStore();
    const { blobs } = await store.list();
    const users = [];
    for (const b of blobs) {
      const u = await store.get(b.key, { type: "json" });
      if (!u) continue;
      if (q && !u.username.toLowerCase().includes(q)) continue;
      applyRegen(u);
      users.push(publicUser(u));
    }
    users.sort((a, b) => a.username.localeCompare(b.username));

    const ipStore = bannedIpsStore();
    const { blobs: ipBlobs } = await ipStore.list();
    const bannedIps = [];
    for (const b of ipBlobs) {
      const info = await ipStore.get(b.key, { type: "json" });
      bannedIps.push({ ip: b.key, ...info });
    }

    return json({ users, bannedIps });
  }

  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const body = await req.json().catch(() => ({}));
  const action = body.action;

  // IP ban actions don't require a target user.
  if (action === "ban-ip") {
    const ip = (body.ip || "").trim();
    if (!ip) return errorResponse("Enter an IP address.");
    await bannedIpsStore().setJSON(ip, {
      reason: (body.reason || "No reason given").trim(),
      bannedAt: Date.now(),
      bannedBy: admin.username,
    });
    return json({ ok: true });
  }

  if (action === "unban-ip") {
    const ip = (body.ip || "").trim();
    if (!ip) return errorResponse("Enter an IP address.");
    await bannedIpsStore().delete(ip);
    return json({ ok: true });
  }

  const target = await getUser(body.username);
  if (!target) return errorResponse("User not found.");

  switch (action) {
    case "edit": {
      const fields = body.fields || {};
      for (const key of EDITABLE_NUMERIC_FIELDS) {
        if (fields[key] !== undefined && fields[key] !== "") {
          const num = Number(fields[key]);
          if (Number.isFinite(num)) target[key] = num;
        }
      }
      if (typeof fields.city === "string" && fields.city.trim()) {
        target.city = fields.city.trim();
      }
      await saveUser(target);
      return json({ user: publicUser(target) });
    }

    case "clear-jail": {
      target.jailUntil = null;
      target.jailReason = null;
      await saveUser(target);
      return json({ user: publicUser(target) });
    }

    case "clear-hospital": {
      target.hospitalUntil = null;
      await saveUser(target);
      return json({ user: publicUser(target) });
    }

    case "ban-user": {
      target.banned = true;
      target.banReason = (body.reason || "No reason given").trim();
      target.bannedAt = Date.now();
      target.bannedBy = admin.username;
      await saveUser(target);
      const revoked = await revokeAllSessions(target.username);
      return json({ user: publicUser(target), sessionsRevoked: revoked });
    }

    case "unban-user": {
      target.banned = false;
      target.banReason = null;
      target.bannedAt = null;
      target.bannedBy = null;
      await saveUser(target);
      return json({ user: publicUser(target) });
    }

    case "revoke-sessions": {
      const count = await revokeAllSessions(target.username);
      return json({ ok: true, sessionsRevoked: count });
    }

    case "promote": {
      target.isAdmin = true;
      await saveUser(target);
      return json({ user: publicUser(target) });
    }

    case "demote": {
      if (target.username.toLowerCase() === admin.username.toLowerCase()) {
        return errorResponse("You can't demote yourself.");
      }
      target.isAdmin = false;
      await saveUser(target);
      return json({ user: publicUser(target) });
    }

    default:
      return errorResponse("Unknown action.");
  }
};
