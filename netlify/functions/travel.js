import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser } from "./_lib/store.js";
import { applyRegen, isJailed, isHospitalized, isTraveling, publicUser } from "./_lib/regen.js";
import { CITIES } from "./_lib/gamedata.js";

export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);

  applyRegen(user);

  if (isJailed(user)) return errorResponse("You're in jail.", 409);
  if (isHospitalized(user)) return errorResponse("You're in the hospital.", 409);
  if (isTraveling(user)) return errorResponse("You're already traveling.", 409);

  const body = await req.json().catch(() => ({}));
  const city = CITIES.find((c) => c.id === body.cityId);
  if (!city) return errorResponse("Unknown destination.");
  if (user.city === city.name) return errorResponse("You're already there.");
  if (user.level < city.unlockLevel) return errorResponse(`You need to be level ${city.unlockLevel} to go there.`);

  if (city.travelMinutes === 0) {
    user.city = city.name;
  } else {
    user.travelTo = city.name;
    user.travelUntil = Date.now() + city.travelMinutes * 60000;
  }

  await saveUser(user);
  return json({ user: publicUser(user) });
};
