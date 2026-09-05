import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser } from "./_lib/store.js";
import { applyRegen, isJailed, isHospitalized, publicUser } from "./_lib/regen.js";
import { JOBS, grantExp } from "./_lib/gamedata.js";

export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);

  applyRegen(user);

  if (isJailed(user)) return errorResponse("You're in jail.", 409);
  if (isHospitalized(user)) return errorResponse("You're in the hospital.", 409);

  const body = await req.json().catch(() => ({}));

  if (body.action === "apply") {
    const job = JOBS.find((j) => j.id === body.jobId);
    if (!job) return errorResponse("Unknown job.");
    if (user.level < job.unlockLevel) return errorResponse("You don't qualify for that job yet.");
    user.jobId = job.id;
    user.jobShiftsWorked = 0;
    await saveUser(user);
    return json({ user: publicUser(user) });
  }

  if (body.action === "quit") {
    user.jobId = null;
    await saveUser(user);
    return json({ user: publicUser(user) });
  }

  if (body.action === "work") {
    const job = JOBS.find((j) => j.id === user.jobId);
    if (!job) return errorResponse("You don't have a job. Apply for one first.");
    if (user.energy < job.energyCost) return errorResponse("Not enough energy.");

    user.energy -= job.energyCost;
    user.money += job.pay;
    user.jobShiftsWorked += 1;
    const leveledUp = grantExp(user, job.exp);

    await saveUser(user);
    return json({ pay: job.pay, exp: job.exp, leveledUp, user: publicUser(user) });
  }

  return errorResponse("Unknown action.");
};
