import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { AppColors, type ThemeName } from '@/constants/colors';

type ThemeMode = ThemeName | 'system';

type ThemeContextValue = {
  theme: ThemeName;
  colors: (typeof AppColors)[ThemeName];
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = (useColorScheme() ?? 'light') as ThemeName;
  const [mode, setMode] = useState<ThemeMode>('system');

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
      colors: AppColors[theme],
      mode,
      setMode,
      toggleTheme,
    }),
    [theme, mode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within AppThemeProvider');
  }
  return ctx;
}
