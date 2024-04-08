import { Currency } from "@uniswap/sdk-core";
import { useWeb3React } from "@web3-react/core";
import { isSupportedChainId } from "../constants/chains";
import type { PlaceholderSymbol } from "../components/CurrencyInput";

export function useCurrencyLogo(
  currency: Currency | PlaceholderSymbol,
  currencyIconMap: Record<string, string>
): string {
  const { chainId } = useWeb3React();

  const chainAllowed = isSupportedChainId(chainId) !== undefined;

  if (!chainAllowed) {
    return "";
  }

  if (currency === "C0" || currency === "C1") {
    return "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png";
  }

  return currencyIconMap[currency.symbol ?? ""] ?? "";
}
