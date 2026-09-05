// Core game constants and formulas. Single source of truth for balance.

export const REGEN = {
  energyPerMinute: 1 / 3, // 1 point every 3 minutes
  bravePerMinute: 1 / 4, // 1 point every 4 minutes
  willPerMinute: 1 / 5, // 1 point every 5 minutes
  healthPerMinute: 1, // only while not in hospital
};

export function maxStatsForLevel(level) {
  return {
    maxEnergy: 100 + (level - 1) * 5,
    maxBrave: 50 + (level - 1) * 2,
    maxWill: 50 + (level - 1) * 2,
    maxHealth: 100 + (level - 1) * 10,
  };
}

export function expForNextLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function startingState(username, passwordHash) {
  const level = 1;
  const maxes = maxStatsForLevel(level);
  const now = Date.now();
  return {
    username,
    passwordHash,
    level,
    exp: 0,
    money: 500,
    bank: 0,
    energy: maxes.maxEnergy,
    brave: maxes.maxBrave,
    will: maxes.maxWill,
    health: maxes.maxHealth,
    ...maxes,
    strength: 10,
    defense: 10,
    speed: 10,
    jailUntil: null,
    jailReason: null,
    hospitalUntil: null,
    city: "Redgate City",
    travelTo: null,
    travelUntil: null,
    jobId: null,
    jobShiftsWorked: 0,
    gangId: null,
    kills: 0,
    losses: 0,
    isAdmin: false,
    banned: false,
    banReason: null,
    bannedAt: null,
    bannedBy: null,
    lastIp: null,
    ipHistory: [],
    createdAt: now,
    lastRegenAt: now,
  };
}

export const CITIES = [
  { id: "redgate", name: "Redgate City", travelMinutes: 0, unlockLevel: 1 },
  { id: "millhaven", name: "Millhaven", travelMinutes: 3, unlockLevel: 3 },
  { id: "east-vance", name: "East Vance", travelMinutes: 6, unlockLevel: 7 },
  { id: "port-solano", name: "Port Solano", travelMinutes: 10, unlockLevel: 12 },
  { id: "old-quarter", name: "The Old Quarter", travelMinutes: 15, unlockLevel: 18 },
];

export const CRIMES = [
  {
    id: "pickpocket",
    name: "Pickpocket a tourist",
    unlockLevel: 1,
    braveCost: 3,
    baseSuccess: 80,
    minMoney: 20,
    maxMoney: 80,
    exp: 4,
    jailMinutes: 2,
  },
  {
    id: "shoplift",
    name: "Shoplift from a corner store",
    unlockLevel: 1,
    braveCost: 5,
    baseSuccess: 70,
    minMoney: 40,
    maxMoney: 120,
    exp: 7,
    jailMinutes: 3,
  },
  {
    id: "car-theft",
    name: "Boost a car",
    unlockLevel: 3,
    braveCost: 10,
    baseSuccess: 60,
    minMoney: 150,
    maxMoney: 400,
    exp: 15,
    jailMinutes: 6,
  },
  {
    id: "burglary",
    name: "Burgle a house",
    unlockLevel: 5,
    braveCost: 15,
    baseSuccess: 55,
    minMoney: 300,
    maxMoney: 700,
    exp: 22,
    jailMinutes: 9,
  },
  {
    id: "armored-truck",
    name: "Hit an armored truck",
    unlockLevel: 9,
    braveCost: 25,
    baseSuccess: 45,
    minMoney: 800,
    maxMoney: 1800,
    exp: 40,
    jailMinutes: 15,
  },
  {
    id: "bank-heist",
    name: "Rob a bank",
    unlockLevel: 15,
    braveCost: 40,
    baseSuccess: 35,
    minMoney: 2000,
    maxMoney: 5000,
    exp: 70,
    jailMinutes: 25,
  },
];

export const JOBS = [
  { id: "dishwasher", name: "Dishwasher", unlockLevel: 1, energyCost: 10, pay: 30, exp: 2 },
  { id: "driver", name: "Getaway Driver", unlockLevel: 4, energyCost: 15, pay: 90, exp: 6 },
  { id: "bookkeeper", name: "Bookkeeper", unlockLevel: 8, energyCost: 20, pay: 200, exp: 12 },
  { id: "fixer", name: "Fixer", unlockLevel: 14, energyCost: 25, pay: 450, exp: 22 },
  { id: "consigliere", name: "Consigliere", unlockLevel: 20, energyCost: 30, pay: 900, exp: 40 },
];

export const GYM_STATS = ["strength", "defense", "speed"];
export const GYM_ENERGY_COST = 5;
export const GYM_GAIN_PER_SESSION = 2;

export function combatRating(user) {
  return user.strength * 1.2 + user.defense * 1.0 + user.speed * 0.8;
}

export function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Grants exp to a user, handling level-ups and raising their max stats.
// Returns true if the user leveled up at least once.
export function grantExp(user, amount) {
  user.exp += amount;
  let leveledUp = false;
  let needed = expForNextLevel(user.level);
  while (user.exp >= needed) {
    user.exp -= needed;
    user.level += 1;
    leveledUp = true;
    const maxes = maxStatsForLevel(user.level);
    // Fully refill on level-up as a small reward.
    user.maxEnergy = maxes.maxEnergy;
    user.maxBrave = maxes.maxBrave;
    user.maxWill = maxes.maxWill;
    user.maxHealth = maxes.maxHealth;
    user.energy = maxes.maxEnergy;
    user.brave = maxes.maxBrave;
    user.will = maxes.maxWill;
    user.health = maxes.maxHealth;
    needed = expForNextLevel(user.level);
  }
  return leveledUp;
}
