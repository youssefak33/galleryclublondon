export const COLORS = {
  // Backgrounds - Deep atmosphere
  primaryBackground: '#0d0d0d',
  secondaryBackground: '#0d0d0d',
  surface: '#191a1c',
  surfaceHighlight: '#1f1f21',
  surfaceElevated: '#232325',

  // Radial simulation stops
  backdropCenter: '#1a1a1a',
  backdropEdge: '#000000',

  // Text
  textPrimary: '#F0F0F0',
  textSecondary: '#7f8ea3',
  textTertiary: '#7f8ea3',
  textDisabled: 'rgba(127, 142, 163, 0.6)',

  // Accent / Metallic gold (use sparingly)
  accent: '#BF953F',
  accentHighlight: '#FCF6BA',
  accentShadow: '#AA771C',
  goldGradient: ['#BF953F', '#FCF6BA', '#AA771C'] as const,
  brand: '#7f8ea3',
  brandGradient: ['#7f8ea3', '#6a7a8f'] as const,

  // Status (muted within palette)
  success: '#7f8ea3',
  error: '#7f8ea3',
  warning: '#BF953F',
  info: '#7f8ea3',

  // Glassmorphism
  glass: 'rgba(20, 20, 20, 0.8)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',

  // Shadows / glow
  goldGlow: '#D4AF37',
};

export const SIZES = {
  // global sizes - Réduits pour iPhone XS
  base: 8,
  font: 14,
  radius: 0,
  radiusLarge: 0,
  radiusXLarge: 0,
  padding: 16,
  paddingLarge: 20,

  // font sizes - Réduites pour iPhone XS
  h1: 28,
  h2: 22,
  h3: 18,
  h4: 16,
  body1: 16,
  body2: 14,
  body3: 13,
  body4: 12,
  caption: 11,
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Shadows
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    neon: {
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 0,
    },
  },
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, lineHeight: 32, letterSpacing: 2 },
  h2: { fontSize: SIZES.h2, lineHeight: 26, letterSpacing: 1.5 },
  h3: { fontSize: SIZES.h3, lineHeight: 22, letterSpacing: 1 },
  h4: { fontSize: SIZES.h4, lineHeight: 20, letterSpacing: 0.8 },
  body1: { fontSize: SIZES.body1, lineHeight: 22 },
  body2: { fontSize: SIZES.body2, lineHeight: 20 },
  body3: { fontSize: SIZES.body3, lineHeight: 18 },
  body4: { fontSize: SIZES.body4, lineHeight: 16 },
  caption: { fontSize: SIZES.caption, lineHeight: 14, letterSpacing: 0.5 },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;
