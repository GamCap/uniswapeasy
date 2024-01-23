import { useCallback, useRef } from "react";
import { UniswapEasy } from "uniswapeasy";
import { useActiveProvider } from "./connectors";
import { JSON_RPC_URL } from "./constants";
import Web3Connectors from "./components/Web3Connectors";
import { Token } from "@uniswap/sdk-core";
const App = () => {
  const connectors = useRef<HTMLDivElement>(null);
  const focusConnectors = useCallback(() => connectors.current?.focus(), []);
  const provider = useActiveProvider();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: "1rem",
      }}
    >
      <div
        style={{
          alignSelf: "center",
          borderRadius: "1em",
        }}
        ref={connectors}
        tabIndex={-1}
      >
        <Web3Connectors />
      </div>
      {/* <button
        style={{
          padding: "1rem",
          borderRadius: "1em",
          cursor: "pointer",
        }}
        onClick={focusConnectors}
      >
        Connect Wallet
      </button> */}
      <UniswapEasy
        theme={
          {
            // primary: "#1a1a1a",
            // secondary: "#1a1a1a",
            // tertiary: "#1a1a1a",
            // background: "#f7f8fa",
            // text: "#1a1a1a",
            // textInverted: "#f7f8fa",
          }
        }
        defaultChainId={1}
        jsonRpcUrlMap={{
          111: JSON_RPC_URL,
          11155111: "https://sepolia.drpc.org",
        }}
        provider={provider}
        poolKeys={[
          {
            currency0: new Token(
              11155111,
              "0x4a97B63b27576d774b6BD288Fa6aAe24F086B84c",
              6,
              "USDC"
            ),
            currency1: new Token(
              11155111,
              "0x697aC93c9263346c5Ad0412F9356D5789a3AA687",
              8,
              "WBTC"
            ),
            fee: 12582912,
            tickSpacing: 60,
            hooks: "0x846b2F2fe5fad0131E84A110900a4561099452e4",
          },
        ]}
      />
    </div>
  );
};

export default App;
