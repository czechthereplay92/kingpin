// Generic, non-branded skyline silhouettes for each city. Kept as plain
// geometric shapes (not recreations of any specific real building) so
// there's nothing here that depends on an external image host staying up.

const PALETTES = {
  "new-york": { sky1: "#1A1512", sky2: "#3A2A1A", accent: "#D4A73A", glow: "#F2C464" },
  "chicago": { sky1: "#0F1A1E", sky2: "#1E3A3F", accent: "#4FB8C4", glow: "#7FDDE8" },
  "philadelphia": { sky1: "#1C1210", sky2: "#3D211C", accent: "#B5453A", glow: "#E07A6C" },
  "atlantic-city": { sky1: "#1A1024", sky2: "#3A1F4D", accent: "#C061C9", glow: "#F2A6F5" },
  "las-vegas": { sky1: "#160E1E", sky2: "#3D1240", accent: "#E84393", glow: "#5EE7E0" },
  "miami": { sky1: "#0E1C22", sky2: "#123A3F", accent: "#3ECFC0", glow: "#F2937A" },
};

function bg(id, p) {
  return `
    <defs>
      <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.sky1}"/>
        <stop offset="100%" stop-color="${p.sky2}"/>
      </linearGradient>
      <linearGradient id="glow-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.glow}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${p.glow}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="400" height="160" fill="url(#sky-${id})"/>
    <circle cx="330" cy="40" r="46" fill="url(#glow-${id})"/>
  `;
}

function building(x, w, h, fill) {
  return `<rect x="${x}" y="${160 - h}" width="${w}" height="${h}" fill="${fill}"/>`;
}

function windows(x, w, h, color, seed) {
  let out = "";
  const cols = Math.max(1, Math.floor(w / 10));
  const rows = Math.max(1, Math.floor(h / 12));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r * cols + c + seed) % 3 === 0) continue;
      out += `<rect x="${x + 3 + c * 10}" y="${160 - h + 6 + r * 12}" width="4" height="6" fill="${color}" opacity="0.7"/>`;
    }
  }
  return out;
}

const SKYLINES = {
  "new-york": (p) => `
    ${building(10, 30, 70, p.sky2)}
    ${building(45, 22, 100, p.accent)}${windows(45, 22, 100, p.glow, 1)}
    ${building(72, 34, 60, p.sky2)}
    ${building(112, 26, 130, p.accent)}${windows(112, 26, 130, p.glow, 2)}
    ${building(144, 20, 80, p.sky2)}
    ${building(170, 30, 150, p.accent)}${windows(170, 30, 150, p.glow, 0)}
    ${building(206, 18, 90, p.sky2)}
    ${building(230, 26, 115, p.accent)}${windows(230, 26, 115, p.glow, 1)}
    ${building(262, 34, 70, p.sky2)}
    ${building(302, 22, 95, p.accent)}${windows(302, 22, 95, p.glow, 2)}
    ${building(330, 30, 55, p.sky2)}
    ${building(366, 20, 75, p.accent)}${windows(366, 20, 75, p.glow, 0)}
  `,
  "chicago": (p) => `
    ${building(20, 40, 55, p.sky2)}
    ${building(70, 24, 90, p.accent)}${windows(70, 24, 90, p.glow, 0)}
    <polygon points="150,160 150,50 165,20 180,50 180,160" fill="${p.accent}"/>
    ${windows(150, 30, 110, p.glow, 1)}
    ${building(200, 30, 65, p.sky2)}
    ${building(240, 22, 100, p.accent)}${windows(240, 22, 100, p.glow, 2)}
    ${building(270, 36, 50, p.sky2)}
    ${building(320, 26, 80, p.accent)}${windows(320, 26, 80, p.glow, 1)}
    <rect x="0" y="152" width="400" height="8" fill="${p.sky1}" opacity="0.6"/>
  `,
  "philadelphia": (p) => `
    ${building(10, 26, 40, p.sky2)}${building(40, 26, 44, p.accent)}${building(70, 26, 38, p.sky2)}
    ${building(100, 26, 46, p.accent)}${building(130, 26, 40, p.sky2)}
    <rect x="185" y="30" width="30" height="130" fill="${p.accent}"/>
    <polygon points="185,30 200,8 215,30" fill="${p.accent}"/>
    ${windows(185, 30, 130, p.glow, 0)}
    ${building(240, 26, 42, p.sky2)}${building(270, 26, 48, p.accent)}${building(300, 26, 38, p.sky2)}
    ${building(330, 26, 44, p.accent)}${building(360, 26, 40, p.sky2)}
  `,
  "atlantic-city": (p) => `
    ${building(20, 36, 100, p.sky2)}${windows(20, 36, 100, p.glow, 1)}
    ${building(64, 30, 130, p.accent)}${windows(64, 30, 130, p.glow, 0)}
    ${building(104, 30, 90, p.sky2)}${windows(104, 30, 90, p.glow, 2)}
    <circle cx="230" cy="88" r="40" fill="none" stroke="${p.accent}" stroke-width="4" opacity="0.85"/>
    <line x1="192" y1="88" x2="268" y2="88" stroke="${p.accent}" stroke-width="2.5" opacity="0.85"/>
    <line x1="210" y1="53" x2="250" y2="123" stroke="${p.accent}" stroke-width="2.5" opacity="0.85"/>
    <line x1="250" y1="53" x2="210" y2="123" stroke="${p.accent}" stroke-width="2.5" opacity="0.85"/>
    <circle cx="192" cy="88" r="4" fill="${p.glow}"/>
    <circle cx="268" cy="88" r="4" fill="${p.glow}"/>
    <circle cx="210" cy="53" r="4" fill="${p.glow}"/>
    <circle cx="250" cy="53" r="4" fill="${p.glow}"/>
    <circle cx="210" cy="123" r="4" fill="${p.glow}"/>
    <circle cx="250" cy="123" r="4" fill="${p.glow}"/>
    <line x1="230" y1="128" x2="230" y2="150" stroke="${p.accent}" stroke-width="4"/>
    <rect x="0" y="150" width="400" height="10" fill="${p.sky2}"/>
    ${building(300, 28, 95, p.sky2)}${windows(300, 28, 95, p.glow, 1)}
    ${building(335, 30, 120, p.accent)}${windows(335, 30, 120, p.glow, 0)}
  `,
  "las-vegas": (p) => `
    ${building(20, 34, 70, p.sky2)}
    <rect x="60" y="30" width="26" height="130" fill="${p.accent}"/>${windows(60, 26, 130, p.glow, 1)}
    <rect x="95" y="8" width="8" height="30" fill="${p.glow}"/>
    ${building(140, 40, 90, p.sky2)}${windows(140, 40, 90, p.glow, 0)}
    <polygon points="200,160 200,40 260,40 260,160" fill="${p.accent}" opacity="0.9"/>
    ${windows(200, 60, 120, p.glow, 2)}
    <rect x="290" y="20" width="10" height="35" fill="${p.glow}"/>
    ${building(310, 36, 80, p.sky2)}${windows(310, 36, 80, p.glow, 1)}
    ${building(352, 30, 55, p.accent)}
  `,
  "miami": (p) => `
    ${building(30, 24, 60, p.sky2)}${windows(30, 24, 60, p.glow, 0)}
    ${building(60, 22, 90, p.accent)}${windows(60, 22, 90, p.glow, 1)}
    ${building(90, 24, 70, p.sky2)}${windows(90, 24, 70, p.glow, 2)}
    <circle cx="330" cy="35" r="20" fill="${p.glow}" opacity="0.8"/>
    ${building(180, 22, 100, p.accent)}${windows(180, 22, 100, p.glow, 0)}
    ${building(210, 24, 65, p.sky2)}
    <path d="M250 160 C 248 120, 260 100, 258 70" stroke="${p.sky2}" stroke-width="5" fill="none"/>
    <path d="M258 70 L240 55 M258 70 L276 55 M258 70 L250 48 M258 70 L266 48" stroke="${p.accent}" stroke-width="4" fill="none"/>
    ${building(300, 26, 55, p.sky2)}${building(330, 24, 75, p.accent)}${windows(330, 24, 75, p.glow, 1)}
  `,
};

export function citySkylineSvg(cityId, { width = "100%", height = 120 } = {}) {
  const palette = PALETTES[cityId] || PALETTES["new-york"];
  const art = (SKYLINES[cityId] || SKYLINES["new-york"])(palette);
  return `<svg viewBox="0 0 400 160" width="${width}" height="${height}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${bg(cityId, palette)}${art}</svg>`;
}

export const CITY_ACCENTS = Object.fromEntries(
  Object.entries(PALETTES).map(([id, p]) => [id, p.accent])
);
