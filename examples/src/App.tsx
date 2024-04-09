import { useEffect, useRef, useState } from "react";
import { UniswapEasy, orangeDark, defaultTheme } from "uniswapeasy";
import { useActiveProvider } from "./connectors";
import Web3Connectors from "./components/Web3Connectors";
import { currencyIconMap, hookInfos, poolKeys } from "./constants/lp";
const App = () => {
  const [theme, setTheme] = useState(defaultTheme);

  const onPrimaryTextChange = (text: string) => {
    setTheme((prev) => ({
      ...prev,
      text: {
        ...prev.text,
        primary: text,
      },
    }));
  };

  const connectors = useRef<HTMLDivElement>(null);
  // const [isDark, setIsDark] = useState(true);

  // useEffect(() => {
  //   const body = document.querySelector("body");
  //   if (body) {
  //     body.style.backgroundColor = isDark ? "black" : "white";
  //   }
  // }, [isDark]);

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
        {/* <button
          style={{
            padding: "1rem",
            borderRadius: "1em",
            cursor: "pointer",
          }}
          onClick={() => setIsDark(!isDark)}
        >
          Toggle Dark Mode
        </button> */}
        <input onChange={(e) => onPrimaryTextChange(e.target.value)} />
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
        theme={theme}
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
