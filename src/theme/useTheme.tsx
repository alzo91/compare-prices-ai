import { createContext, type PropsWithChildren, useContext } from 'react';

import { light, type Theme } from './light';

const ThemeContext = createContext<Theme>(light);

export function ThemeProvider({ children }: PropsWithChildren) {
  return <ThemeContext.Provider value={light}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
