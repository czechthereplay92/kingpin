import { REGEN, maxStatsForLevel, clamp } from "./gamedata.js";

// Applies elapsed-time effects to a user object in place and returns it.
// Call this on every read AND before every write, so state is always
// consistent without needing a background cron job.
export function applyRegen(user) {
  const now = Date.now();
  const elapsedMinutes = Math.max(0, (now - user.lastRegenAt) / 60000);

  if (elapsedMinutes > 0) {
    const maxes = maxStatsForLevel(user.level);

    user.energy = clamp(user.energy + elapsedMinutes * REGEN.energyPerMinute, 0, maxes.maxEnergy);
    user.brave = clamp(user.brave + elapsedMinutes * REGEN.bravePerMinute, 0, maxes.maxBrave);
    user.will = clamp(user.will + elapsedMinutes * REGEN.willPerMinute, 0, maxes.maxWill);

    // Health only regenerates naturally outside the hospital.
    const inHospital = user.hospitalUntil && user.hospitalUntil > now;
    if (!inHospital) {
      user.health = clamp(user.health + elapsedMinutes * REGEN.healthPerMinute, 0, maxes.maxHealth);
    }

    user.lastRegenAt = now;
  }

  // Release from jail once the sentence has passed.
  if (user.jailUntil && user.jailUntil <= now) {
    user.jailUntil = null;
    user.jailReason = null;
  }

  // Release from hospital once healed, restoring a health floor.
  if (user.hospitalUntil && user.hospitalUntil <= now) {
    user.hospitalUntil = null;
    const maxes = maxStatsForLevel(user.level);
    user.health = Math.max(user.health, Math.floor(maxes.maxHealth * 0.25));
  }

  // Resolve travel once arrival time has passed.
  if (user.travelUntil && user.travelUntil <= now) {
    user.city = user.travelTo;
    user.travelTo = null;
    user.travelUntil = null;
  }

  return user;
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
