/**
 * Go Win International Brand Theme
 * Standardized Brand Colors:
 * - Navy: #0F4C5C (Primary brand identity)
 * - Coral: #FF7F50 (Accent and action highlights)
 */
export const colors = {
  primary: {
    navy: '#0F4C5C',        // Brand Navy
    navyDark: '#0a3845',
    navyLight: '#186d82',
    navyMuted: '#f8fafb',
    midnight: '#020608',    
  },
  accent: {
    coral: '#FF7F50',       // Brand Coral
    coralDark: '#e56a42',
    coralLight: '#ff9a7a',
    skyBlue: '#38bdf8',     
  },  
  neutral: {
    white: '#FFFFFF',
    offWhite: '#fafafa',
    lightGray: '#f3f4f6',   
    gray: '#94a3b8',        
    darkGray: '#cbd5e1',    
    charcoal: '#0f172a',    
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0F4C5C 0%, #186d82 100%)',
    warm: 'linear-gradient(135deg, #FF7F50 0%, #ff9a7a 100%)',
    cool: 'linear-gradient(135deg, #186d82 0%, #0F4C5C 100%)',
    subtle: 'linear-gradient(135deg, #ffffff 0%, #f8fafb 100%)',
    hero: 'linear-gradient(135deg, rgba(15, 76, 92, 0.95) 0%, rgba(24, 109, 130, 0.9) 100%)',
    overlay: 'linear-gradient(180deg, rgba(15, 76, 92, 0.7) 0%, rgba(15, 76, 92, 0.4) 100%)',
  },
  shadows: {
    sm: '0 2px 4px rgba(15, 76, 92, 0.05)',
    md: '0 4px 12px rgba(15, 76, 92, 0.08)',
    lg: '0 8px 24px rgba(15, 76, 92, 0.12)',
    xl: '0 16px 48px rgba(15, 76, 92, 0.15)',
    card: '0 2px 8px rgba(15, 76, 92, 0.1)',
    cardHover: '0 8px 32px rgba(15, 76, 92, 0.2)',
  },
};

export default colors;

