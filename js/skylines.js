// Neon wireframe skyline art: generic geometric shapes (not recreations of
// any specific real building), styled to match the app's cyan/magenta
// futuristic theme. No external image hosting to depend on.

const PALETTES = {
  "new-york": { accent: "#00E5FF", glow: "#7CF5FF", second: "#FF2E9A" },
  "chicago": { accent: "#33F2A0", glow: "#9CFFDA", second: "#00E5FF" },
  "philadelphia": { accent: "#FF2E9A", glow: "#FF9FD3", second: "#00E5FF" },
  "atlantic-city": { accent: "#B24BFF", glow: "#DDB0FF", second: "#00E5FF" },
  "las-vegas": { accent: "#FF2E9A", glow: "#5EE7E0", second: "#FFD23F" },
  "miami": { accent: "#33F2A0", glow: "#FF9F7A", second: "#00E5FF" },
};

function bg(id, p) {
  return `
    <defs>
      <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#05070C"/>
        <stop offset="70%" stop-color="#0A0F1C"/>
        <stop offset="100%" stop-color="#0D1424"/>
      </linearGradient>
      <radialGradient id="sun-${id}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${p.second}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="${p.second}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="fade-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${p.accent}" stop-opacity="0"/>
        <stop offset="100%" stop-color="${p.accent}" stop-opacity="0.18"/>
      </linearGradient>
    </defs>
    <rect width="400" height="160" fill="url(#sky-${id})"/>
    <circle cx="335" cy="38" r="34" fill="url(#sun-${id})"/>
  `;
}

function b(x, w, h, p, seed) {
  const y = 132 - h;
  let windows = "";
  const cols = Math.max(1, Math.floor(w / 9));
  const rows = Math.max(1, Math.floor(h / 11));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r * cols + c + seed) % 4 === 0) {
        windows += `<rect x="${x + 3 + c * 9}" y="${y + 5 + r * 11}" width="3" height="5" fill="${p.glow}" opacity="0.85"/>`;
      }
    }
  }
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#0B1220" fill-opacity="0.85" stroke="${p.accent}" stroke-width="1"/>
    ${windows}
  `;
}

const SKYLINES = {
  "new-york": (p) => `
    ${b(8, 26, 55, p, 0)}${b(38, 20, 90, p, 1)}${b(62, 30, 45, p, 2)}
    ${b(100, 24, 118, p, 0)}${b(128, 18, 70, p, 1)}
    ${b(154, 28, 135, p, 2)}${b(186, 16, 80, p, 0)}
    ${b(210, 24, 100, p, 1)}${b(240, 32, 60, p, 2)}
    ${b(280, 20, 85, p, 0)}${b(304, 26, 128, p, 1)}
    ${b(334, 18, 68, p, 2)}${b(358, 24, 48, p, 0)}
  `,
  "chicago": (p) => `
    ${b(16, 34, 50, p, 0)}${b(56, 22, 80, p, 1)}
    <polygon points="150,132 150,30 165,10 180,30 180,132" fill="#0B1220" fill-opacity="0.85" stroke="${p.accent}" stroke-width="1"/>
    ${b(196, 26, 60, p, 2)}${b(228, 20, 92, p, 0)}
    ${b(254, 32, 46, p, 1)}${b(300, 24, 72, p, 2)}
    ${b(330, 20, 96, p, 0)}
  `,
  "philadelphia": (p) => `
    ${b(10, 22, 36, p, 0)}${b(36, 22, 40, p, 1)}${b(62, 22, 34, p, 2)}
    ${b(88, 22, 42, p, 0)}${b(114, 22, 36, p, 1)}
    <rect x="180" y="14" width="26" height="118" fill="#0B1220" fill-opacity="0.85" stroke="${p.accent}" stroke-width="1"/>
    <polygon points="180,14 193,-2 206,14" fill="none" stroke="${p.accent}" stroke-width="1"/>
    ${b(236, 22, 38, p, 2)}${b(262, 22, 44, p, 0)}${b(288, 22, 34, p, 1)}
    ${b(320, 22, 40, p, 2)}${b(346, 22, 36, p, 0)}
  `,
  "atlantic-city": (p) => `
    ${b(14, 30, 90, p, 0)}${b(48, 26, 118, p, 1)}${b(84, 26, 78, p, 2)}
    <circle cx="228" cy="82" r="38" fill="none" stroke="${p.accent}" stroke-width="1.4"/>
    <line x1="192" y1="82" x2="264" y2="82" stroke="${p.accent}" stroke-width="1"/>
    <line x1="209" y1="49" x2="247" y2="115" stroke="${p.accent}" stroke-width="1"/>
    <line x1="247" y1="49" x2="209" y2="115" stroke="${p.accent}" stroke-width="1"/>
    <circle cx="192" cy="82" r="3" fill="${p.glow}"/><circle cx="264" cy="82" r="3" fill="${p.glow}"/>
    <circle cx="209" cy="49" r="3" fill="${p.glow}"/><circle cx="247" cy="49" r="3" fill="${p.glow}"/>
    <circle cx="209" cy="115" r="3" fill="${p.glow}"/><circle cx="247" cy="115" r="3" fill="${p.glow}"/>
    <line x1="228" y1="120" x2="228" y2="132" stroke="${p.accent}" stroke-width="1.4"/>
    ${b(290, 26, 84, p, 0)}${b(324, 28, 110, p, 1)}
  `,
  "las-vegas": (p) => `
    ${b(14, 30, 62, p, 0)}
    <rect x="56" y="26" width="22" height="106" fill="#0B1220" fill-opacity="0.85" stroke="${p.second}" stroke-width="1"/>
    <rect x="90" y="10" width="6" height="24" fill="${p.glow}" opacity="0.8"/>
    ${b(130, 36, 78, p, 1)}
    <polygon points="190,132 190,36 246,36 246,132" fill="#0B1220" fill-opacity="0.85" stroke="${p.accent}" stroke-width="1"/>
    <rect x="278" y="16" width="6" height="26" fill="${p.second}" opacity="0.85"/>
    ${b(296, 32, 68, p, 2)}${b(336, 26, 92, p, 0)}
  `,
  "miami": (p) => `
    ${b(24, 22, 50, p, 0)}${b(50, 20, 76, p, 1)}${b(78, 22, 58, p, 2)}
    ${b(160, 20, 88, p, 0)}${b(186, 22, 54, p, 1)}
    <path d="M232 132c-1-30 8-46 6-68" fill="none" stroke="${p.accent}" stroke-width="1.4"/>
    <path d="M238 64l-16-12M238 64l16-12M238 64l-8-18M238 64l8-18" fill="none" stroke="${p.second}" stroke-width="1.2"/>
    ${b(280, 24, 46, p, 2)}${b(310, 22, 66, p, 0)}
  `,
};

export function citySkylineSvg(cityId, { width = "100%", height = 140 } = {}) {
  const palette = PALETTES[cityId] || PALETTES["new-york"];
  const art = (SKYLINES[cityId] || SKYLINES["new-york"])(palette);

  let horizonLines = "";
  for (let i = -6; i <= 6; i++) {
    const xTop = 200 + i * 14;
    const xBottom = 200 + i * 60;
    horizonLines += `<line x1="${xTop}" y1="132" x2="${xBottom}" y2="160" stroke="${palette.accent}" stroke-width="0.7" opacity="0.3"/>`;
  }
  for (let j = 0; j < 4; j++) {
    const y = 136 + j * 6;
    horizonLines += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${palette.accent}" stroke-width="0.6" opacity="${0.28 - j * 0.06}"/>`;
  }

  return `<svg viewBox="0 0 400 160" width="${width}" height="${height}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">${bg(cityId, palette)}${art}<rect x="0" y="130" width="400" height="2" fill="${palette.accent}" opacity="0.6"/>${horizonLines}</svg>`;
}

export const CITY_ACCENTS = Object.fromEntries(
  Object.entries(PALETTES).map(([id, p]) => [id, p.accent])
);
