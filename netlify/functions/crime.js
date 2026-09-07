import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser } from "./_lib/store.js";
import { applyRegen, isJailed, isHospitalized, isTraveling, publicUser } from "./_lib/regen.js";
import { CRIMES, grantExp } from "./_lib/gamedata.js";

export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);

  applyRegen(user);

  if (isJailed(user)) return errorResponse("You're in jail. Wait it out.", 409);
  if (isHospitalized(user)) return errorResponse("You're in the hospital.", 409);
  if (isTraveling(user)) return errorResponse("You're traveling.", 409);

  const body = await req.json().catch(() => ({}));
  const crime = CRIMES.find((c) => c.id === body.crimeId);
  if (!crime) return errorResponse("Unknown crime.");
  if (user.level < crime.unlockLevel) return errorResponse("You're not experienced enough for this.");
  if (user.brave < crime.braveCost) return errorResponse("Not enough brave.");

  user.brave -= crime.braveCost;

  // Success chance rises slightly with level above the crime's requirement.
  const levelBonus = (user.level - crime.unlockLevel) * 2;
  const successChance = Math.max(5, Math.min(95, crime.baseSuccess + levelBonus));
  const roll = Math.random() * 100;

  let result;
  if (roll <= successChance) {
    const payout = Math.floor(crime.minMoney + Math.random() * (crime.maxMoney - crime.minMoney));
    user.money += payout;
    const leveledUp = grantExp(user, crime.exp);
    result = { outcome: "success", payout, exp: crime.exp, leveledUp };
  } else if (roll <= successChance + (100 - successChance) / 2) {
    // Half of failures are a clean getaway, half land you in jail.
    result = { outcome: "failure" };
  } else {
    user.jailUntil = Date.now() + crime.jailMinutes * 60000;
    user.jailReason = crime.name;
    result = { outcome: "jailed", jailMinutes: crime.jailMinutes };
  }

  await saveUser(user);
  return json({ ...result, user: publicUser(user) });
};
