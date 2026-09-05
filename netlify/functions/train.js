import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser } from "./_lib/store.js";
import { applyRegen, isJailed, isHospitalized, publicUser } from "./_lib/regen.js";
import { GYM_STATS, GYM_ENERGY_COST, GYM_GAIN_PER_SESSION } from "./_lib/gamedata.js";

export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);

  applyRegen(user);

  if (isJailed(user)) return errorResponse("You're in jail.", 409);
  if (isHospitalized(user)) return errorResponse("You're in the hospital.", 409);

  const body = await req.json().catch(() => ({}));
  if (!GYM_STATS.includes(body.stat)) return errorResponse("Unknown stat.");
  if (user.energy < GYM_ENERGY_COST) return errorResponse("Not enough energy.");

  user.energy -= GYM_ENERGY_COST;
  user[body.stat] += GYM_GAIN_PER_SESSION;

  await saveUser(user);
  return json({ stat: body.stat, gained: GYM_GAIN_PER_SESSION, user: publicUser(user) });
};
