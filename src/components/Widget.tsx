import { PropsWithChildren, StrictMode } from "react";
import WidgetContainer, { WidgetContainerProps } from "./WidgetContainer";
import {
  Provider as Web3Provider,
  ProviderProps as Web3Props,
} from "@/hooks/web3";
import { Provider as ThemeProvider, Theme } from "../theme";

export interface WidgetProps extends WidgetContainerProps, Web3Props {
  theme: Theme;
}

export default function Widget(props: PropsWithChildren<WidgetProps>) {
  return (
    <StrictMode>
      <ThemeProvider theme={props.theme}>
        <WidgetContainer>
          <Web3Provider {...(props as Web3Props)}>
            {props.children}
          </Web3Provider>
        </WidgetContainer>
      </ThemeProvider>
    </StrictMode>
  );
}
