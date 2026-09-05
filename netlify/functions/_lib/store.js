import { getStore } from "@netlify/blobs";

export function usersStore() {
  return getStore("kingpin-users");
}

export function sessionsStore() {
  return getStore("kingpin-sessions");
}

export function gangsStore() {
  return getStore("kingpin-gangs");
}

export function bannedIpsStore() {
  return getStore("kingpin-banned-ips");
}

export async function getUser(username) {
  if (!username) return null;
  const store = usersStore();
  return await store.get(username.toLowerCase(), { type: "json" });
}

export async function saveUser(user) {
  const store = usersStore();
  await store.setJSON(user.username.toLowerCase(), user);
}

export async function listUsernames() {
  const store = usersStore();
  const { blobs } = await store.list();
  return blobs.map((b) => b.key);
}
