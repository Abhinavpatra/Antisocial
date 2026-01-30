export type ThemeName = 'light' | 'dark';

export const AppColors = {
  light: {
    background: '#F8F8F6',
    surface: '#FFFFFF',
    surfaceAlt: '#FCFBF8',
    text: '#1B1A0E',
    textMuted: '#97944E',
    border: '#E7E6D0',
    primary: '#E9DF2B',
    primaryAlt: '#EAD72A',
    ring: '#E8DE2A',
    shadow: 'rgba(233,223,43,0.25)',
  },
  dark: {
    background: '#000000',
    surface: '#0A0A0A',
    surfaceAlt: '#2E2B1B',
    text: '#FFFFFF',
    textMuted: '#CCCCCC',
    border: 'rgba(255,255,255,0.2)',
    primary: '#D6B80A',
    primaryAlt: '#C4A709',
    ring: '#D5B60A',
    shadow: 'rgba(214,184,10,0.35)',
  },
} as const;
