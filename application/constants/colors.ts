export type ThemeName = 'light' | 'dark';
export type PaletteName = 'a' | 'b' | 'c' | 'd';

// Base shared colors or structures could go here
// Implementing the requested palettes

const PaletteA = {
  // Nature / Olive (Original-ish)
  light: {
    background: '#F8F8F6',
    surface: '#FFFFFF',
    surfaceAlt: '#FCFBF8',
    text: '#1B1A0E',
    textMuted: '#97944E',
    border: '#E7E6D0',
    primary: '#6CA651', // #6CA651
    primaryAlt: '#839705', // #839705
    ring: '#BBCB2E', // #BBCB2E
    shadow: 'rgba(108,166,81,0.25)',
  },
  dark: {
    background: '#000000', // Pitch black as requested
    surface: '#0A0A0A',
    surfaceAlt: '#1A1C0F',
    text: '#FFFFFF',
    textMuted: '#6B7445', // #6B7445 (using as muted/accent)
    border: 'rgba(255,255,255,0.15)',
    primary: '#BBCB2E', // Using the bright lime/yellow for dark mode primary
    primaryAlt: '#6CA651',
    ring: '#839705',
    shadow: 'rgba(187,203,46,0.3)',
  },
};

const PaletteB = {
  // Ocean / Blue
  light: {
    background: '#FFF8DE', // #FFF8DE
    surface: '#FFFFFF',
    surfaceAlt: '#F7F9FF',
    text: '#1C1E26',
    textMuted: '#576A8F', // #576A8F
    border: '#D8DEEB',
    primary: '#576A8F',
    primaryAlt: '#4A5B7A',
    ring: '#B7BDF7', // #B7BDF7
    shadow: 'rgba(87,106,143,0.25)',
  },
  dark: {
    background: '#000000',
    surface: '#0A0A0E',
    surfaceAlt: '#151720',
    text: '#FFFFFF',
    textMuted: '#B7BDF7',
    border: 'rgba(255,255,255,0.15)',
    primary: '#FF7444', // #FF7444 (Orange/Coral pop from palette B)
    primaryAlt: '#E65D2E',
    ring: '#576A8F',
    shadow: 'rgba(255,116,68,0.3)',
  },
};

const PaletteC = {
  // Sunset / Pink
  light: {
    background: '#FFFDCE', // #FFFDCE
    surface: '#FFFFFF',
    surfaceAlt: '#FFFDF5',
    text: '#2D1F25',
    textMuted: '#C28CA0',
    border: '#F2D3DF',
    primary: '#F075AE', // #F075AE
    primaryAlt: '#D65D96',
    ring: '#F7DB91', // #F7DB91
    shadow: 'rgba(240,117,174,0.25)',
  },
  dark: {
    background: '#000000',
    surface: '#0F0A0C',
    surfaceAlt: '#1F1519',
    text: '#FFFFFF',
    textMuted: '#F7DB91',
    border: 'rgba(255,255,255,0.15)',
    primary: '#9BC264', // #9BC264 (Green pop)
    primaryAlt: '#8AB153',
    ring: '#F075AE',
    shadow: 'rgba(155,194,100,0.3)',
  },
};

const PaletteD = {
  // Galaxy / Purple
  light: {
    background: '#F1E9E9', // #F1E9E9
    surface: '#FFFFFF',
    surfaceAlt: '#FAF6F6',
    text: '#180C1F',
    textMuted: '#982598',
    border: '#E8D3E8',
    primary: '#982598', // #982598
    primaryAlt: '#7A1D7A',
    ring: '#E491C9', // #E491C9
    shadow: 'rgba(152,37,152,0.25)',
  },
  dark: {
    background: '#000000',
    surface: '#0B0B0F',
    surfaceAlt: '#13131F',
    text: '#FFFFFF',
    textMuted: '#E491C9',
    border: 'rgba(255,255,255,0.15)',
    // Let's swap: keep #15173D as an accent, use lighter for primary
    // Actually user listed #15173D. Let's use #E491C9 (Pink) as primary in darkness for contrast.
    // Wait, #15173D is "Dark Blue". Let's stick to the list.
    // Let's use #982598 for dark mode primary
    primary: '#E491C9',
    primaryAlt: '#982598',
    ring: '#15173D',
    shadow: 'rgba(228,145,201,0.3)',
  },
};

export const Palettes = {
  a: PaletteA,
  b: PaletteB,
  c: PaletteC,
  d: PaletteD,
} as const;

// Default for types
export const AppColors = PaletteA;
