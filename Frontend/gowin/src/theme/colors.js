/**
 * Go Win International Brand Theme
 * Colors extracted from gowin.jpg logo:
 * - Navy Blue: #1e3a8a (The 'G' and primary text)
 * - Bright Orange: #f97316 (The secondary text & accents)
 * - Sky Blue: #38bdf8 (The plane wing & flight path)
 */
export const colors = {
  primary: {
    navy: '#2563eb',        // Vibrant Ocean Blue
    navyDark: '#1d4ed8',
    navyLight: '#60a5fa',
    navyMuted: '#f8fafc',
    midnight: '#020617',    // Deep Dark Background (Slate-950)
  },
  accent: {
    orange: '#fb923c',      // Modern Sunset Coral/Orange
    orangeDark: '#f97316',
    skyBlue: '#38bdf8',     // From the airplane icon
    skyBlueDark: '#0ea5e9',
  },
  neutral: {
    white: '#FFFFFF',
    offWhite: '#fafafa',
    lightGray: '#f3f4f6',   // slate-100
    gray: '#94a3b8',        // slate-400 (brighter for dark mode)
    darkGray: '#cbd5e1',    // slate-300 (brighter for dark mode)
    charcoal: '#0f172a',    // slate-900 (deep background)
  },
  gradients: {
    primary: 'linear-gradient(135deg, #1e3a8a 0%, #38bdf8 100%)',
    warm: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
    cool: 'linear-gradient(135deg, #38bdf8 0%, #1e3a8a 100%)',
    subtle: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
    hero: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(56, 189, 248, 0.9) 100%)',
    overlay: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(30, 41, 59, 0.4) 100%)',
  },
  shadows: {
    sm: '0 2px 4px rgba(30, 58, 138, 0.05)',
    md: '0 4px 12px rgba(30, 58, 138, 0.08)',
    lg: '0 8px 24px rgba(30, 58, 138, 0.12)',
    xl: '0 16px 48px rgba(30, 58, 138, 0.15)',
    card: '0 2px 8px rgba(30, 58, 138, 0.1)',
    cardHover: '0 8px 32px rgba(30, 58, 138, 0.2)',
  },
};

export default colors;
