import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser } from "./_lib/store.js";
import { applyRegen, publicUser } from "./_lib/regen.js";
import { maxStatsForLevel, expForNextLevel } from "./_lib/gamedata.js";

export default async (req) => {
  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);

  applyRegen(user);
  await saveUser(user);

  return json({
    user: publicUser(user),
    maxes: maxStatsForLevel(user.level),
    expToNext: expForNextLevel(user.level),
  });
};
