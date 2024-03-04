import { createContext, useContext, PropsWithChildren, useMemo } from "react";
import {
  DefaultTheme,
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
} from "styled-components";
import type { BorderRadius, Colors, Gaps, Theme } from "./theme";
export type { Color, Colors, Theme, ThemeV2, ColorsV2 } from "./theme";

export interface ThemeProps {
  theme: Theme;
}

export const lightTheme: Colors = {
  primary: "#FFFFFF", // pure white for primary elements
  secondary: "#2ecc71", // a light green for secondary elements
  tertiary: "#f1c40f", // a muted yellow for tertiary accents
  background: "#12131A", // a dark blue for backgrounds
  backgroundSecondary: "#191D26", // a slightly lighter blue for backgrounds
  backgroundTertiary: "#273345", // a very light gray for backgrounds
  text: "#34495e", // a darker gray for regular text, ensuring good readability
  textActive: "#44FF9A", // a light green for active text
  textInverted: "#ffffff", // pure white for text on dark backgrounds
  textTertiary: "#9CA3AF", // a light gray for text on dark backgrounds
  border: "#273345",
};

export const darkTheme: Colors = {
  primary: "",
  secondary: "",
  tertiary: "",
  background: "",
  backgroundSecondary: "",
  backgroundTertiary: "",
  text: "",
  textActive: "",
  textInverted: "",
  textTertiary: "",
  border: "",
};

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
  xl: "32px",
};

const defaultFont = {
  family: "'Inter', sans-serif",
};

export const defaultTheme = {
  font: defaultFont,
  grids: gapValues,
  ...lightTheme,
  borderRadius: defaultBorderRadius,
};

const ThemeContext = createContext<DefaultTheme>(toDefaultTheme(defaultTheme));

// Create a Global Style component
const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${(props) => props.theme.font.family};
  }
`;
export function Provider({ theme, children }: PropsWithChildren<ThemeProps>) {
  const themeCtx = useContext(ThemeContext);
  const value = useMemo(() => {
    return toDefaultTheme({
      ...theme,
      ...themeCtx,
    } as Required<Theme>);
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

function toDefaultTheme(theme: Required<Theme>): DefaultTheme {
  // default font is Inter
  return {
    ...theme,
    borderRadius: theme.borderRadius
      ? (theme.borderRadius as BorderRadius)
      : defaultBorderRadius,
    grids: theme.grids ? (theme.grids as Gaps) : gapValues,
  };
}
