import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './index';

export type ThemeMode = 'system' | 'light' | 'dark';

type Ctx = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  paperTheme: typeof lightTheme;
};

const ThemeContext = createContext<Ctx>({
  mode: 'system',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: () => {},
  paperTheme: lightTheme,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const paperTheme =
    mode === 'light' ? lightTheme : mode === 'dark' ? darkTheme : system === 'dark' ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={{ mode, setMode, paperTheme }}>{children}</ThemeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeContext); 