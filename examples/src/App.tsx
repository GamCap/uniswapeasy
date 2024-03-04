import { useCallback, useEffect, useRef, useState } from "react";
import { UniswapEasy } from "uniswapeasy";
import { useActiveProvider } from "./connectors";
import { JSON_RPC_URL } from "./constants";
import Web3Connectors from "./components/Web3Connectors";
import { Token } from "@uniswap/sdk-core";

const ThemeNames = [
  "tealDark",
  "tealLight",
  "orangeDark",
  "orangeLight",
] as const;
const App = () => {
  const connectors = useRef<HTMLDivElement>(null);
  const focusConnectors = useCallback(() => connectors.current?.focus(), []);
  const [themeName, setThemeName] = useState<
    "tealDark" | "tealLight" | "orangeDark" | "orangeLight"
  >("tealDark");
  useEffect(() => {
    //when theme changes, find the first body element and set its background color
    const body = document.querySelector("body");
    if (body) {
      body.style.backgroundColor =
        themeName == "tealDark" || themeName == "orangeDark"
          ? "black"
          : "white";
    }
  }, [themeName]);

  const provider = useActiveProvider();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        gap: "1rem",
        width: "100%",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", flexDirection: "row" }}>
        {ThemeNames.map((themeName) => (
          <button
            key={themeName}
            style={{
              padding: "1rem",
              borderRadius: "1em",
              cursor: "pointer",
            }}
            onClick={() => setThemeName(themeName)}
          >
            {themeName}
          </button>
        ))}
      </div>
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
        theme={themeName}
        defaultChainId={1}
        jsonRpcUrlMap={{
          111: JSON_RPC_URL,
          11155111: "https://sepolia.drpc.org",
        }}
        provider={provider}
        poolKeys={[
          {
            currency0: new Token(
              5,
              "0x981d8acaf6af3a46785e7741d22fbe81b25ebf1e",
              18,
              "UNI"
            ),
            currency1: new Token(
              5,
              "0x9FD21bE27A2B059a288229361E2fA632D8D2d074",
              6,
              "USDC"
            ),
            fee: 5000,
            tickSpacing: 60,
            hooks: "0x0000000000000000000000000000000000000000",
          },
        ]}
      />
    </div>
  );
};

export default App;
