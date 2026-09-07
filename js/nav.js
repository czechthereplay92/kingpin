import { api, clearToken } from "./api.js";
import { citySkylineSvg } from "./skylines.js";

const CITY_NAME_TO_ID = {
  "New York City": "new-york",
  "Chicago": "chicago",
  "Philadelphia": "philadelphia",
  "Atlantic City": "atlantic-city",
  "Las Vegas": "las-vegas",
  "Miami": "miami",
};

export function cityIdForName(name) {
  return CITY_NAME_TO_ID[name] || "new-york";
}

const NAV_ITEMS = [
  { href: "dashboard.html", label: "Dashboard" },
  { href: "crimes.html", label: "Crimes" },
  { href: "gym.html", label: "Gym" },
  { href: "jobs.html", label: "Jobs" },
  { href: "bank.html", label: "Bank" },
  { href: "travel.html", label: "Travel" },
  { href: "gang.html", label: "Gang" },
  { href: "attack.html", label: "Attack" },
  { href: "leaderboard.html", label: "Leaderboard" },
];

export function renderShell() {
  const current = window.location.pathname.split("/").pop() || "dashboard.html";
  const links = NAV_ITEMS.map(
    (item) =>
      `<a href="${item.href}" class="${item.href === current ? "active" : ""}">${item.label}</a>`
  ).join("");

  document.body.innerHTML = `
    <div class="app-shell">
      <nav class="rail">
        <div class="rail-title">KINGPIN</div>
        ${links}
        <a href="#" id="logout-link" class="logout-link">Log out</a>
      </nav>
      <main class="main">
        <div id="hero-banner"></div>
        <div id="rap-sheet" class="rap-sheet"></div>
        <div id="status-banner"></div>
        <div id="page-content"></div>
      </main>
    </div>
  `;

  document.getElementById("logout-link").addEventListener("click", async (e) => {
    e.preventDefault();
    await api("logout", { method: "POST" }).catch(() => {});
    clearToken();
    window.location.href = "index.html";
  });
}

function fmtTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function renderRapSheet(user, maxes) {
  const heroEl = document.getElementById("hero-banner");
  if (heroEl) {
    const cityId = cityIdForName(user.city);
    heroEl.innerHTML = `
      <div class="hero-banner">
        ${citySkylineSvg(cityId, { height: 130 })}
        <div class="hero-caption">${user.city}</div>
      </div>
    `;
  }

  const el = document.getElementById("rap-sheet");
  const bar = (value, max, cls = "") =>
    `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${Math.min(100, (value / max) * 100)}%"></div></div>`;

  el.innerHTML = `
    <div class="rap-cell">
      <div class="label">${user.username} — Lvl ${user.level}</div>
      <div class="value brass">$${Math.floor(user.money).toLocaleString()} cash</div>
    </div>
    <div class="rap-cell">
      <div class="label">Bank</div>
      <div class="value">$${Math.floor(user.bank).toLocaleString()}</div>
    </div>
    <div class="rap-cell">
      <div class="label">Health ${Math.floor(user.health)}/${maxes.maxHealth}</div>
      ${bar(user.health, maxes.maxHealth, "health")}
    </div>
    <div class="rap-cell">
      <div class="label">Energy ${Math.floor(user.energy)}/${maxes.maxEnergy}</div>
      ${bar(user.energy, maxes.maxEnergy)}
    </div>
    <div class="rap-cell">
      <div class="label">Brave ${Math.floor(user.brave)}/${maxes.maxBrave}</div>
      ${bar(user.brave, maxes.maxBrave)}
    </div>
    <div class="rap-cell">
      <div class="label">Will ${Math.floor(user.will)}/${maxes.maxWill}</div>
      ${bar(user.will, maxes.maxWill)}
    </div>
    <div class="rap-cell">
      <div class="label">Location</div>
      <div class="value">${user.city}</div>
    </div>
  `;

  const banner = document.getElementById("status-banner");
  const now = Date.now();
  if (user.jailUntil && user.jailUntil > now) {
    banner.innerHTML = `<div class="status-banner">Behind bars for ${user.jailReason || "a crime"}. Free in ${fmtTime(user.jailUntil - now)}.</div>`;
  } else if (user.hospitalUntil && user.hospitalUntil > now) {
    banner.innerHTML = `<div class="status-banner">In the hospital. Discharged in ${fmtTime(user.hospitalUntil - now)}.</div>`;
  } else if (user.travelUntil && user.travelUntil > now) {
    banner.innerHTML = `<div class="status-banner">En route to ${user.travelTo}. Arriving in ${fmtTime(user.travelUntil - now)}.</div>`;
  } else {
    banner.innerHTML = "";
  }
}

export async function loadState() {
  const data = await api("me");
  renderRapSheet(data.user, data.maxes);
  if (data.user.isAdmin) addAdminLinkIfMissing();
  return data;
}

function addAdminLinkIfMissing() {
  const rail = document.querySelector(".rail");
  if (!rail || rail.querySelector('a[href="admin.html"]')) return;
  const current = window.location.pathname.split("/").pop() || "dashboard.html";
  const link = document.createElement("a");
  link.href = "admin.html";
  link.textContent = "Admin";
  if (current === "admin.html") link.className = "active";
  const logoutLink = document.getElementById("logout-link");
  rail.insertBefore(link, logoutLink);
}
