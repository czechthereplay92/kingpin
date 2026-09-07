// Small line-icon set, drawn to match the neon/futuristic theme.
// Each returns a raw <svg> string sized via CSS (see .rail a svg, .rap-cell .label svg).

const ICONS = {
  dashboard: `<path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h8v8H3v-8zm10 3h8v5h-8v-5z" fill="currentColor"/>`,
  crimes: `<path d="M12 2 3 6v6c0 5 4 8.5 9 10 5-1.5 9-5 9-10V6l-9-4z"/><path d="M9 12l2 2 4-4"/>`,
  gym: `<path d="M4 8v8M2 10v4M20 8v8M22 10v4M8 8v8M16 8v8M8 12h8"/>`,
  jobs: `<path d="M4 8h16v11H4V8z"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>`,
  bank: `<path d="M3 10l9-6 9 6M5 10v9M19 10v9M9 10v9M15 10v9M3 19h18"/>`,
  travel: `<path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" opacity="0.5" stroke-width="1"/><circle cx="12" cy="12" r="3"/>`,
  gang: `<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M10 20c0-3 3-5 6-5s6 2 6 5"/>`,
  attack: `<path d="M4 20L20 4M14 4h6v6M9 15l-2 5-3-3 5-2z"/>`,
  leaderboard: `<path d="M6 20V10M12 20V4M18 20v-7" stroke-width="2.2"/>`,
  admin: `<path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6l7-4z"/><circle cx="12" cy="11" r="2.2"/>`,
  logout: `<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9"/>`,
  cash: `<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5.7 2.5 2c0 1.5-1.5 2-2.5 2.5-1.2.6-2.5 1.3-2.5 3 0 1.3 1.1 2 2.5 2s2.5-1.1 2.5-2.5" stroke-width="1.4"/>`,
  vault: `<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.5" stroke-width="1.4"/><path d="M12 9.5v1M12 13.5v1M9.5 12h1M13.5 12h1" stroke-width="1.2"/>`,
  heart: `<path d="M12 20s-7-4.5-9.5-9C1 7.5 2.5 4 6 4c2 0 3.5 1.2 4 2.5.5-1.3 2-2.5 4-2.5 3.5 0 5 3.5 3.5 7C19 15.5 12 20 12 20z"/>`,
  bolt: `<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z"/>`,
  brave: `<path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>`,
  will: `<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" stroke-width="1.4"/>`,
  pin: `<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.3" stroke-width="1.4"/>`,
};

export function icon(name, { size = 16 } = {}) {
  const body = ICONS[name] || ICONS.dashboard;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

// The app's badge logo: a hexagonal frame with a circuit-style "K"
// monogram, matching the line-icon and connector-node motifs used
// elsewhere (nav icons, skyline window dots).
export function kingpinLogo(size = 96) {
  return `
    <svg viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" gradientUnits="userSpaceOnUse" x1="15" y1="8" x2="105" y2="112">
          <stop offset="0%" stop-color="#00E5FF"/>
          <stop offset="100%" stop-color="#FF2E9A"/>
        </linearGradient>
      </defs>
      <path d="M60 8 L105 34 L105 86 L60 112 L15 86 L15 34 Z" fill="rgba(10,15,25,0.6)" stroke="url(#logoGrad)" stroke-width="2.5"/>
      <circle cx="60" cy="8" r="3" fill="#7CF5FF"/>
      <circle cx="105" cy="34" r="3" fill="#7CF5FF"/>
      <circle cx="105" cy="86" r="3" fill="#FF7AC2"/>
      <circle cx="60" cy="112" r="3" fill="#FF7AC2"/>
      <circle cx="15" cy="86" r="3" fill="#FF7AC2"/>
      <circle cx="15" cy="34" r="3" fill="#7CF5FF"/>
      <g stroke="url(#logoGrad)" stroke-width="9" stroke-linecap="round" fill="none">
        <line x1="42" y1="28" x2="42" y2="92"/>
        <line x1="42" y1="60" x2="82" y2="28"/>
        <line x1="42" y1="60" x2="82" y2="92"/>
      </g>
    </svg>
  `;
}
