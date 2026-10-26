/** Branded placeholder shown when a destination has no image or an image fails to load. */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1E3A8A"/><stop offset="1" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="800" height="520" fill="url(#g)"/>
  <path d="M0 420 L180 250 L300 350 L420 190 L560 330 L640 270 L800 420 L800 520 L0 520 Z" fill="#10B981" opacity="0.28"/>
  <path d="M0 460 L140 330 L260 400 L380 290 L520 410 L620 360 L800 460 L800 520 L0 520 Z" fill="#10B981" opacity="0.45"/>
  <circle cx="610" cy="150" r="46" fill="#FBBF24" opacity="0.85"/>
  <text x="400" y="488" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#ffffff" opacity="0.7" letter-spacing="4">GOWIN TRAVELS</text>
</svg>`;

export const PLACEHOLDER_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
