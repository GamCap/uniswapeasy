import { createContext, useContext, PropsWithChildren, useMemo } from "react";
import {
  DefaultTheme,
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";
import type { BorderRadius, Gaps, Theme, Colors } from "./theme";
import { tealDark, tealLight } from "./teal";
import { orangeDark, orangeLight } from "./orange";
export type { Theme, Colors, Attributes } from "./theme";
export { tealDark, tealLight, orangeDark, orangeLight };

export interface ThemeProps {
  theme: Theme;
}

const defaultBorderRadius: BorderRadius = {
  xsmall: 0.5,
  small: 0.75,
  medium: 1,
  large: 1.5,
};

const gapValues: Gaps = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "20px",
  lgplus: "24px",
  xl: "32px",
};

const defaultFont = {
  family: "'Inter', sans-serif",
};

export const defaultTheme: Theme = {
  font: defaultFont,
  grids: gapValues,
  ...tealDark,
  borderRadius: defaultBorderRadius,
};

const ThemeContext = createContext<DefaultTheme>(defaultTheme);

// Create a Global Style component
const GlobalStyle = createGlobalStyle`
  * {
    font-family: ${(props) => props.theme.font.family};
  }
`;
export function Provider({ theme, children }: PropsWithChildren<ThemeProps>) {
  const themeCtx = useContext(ThemeContext);
  const value = useMemo(() => {
    return { ...themeCtx, ...theme };
  }, [theme, themeCtx]);
  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={value}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
