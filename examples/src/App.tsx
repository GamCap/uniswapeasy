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
        jsonRpcUrlMap={{}}
        provider={provider}
        poolInfos={[
          {
            poolKey: {
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
            chainId: 5,
          },
          {
            poolKey: {
              currency0: new Token(
                11155111,
                "0x29f2D40B0605204364af54EC677bD022dA425d03",
                8,
                "WBTC"
              ),
              currency1: new Token(
                11155111,
                "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8",
                6,
                "USDC"
              ),
              fee: 4000,
              tickSpacing: 60,
              hooks: "0x0000000000000000000000000000000000000000",
            },
            chainId: 11155111,
          },
          {
            poolKey: {
              currency0: new Token(
                11155111,
                "0x29f2D40B0605204364af54EC677bD022dA425d03",
                8,
                "WBTC"
              ),
              currency1: new Token(
                11155111,
                "0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8",
                6,
                "USDC"
              ),
              fee: 5000,
              tickSpacing: 60,
              hooks: "0x0000000000000000000000000000000000000000",
            },
            chainId: 11155111,
          },
        ]}
        hookInfos={[
          {
            address: "0x0000000000000000000000000000000000000000",
            name: "Test Hook",
            abbr: "TestHook",
            desc: "This is a test hook",
            inputFields: [
              {
                name: "Sender",
                description: "The address of the sender",
                type: "address",
                restrictions: {
                  required: true,
                },
              },
              {
                name: "TupleTest",
                description: "A tuple test",
                fields: [
                  {
                    name: "Number",
                    description: "A number test",
                    type: "uint24",
                    restrictions: {
                      min: "0",
                      pattern: "[0-9]*$",
                      required: true,
                    },
                  },
                  {
                    name: "String",
                    description: "A string test",
                    type: "string",
                    restrictions: {
                      pattern: "^[a-zA-Z]*$",
                      required: true,
                    },
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default App;
