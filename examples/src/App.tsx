import { useMemo, useState } from "react";
import { UniswapEasy, defaultTheme, PoolKey } from "@gamcaplabs/uniswapeasy";
import { currencyIconMap, hookInfos, poolKeys } from "./constants/lp";

import {
  createWeb3Modal,
  defaultConfig,
  useWeb3ModalProvider,
} from "@web3modal/ethers5/react";
import { Web3Provider } from "@ethersproject/providers";

const projectId = "c6c9bacd35afa3eb9e6cccf6d8464395";

const sepolia = {
  chainId: 11155111,
  name: "Ethereum Sepolia",
  currency: "ETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://sepolia.drpc.org",
};

const metadata = {
  name: "UniswapEasy",
  description: "UniswapEasy Widget Builder",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
});

createWeb3Modal({
  ethersConfig,
  chains: [sepolia],
  projectId,
  enableAnalytics: false,
});

const App = () => {
  const [theme, setTheme] = useState(defaultTheme);
  const [hookData, setHookData] = useState("");

  const onPoolSelect = (poolKey: PoolKey) => {
    console.log("Selected pool");
  };

  const { walletProvider } = useWeb3ModalProvider();
  const provider = useMemo(
    () =>
      walletProvider ? new Web3Provider(walletProvider, "any") : undefined,
    [walletProvider]
  );
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
        <input onChange={(e) => setHookData(e.target.value)} />
      </div>
      <w3m-button />
      <UniswapEasy
        theme={{ ...theme }}
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
