import { Interface } from '@ethersproject/abi'
import { Currency, CurrencyAmount, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import ERC20ABI from 'abis/erc20.json'
import { Erc20Interface } from 'abis/types/Erc20'
import { Result } from 'ethers/lib/utils'
import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'

import { isAddress } from 'utils/addresses'

const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { chainId } = useWeb3React() // we cannot fetch balances cross-chain
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false && t?.chainId === chainId) ?? [],
    [chainId, tokens]
  )
  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
  const balances = getCurrencyBalances(validatedTokenAddresses, address)
  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
            }
            return memo
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances]
  )
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(
    account,
    useMemo(() => [token], [token])
  )
  if (!token) return undefined
  return tokenBalances[token.address]
}

/**
 * Returns balances for tokens on currently-connected chainId via RPC.
 * See useCachedPortfolioBalancesQuery for multichain portfolio balances via GQL.
 */
export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[]
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies]
  )

  const { chainId } = useWeb3React()
  const tokenBalances = useTokenBalances(account, tokens)
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies])
//   const ethBalance = useNativeCurrencyBalances(useMemo(() => (containsETH ? [account] : []), [containsETH, account]))

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!account || !currency || currency.chainId !== chainId) return undefined
        if (currency.isToken) return tokenBalances[currency.address]
        // if (currency.isNative) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, chainId, currencies, tokenBalances]
  )
}

export default function useCurrencyBalance(
  account?: string,
  currency?: Currency
): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(
    account,
    useMemo(() => [currency], [currency])
  )[0]
}

function getCurrencyBalances(
  validatedTokenAddresses: string[],
  address?: string
) {

  const {provider} = useWeb3React()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  //TODO
  //cancel promises on unmount
  useEffect(() => {
    if (!provider || !address) return
    setLoading(true)
    setError(undefined)

    const calls = validatedTokenAddresses.map((tokenAddress) => {
      return  provider?.call({
        to: tokenAddress,
        data: ERC20Interface.encodeFunctionData('balanceOf', [address]),
      })
    })

    Promise.all(calls).then((results) => {
      const balances = results.map((result) => {
        return  ERC20Interface.decodeFunctionResult('balanceOf', result)  
      })
      setResults(balances)
      setLoading(false)
      setError(undefined)
    }).catch((error) => {
      console.error('Error when getting balances', error)
      setLoading(false)
      setError(error)
    })

  }, [validatedTokenAddresses, address,  provider])

  return useMemo(
    () => results.map((result) => {
      return {
        result: result,
        loading: loading,
        error: error
      }
    }
  ), [results, loading, error]
  )

}
