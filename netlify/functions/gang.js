import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser, gangsStore, getUser } from "./_lib/store.js";
import { applyRegen, publicUser } from "./_lib/regen.js";
import crypto from "node:crypto";

const GANG_CREATE_COST = 5000;

export default async (req) => {
  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);
  applyRegen(user);

  const store = gangsStore();

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const gangs = [];
    for (const b of blobs) {
      const g = await store.get(b.key, { type: "json" });
      if (g) gangs.push({ id: g.id, name: g.name, members: g.members.length, leader: g.leader });
    }
    let mine = null;
    if (user.gangId) mine = await store.get(user.gangId, { type: "json" });
    return json({ gangs, mine });
  }

  const body = await req.json().catch(() => ({}));

  if (body.action === "create") {
    if (user.gangId) return errorResponse("Leave your current gang first.");
    const name = (body.name || "").trim();
    if (name.length < 3 || name.length > 30) return errorResponse("Gang name must be 3-30 characters.");
    if (user.money < GANG_CREATE_COST) return errorResponse(`Founding a gang costs $${GANG_CREATE_COST}.`);

    const id = crypto.randomBytes(8).toString("hex");
    const gang = { id, name, leader: user.username, members: [user.username], createdAt: Date.now() };
    await store.setJSON(id, gang);

    user.money -= GANG_CREATE_COST;
    user.gangId = id;
    await saveUser(user);
    return json({ gang, user: publicUser(user) });
  }

  if (body.action === "join") {
    if (user.gangId) return errorResponse("Leave your current gang first.");
    const gang = await store.get(body.gangId, { type: "json" });
    if (!gang) return errorResponse("Gang not found.");
    gang.members.push(user.username);
    await store.setJSON(gang.id, gang);
    user.gangId = gang.id;
    await saveUser(user);
    return json({ gang, user: publicUser(user) });
  }

  if (body.action === "leave") {
    if (!user.gangId) return errorResponse("You're not in a gang.");
    const gang = await store.get(user.gangId, { type: "json" });
    if (gang) {
      gang.members = gang.members.filter((m) => m !== user.username);
      if (gang.members.length === 0) {
        await store.delete(gang.id);
      } else {
        if (gang.leader === user.username) gang.leader = gang.members[0];
        await store.setJSON(gang.id, gang);
      }
    }
    user.gangId = null;
    await saveUser(user);
    return json({ user: publicUser(user) });
  }

  return errorResponse("Unknown action.");
};
