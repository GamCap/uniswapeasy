import { PropsWithChildren, StrictMode } from "react";
import {
  Provider as Web3Provider,
  ProviderProps as Web3Props,
} from "hooks/web3";
import { Provider as ThemeProvider, Theme } from "theme";
import { Provider as ReduxProvider } from "react-redux";
import store from "../state";
import { BlockNumberProvider } from "hooks/web3/useBlockNumber";

export interface WidgetProps extends Web3Props {
  theme: Theme;
}

export default function Widget(props: PropsWithChildren<WidgetProps>) {
  return (
    <StrictMode>
      <ReduxProvider store={store}>
        <Web3Provider {...(props as Web3Props)}>
          <BlockNumberProvider>
            <ThemeProvider theme={props.theme}>{props.children}</ThemeProvider>
          </BlockNumberProvider>
        </Web3Provider>
      </ReduxProvider>
    </StrictMode>
  );
}
