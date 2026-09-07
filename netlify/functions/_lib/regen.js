import { REGEN, maxStatsForLevel, clamp } from "./gamedata.js";

// Applies elapsed-time effects to a user object in place and returns
// whether anything actually changed. Callers use this to skip an
// unnecessary write when nothing needed updating (e.g. a page load
// less than a minute after the last one).
export function applyRegen(user) {
  const now = Date.now();
  const elapsedMinutes = Math.max(0, (now - user.lastRegenAt) / 60000);
  let changed = false;

  if (elapsedMinutes >= 1) {
    const maxes = maxStatsForLevel(user.level);

    const nextEnergy = clamp(user.energy + elapsedMinutes * REGEN.energyPerMinute, 0, maxes.maxEnergy);
    const nextBrave = clamp(user.brave + elapsedMinutes * REGEN.bravePerMinute, 0, maxes.maxBrave);
    const nextWill = clamp(user.will + elapsedMinutes * REGEN.willPerMinute, 0, maxes.maxWill);

    if (nextEnergy !== user.energy || nextBrave !== user.brave || nextWill !== user.will) changed = true;
    user.energy = nextEnergy;
    user.brave = nextBrave;
    user.will = nextWill;

    // Health only regenerates naturally outside the hospital.
    const inHospital = user.hospitalUntil && user.hospitalUntil > now;
    if (!inHospital) {
      const nextHealth = clamp(user.health + elapsedMinutes * REGEN.healthPerMinute, 0, maxes.maxHealth);
      if (nextHealth !== user.health) changed = true;
      user.health = nextHealth;
    }

    user.lastRegenAt = now;
    changed = true; // lastRegenAt itself moved forward
  }

  // Release from jail once the sentence has passed.
  if (user.jailUntil && user.jailUntil <= now) {
    user.jailUntil = null;
    user.jailReason = null;
    changed = true;
  }

  // Release from hospital once healed, restoring a health floor.
  if (user.hospitalUntil && user.hospitalUntil <= now) {
    user.hospitalUntil = null;
    const maxes = maxStatsForLevel(user.level);
    user.health = Math.max(user.health, Math.floor(maxes.maxHealth * 0.25));
    changed = true;
  }

  // Resolve travel once arrival time has passed.
  if (user.travelUntil && user.travelUntil <= now) {
    user.city = user.travelTo;
    user.travelTo = null;
    user.travelUntil = null;
    changed = true;
  }

  return changed;
}

export function isJailed(user) {
  return !!(user.jailUntil && user.jailUntil > Date.now());
}

export function isHospitalized(user) {
  return !!(user.hospitalUntil && user.hospitalUntil > Date.now());
}

export function isTraveling(user) {
  return !!(user.travelUntil && user.travelUntil > Date.now());
}

// Strips sensitive/internal fields before sending a user to the client.
export function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}
