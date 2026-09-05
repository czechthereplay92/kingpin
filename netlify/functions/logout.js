import { getToken, destroySession, json } from "./_lib/auth.js";

export default async (req) => {
  await destroySession(getToken(req));
  return json({ ok: true });
};
