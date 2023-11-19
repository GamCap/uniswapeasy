import { createContext, useContext, PropsWithChildren, useMemo } from "react";
import {
  DefaultTheme,
  ThemeProvider as StyledThemeProvider,
} from "styled-components";
import type { BorderRadius, Colors, Theme } from "./theme";
export type { Color, Colors, Theme } from "./theme";

export interface ThemeProps {
  theme: Theme;
}

export const lightTheme: Colors = {
  primary: "",
  secondary: "",
  tertiary: "",
  background: "",
  text: "",
  textInverted: "",
};

export const darkTheme: Colors = {
  primary: "",
  secondary: "",
  tertiary: "",
  background: "",
  text: "",
  textInverted: "",
};

const defaultBorderRadius: BorderRadius = {
  xsmall: "",
  small: "",
  medium: "",
  large: "",
};

export const defaultTheme = {
  ...lightTheme,
  borderRadius: defaultBorderRadius,
};

const ThemeContext = createContext<DefaultTheme>(toDefaultTheme(defaultTheme));

export function Provider({ theme, children }: PropsWithChildren<ThemeProps>) {
  const themeCtx = createContext(ThemeContext);
  const value = useMemo(() => {
    return toDefaultTheme({
      ...theme,
      ...themeCtx,
    } as Required<Theme>);
  }, [theme, themeCtx]);
  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

function toDefaultTheme(theme: Required<Theme>): DefaultTheme {
  return {
    ...theme,
  };
}
