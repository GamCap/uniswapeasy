import React from "react";
import { UniswapEasy } from "uniswapeasy";
import { useActiveProvider } from "./connectors";
import { JSON_RPC_URL } from "./constants";
const App = () => {
  const provider = useActiveProvider();
  return (
    <div>
      <h1>Widget Example</h1>
      <UniswapEasy
        theme={{}}
        jsonRpcUrlMap={{
          1: JSON_RPC_URL,
        }}
        provider={provider}
      />
    </div>
  );
};

export default App;
