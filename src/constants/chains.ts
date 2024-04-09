/**
 * List of all the networks supported by the Uniswap Interface
 */
export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,

  OPTIMISM = 10,
  OPTIMISM_GOERLI = 420,

  POLYGON = 137,
  POLYGON_MUMBAI = 80001,

  CELO = 42220,
  CELO_ALFAJORES = 44787,

  BNB = 56,

  BASE = 8453,

  ETHEREUM_SEPOLIA = 11155111,
}

export enum ChainName {
  MAINNET = "mainnet",
  ROPSTEN = "ropsten",
  RINKEBY = "rinkeby",
  GOERLI = "goerli",
  KOVAN = "kovan",
  OPTIMISM = "optimism-mainnet",
  OPTIMISM_GOERLI = "optimism-goerli",
  ARBITRUM_ONE = "arbitrum-mainnet",
  ARBITRUM_RINKEBY = "arbitrum-rinkeby",
  POLYGON = "polygon-mainnet",
  POLYGON_MUMBAI = "polygon-mumbai",
  CELO = "celo",
  CELO_ALFAJORES = "celo-alfajores",
  BNB = "bnb",
  BASE = "base",
  ETHEREUM_SEPOLIA = "ethereum-sepolia",
}

export const CHAIN_NAMES_TO_IDS: { [chainName: string]: SupportedChainId } = {
  [ChainName.MAINNET]: SupportedChainId.MAINNET,
  [ChainName.ROPSTEN]: SupportedChainId.ROPSTEN,
  [ChainName.RINKEBY]: SupportedChainId.RINKEBY,
  [ChainName.GOERLI]: SupportedChainId.GOERLI,
  [ChainName.KOVAN]: SupportedChainId.KOVAN,
  [ChainName.POLYGON]: SupportedChainId.POLYGON,
  [ChainName.POLYGON_MUMBAI]: SupportedChainId.POLYGON_MUMBAI,
  [ChainName.ARBITRUM_ONE]: SupportedChainId.ARBITRUM_ONE,
  [ChainName.ARBITRUM_RINKEBY]: SupportedChainId.ARBITRUM_RINKEBY,
  [ChainName.OPTIMISM]: SupportedChainId.OPTIMISM,
  [ChainName.OPTIMISM_GOERLI]: SupportedChainId.OPTIMISM_GOERLI,
  [ChainName.CELO]: SupportedChainId.CELO,
  [ChainName.CELO_ALFAJORES]: SupportedChainId.CELO_ALFAJORES,
  [ChainName.BNB]: SupportedChainId.BNB,
  [ChainName.BASE]: SupportedChainId.BASE,
  [ChainName.ETHEREUM_SEPOLIA]: SupportedChainId.ETHEREUM_SEPOLIA,
};

/**
 * Array of all the supported chain IDs
 */
export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(
  SupportedChainId
).filter((id) => typeof id === "number") as SupportedChainId[];

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.POLYGON,
  SupportedChainId.OPTIMISM,
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.CELO,
  SupportedChainId.BNB,
  SupportedChainId.BASE,
];

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.RINKEBY,
  SupportedChainId.GOERLI,
  SupportedChainId.KOVAN,
  SupportedChainId.POLYGON,
  SupportedChainId.POLYGON_MUMBAI,
  SupportedChainId.CELO,
  SupportedChainId.CELO_ALFAJORES,
] as const;

export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number];

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.OPTIMISM,
  SupportedChainId.OPTIMISM_GOERLI,
  SupportedChainId.BASE,
] as const;

export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];

export function isPolygonChain(
  chainId: number
): chainId is SupportedChainId.POLYGON | SupportedChainId.POLYGON_MUMBAI {
  return (
    chainId === SupportedChainId.POLYGON ||
    chainId === SupportedChainId.POLYGON_MUMBAI
  );
}

export function isSupportedChainId(
  chainId: number | undefined
): chainId is SupportedChainId {
  if (!chainId) return false;
  return ALL_SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId);
}

export const explorerMap: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: "https://etherscan.io",
  [SupportedChainId.ROPSTEN]: "https://ropsten.etherscan.io",
  [SupportedChainId.RINKEBY]: "https://rinkeby.etherscan.io",
  [SupportedChainId.GOERLI]: "https://goerli.etherscan.io",
  [SupportedChainId.KOVAN]: "https://kovan.etherscan.io",

  [SupportedChainId.ARBITRUM_ONE]: "https://arbiscan.io",
  [SupportedChainId.ARBITRUM_RINKEBY]: "https://testnet.arbiscan.io",

  [SupportedChainId.OPTIMISM]: "https://optimistic.etherscan.io",
  [SupportedChainId.OPTIMISM_GOERLI]: "https://goerli-optimism.etherscan.io",

  [SupportedChainId.POLYGON]: "https://polygonscan.com",
  [SupportedChainId.POLYGON_MUMBAI]: "https://mumbai.polygonscan.com",

  [SupportedChainId.CELO]: "https://explorer.celo.org",
  [SupportedChainId.CELO_ALFAJORES]:
    "https://alfajores-blockscout.celo-testnet.org",

  [SupportedChainId.BNB]: "https://bscscan.com",

  [SupportedChainId.BASE]: "https://basescan.org/",

  [SupportedChainId.ETHEREUM_SEPOLIA]: "https://sepolia.etherscan.io",
};
