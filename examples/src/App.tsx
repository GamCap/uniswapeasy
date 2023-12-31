import { useCallback, useRef } from "react";
import { UniswapEasy } from "uniswapeasy";
// import {UniswapEasy} from "../../src/index";
import { useActiveProvider } from "./connectors";
import { JSON_RPC_URL } from "./constants";
import Web3Connectors from "./components/Web3Connectors";
const App = () => {
  const connectors = useRef<HTMLDivElement>(null);
  const focusConnectors = useCallback(() => connectors.current?.focus(), []);
  const provider = useActiveProvider();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
        margin: "2rem 0",
        gap: "1rem",
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          borderRadius: "1em",
        }}
        ref={connectors}
        tabIndex={-1}
      >
        <Web3Connectors />
      </div>
      <button
        style={{
          padding: "1rem",
          borderRadius: "1em",
          cursor: "pointer",
        }}
        onClick={focusConnectors}
      >
        Connect Wallet
      </button>
      <div
        style={{
          backgroundColor: "#f7f8fa",
          borderRadius: "1rem",
          height: "356px",
          width: "360px",
        }}
      >
        <UniswapEasy
          theme={{
            primary: "#1a1a1a",
            secondary: "#1a1a1a",
            tertiary: "#1a1a1a",
            background: "#f7f8fa",
            text: "#1a1a1a",
            textInverted: "#f7f8fa",
          }}
          defaultChainId={1}
          jsonRpcUrlMap={{
            111: JSON_RPC_URL,
          }}
          provider={provider}
          poolKeys={[
            {
              currency0: "0x0000000000000000000000000000000000000001",
              currency1: "0x0000000000000000000000000000000000000002",
              fee: 300,
              tickSpacing: 50,
              hooks: "0x0",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default App;
