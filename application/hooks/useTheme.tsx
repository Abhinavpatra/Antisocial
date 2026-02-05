import { type PaletteName, Palettes, type ThemeName } from '@/constants/colors';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeMode = ThemeName | 'system';

type ThemeContextValue = {
  theme: ThemeName;
  colors: (typeof Palettes)[PaletteName][ThemeName];
  mode: ThemeMode;
  palette: PaletteName;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: PaletteName) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
ThemeContext.displayName = 'ThemeContext';

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = (useColorScheme() ?? 'light') as ThemeName;
  const [mode, setMode] = useState<ThemeMode>('system');
  const [palette, setPalette] = useState<PaletteName>('a');

  const theme = mode === 'system' ? systemTheme : mode;

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const current = prev === 'system' ? systemTheme : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  }, [systemTheme]);

  const value = useMemo(
    () => ({
      theme,
      colors: Palettes[palette][theme],
      mode,
      palette,
      setMode,
      setPalette,
      toggleTheme,
    }),
    [theme, mode, palette, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const systemTheme = (useColorScheme() ?? 'light') as ThemeName;
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    return {
      theme: systemTheme,
      colors: Palettes['a'][systemTheme],
      mode: 'system' as ThemeMode,
      palette: 'a',
      setMode: () => {},
      setPalette: () => {},
      toggleTheme: () => {},
    } satisfies ThemeContextValue;
  }

  return ctx;
}
