import { useEffect, useRef, useState } from "react";
import { UniswapEasy, orangeDark, defaultTheme, PoolKey } from "uniswapeasy";
import { useActiveProvider } from "./connectors";
import Web3Connectors from "./components/Web3Connectors";
import { currencyIconMap, hookInfos, poolKeys } from "./constants/lp";
const App = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const [hookData, setHookData] = useState("");
  const onPrimaryTextChange = (text: string) => {
    setTheme((prev) => ({
      ...prev,
      text: {
        ...prev.text,
        primary: text,
      },
    }));
  };

  const onPoolSelect = (poolKey: PoolKey) => {
    console.log("Selected pool");
  };

  const connectors = useRef<HTMLDivElement>(null);

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
        <input onChange={(e) => onPrimaryTextChange(e.target.value)} />
        <input onChange={(e) => setHookData(e.target.value)} />
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
      <UniswapEasy
        theme={{ ...theme, font: { family: "'Times New Roman', serif" } }}
        defaultChainId={1}
        provider={provider}
        poolInfos={poolKeys}
        hookInfos={hookInfos}
        onPoolSelect={onPoolSelect}
        currencyIconMap={currencyIconMap}
        hookData={hookData}
      />
    </div>
  );
};

export default App;
