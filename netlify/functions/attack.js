import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser, getUser } from "./_lib/store.js";
import { applyRegen, isJailed, isHospitalized, isTraveling, publicUser } from "./_lib/regen.js";
import { combatRating, maxStatsForLevel } from "./_lib/gamedata.js";

export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const attacker = await requireUser(req);
  if (!attacker) return errorResponse("Not authenticated.", 401);

  applyRegen(attacker);

  if (isJailed(attacker)) return errorResponse("You're in jail.", 409);
  if (isHospitalized(attacker)) return errorResponse("You're in the hospital.", 409);
  if (isTraveling(attacker)) return errorResponse("You're traveling.", 409);
  if (attacker.health < 20) return errorResponse("You're too hurt to fight. Heal up first.");

  const body = await req.json().catch(() => ({}));
  const targetName = (body.username || "").trim();
  if (!targetName || targetName.toLowerCase() === attacker.username.toLowerCase()) {
    return errorResponse("Pick a valid target.");
  }

  const defender = await getUser(targetName);
  if (!defender) return errorResponse("That player doesn't exist.");

  applyRegen(defender);
  if (isJailed(defender)) return errorResponse("That player is in jail. They're safe for now.", 409);
  if (isHospitalized(defender)) return errorResponse("That player is already in the hospital.", 409);

  const attackerRating = combatRating(attacker) * (0.85 + Math.random() * 0.3);
  const defenderRating = combatRating(defender) * (0.85 + Math.random() * 0.3);
  const attackerWins = attackerRating >= defenderRating;

  let result;
  if (attackerWins) {
    const stolenPct = 0.05 + Math.random() * 0.1;
    const stolen = Math.floor(defender.money * stolenPct);
    defender.money -= stolen;
    attacker.money += stolen;
    attacker.kills += 1;
    defender.losses += 1;

    const defMaxes = maxStatsForLevel(defender.level);
    defender.health = 0;
    defender.hospitalUntil = Date.now() + (5 + Math.floor(Math.random() * 10)) * 60000;

    const atkMaxes = maxStatsForLevel(attacker.level);
    attacker.health = Math.max(10, attacker.health - Math.floor(atkMaxes.maxHealth * 0.1));

    result = { outcome: "win", stolen };
  } else {
    attacker.losses += 1;
    defender.kills += 1;
    const atkMaxes = maxStatsForLevel(attacker.level);
    attacker.health = 0;
    attacker.hospitalUntil = Date.now() + (5 + Math.floor(Math.random() * 10)) * 60000;
    result = { outcome: "loss" };
  }

  await saveUser(defender);
  await saveUser(attacker);

  return json({ ...result, user: publicUser(attacker) });
};
