import { json, errorResponse } from "./_lib/auth.js";
import { usersStore } from "./_lib/store.js";

export default async (req) => {
  const store = usersStore();
  const { blobs } = await store.list();

  const rows = [];
  for (const b of blobs) {
    const u = await store.get(b.key, { type: "json" });
    if (!u) continue;
    rows.push({
      username: u.username,
      level: u.level,
      netWorth: u.money + u.bank,
      kills: u.kills,
      losses: u.losses,
      gangId: u.gangId,
    });
  }

  rows.sort((a, b) => b.level - a.level || b.netWorth - a.netWorth);

  return json({ leaderboard: rows.slice(0, 50) });
};
