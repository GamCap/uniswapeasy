import { useCallback, useEffect, useRef, useState } from "react";
import { UniswapEasy } from "uniswapeasy";
import { useActiveProvider } from "./connectors";
import { JSON_RPC_URL } from "./constants";
import Web3Connectors from "./components/Web3Connectors";
import { Token } from "@uniswap/sdk-core";
import { currencyIconMap, hookInfos, poolKeys } from "./constants/lp";

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
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
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
        jsonRpcUrlMap={{}}
        provider={provider}
        poolInfos={poolKeys}
        hookInfos={hookInfos}
        currencyIconMap={currencyIconMap}
      />
    </div>
  );
};

export default App;
