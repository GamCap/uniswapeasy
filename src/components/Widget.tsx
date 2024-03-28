import { PropsWithChildren, StrictMode } from "react";
import {
  Provider as Web3Provider,
  ProviderProps as Web3Props,
} from "hooks/web3";
import { ThemeName, Provider as ThemeProvider, ThemeV2 } from "theme";
import { Provider as ReduxProvider } from "react-redux";
import store from "../state";
import { LPWidgetProps } from "./LPWidget/LPWidget";

export interface WidgetProps extends Web3Props {
  theme: ThemeV2 | ThemeName;
}

export default function Widget(props: PropsWithChildren<WidgetProps>) {
  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <Web3Provider {...(props as Web3Props)}>
          <ThemeProvider theme={props.theme}>{props.children}</ThemeProvider>
        </Web3Provider>
      </ReduxProvider>
    </StrictMode>
  );
}
