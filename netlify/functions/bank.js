import { requireUser, json, errorResponse } from "./_lib/auth.js";
import { saveUser } from "./_lib/store.js";
import { applyRegen, publicUser } from "./_lib/regen.js";

export default async (req) => {
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await requireUser(req);
  if (!user) return errorResponse("Not authenticated.", 401);

  applyRegen(user);

  const body = await req.json().catch(() => ({}));
  const amount = Math.floor(Number(body.amount));
  if (!Number.isFinite(amount) || amount <= 0) return errorResponse("Enter a valid amount.");

  if (body.action === "deposit") {
    if (amount > user.money) return errorResponse("You don't have that much cash on hand.");
    user.money -= amount;
    user.bank += amount;
  } else if (body.action === "withdraw") {
    if (amount > user.bank) return errorResponse("You don't have that much in the bank.");
    user.bank -= amount;
    user.money += amount;
  } else {
    return errorResponse("Unknown action.");
  }

  await saveUser(user);
  return json({ user: publicUser(user) });
};
