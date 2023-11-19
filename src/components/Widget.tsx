import { PropsWithChildren, StrictMode } from "react";
import WidgetContainer, { WidgetContainerProps } from "./WidgetContainer";
// import styled from "styled-components/macro";
import { Provider as ThemeProvider, Theme } from "../theme";

export interface WidgetProps extends WidgetContainerProps {
  locale: string;
  theme: Theme;
}

export default function Widget(props: PropsWithChildren<WidgetProps>) {
  return (
    <StrictMode>
      <ThemeProvider theme={props.theme}>
        <WidgetContainer>{props.children}</WidgetContainer>
      </ThemeProvider>
    </StrictMode>
  );
}
