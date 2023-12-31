import { PropsWithChildren, StrictMode } from "react";
import WidgetContainer, { WidgetContainerProps } from "./WidgetContainer";
import {
  Provider as Web3Provider,
  ProviderProps as Web3Props,
} from "hooks/web3";
import { Provider as ThemeProvider, Theme } from "theme";
import { Provider as ReduxProvider } from "react-redux";
import store from "../state";
import { LPWidgetProps } from "./LPWidget/LPWidget";

export interface WidgetProps
  extends WidgetContainerProps,
    Web3Props,
    LPWidgetProps {
  theme: Theme;
}

export default function Widget(props: PropsWithChildren<WidgetProps>) {
  return (
    <StrictMode>
      <ThemeProvider theme={props.theme}>
        <WidgetContainer>
          <Web3Provider {...(props as Web3Props)}>
            <ReduxProvider store={store}>{props.children}</ReduxProvider>
          </Web3Provider>
        </WidgetContainer>
      </ThemeProvider>
    </StrictMode>
  );
}
