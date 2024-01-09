import type { BigintIsh, Currency, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import JSBI from 'jsbi'
import { useMemo } from 'react'
import { PoolKeyStruct } from '../../abis/types/PoolManager'
import type { BigNumberish } from 'ethers'
import { Pool } from '../../entities/pool'

// Classes are expensive to instantiate, so this caches the recently instantiated pools.
// This avoids re-instantiating pools as the other pools in the same request are loaded.
class PoolCache {
  // Evict after 128 entries. Empirically, a swap uses 64 entries.
  private static MAX_ENTRIES = 128

  // These are FIFOs, using unshift/pop. This makes recent entries faster to find.
  private static pools: Pool[] = []
  private static poolKeys: PoolKeyStruct[] = []

  static getPoolKeys(tokenA: Token, tokenB: Token, fee: BigNumberish, tickSpacing: BigNumberish, hooks: string): PoolKeyStruct {
    if (this.poolKeys.length > this.MAX_ENTRIES) {
      this.poolKeys = this.poolKeys.slice(0, this.MAX_ENTRIES / 2)
    }
    const key: PoolKeyStruct = { currency0: tokenA.address, currency1: tokenB.address, fee, tickSpacing, hooks };
    
    const found = this.poolKeys.find((currentKey) => currentKey === key)
    if (found) return found
  
    this.poolKeys.unshift(key);
    return key;
  }

  static getPool(
    tokenA: Token,
    tokenB: Token,
    fee: BigNumberish,
    sqrtPriceX96: BigintIsh,
    liquidity: BigintIsh,
    tickSpacing: BigNumberish,
    tick: number
  ): Pool {
    if (this.pools.length > this.MAX_ENTRIES) {
      this.pools = this.pools.slice(0, this.MAX_ENTRIES / 2)
    }

    const found = this.pools.find(
      (pool) =>
        pool.token0 === tokenA &&
        pool.token1 === tokenB &&
        JSBI.EQ(pool.fee, fee) &&
        JSBI.EQ(pool.sqrtRatioX96, sqrtPriceX96) &&
        JSBI.EQ(pool.liquidity, liquidity) &&
        pool.tickCurrent === tick
    )
    if (found) return found

    const pool = new Pool(tokenA, tokenB, fee, sqrtPriceX96, liquidity, tickSpacing, tick)
    this.pools.unshift(pool)
    return pool
  }
}

export enum PoolState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePools(
  poolKeys: [Currency | undefined, Currency | undefined, BigNumberish | undefined, BigNumberish | undefined, string | undefined
][]
): [PoolState, Pool | null][] {
  const { chainId } = useWeb3React()

  const poolTokens: ([Token, Token, BigNumberish, BigNumberish, string] | undefined)[] = useMemo(() => {
    if (!chainId) return new Array(poolKeys.length)

    return poolKeys.map(([currencyA, currencyB, feeAmount]) => {
      if (currencyA && currencyB && feeAmount) {
        const tokenA = currencyA.wrapped
        const tokenB = currencyB.wrapped
        if (tokenA.equals(tokenB)) return undefined

        return tokenA.sortsBefore(tokenB) ? [tokenA, tokenB, feeAmount] : [tokenB, tokenA, feeAmount]
      }
      return undefined
    })
  }, [chainId, poolKeys])

  const poolKeyList: (PoolKeyStruct | undefined)[] = useMemo(() => {
    return poolTokens.map((value) => value && { currency0: value[0].address, currency1: value[1].address, fee: value[2], tickSpacing: value[3], hooks: value[4] })
  }, [chainId, poolTokens])

  //TODO
  // look into pool state interface and find v4 equivalent
  // getSlot0 , getLiquidity, multiCall
  // const slot0s = useMultipleContractSingleData(poolKeyList, POOL_STATE_INTERFACE, 'slot0')
  // const liquidities = useMultipleContractSingleData(poolKeyList, POOL_STATE_INTERFACE, 'liquidity')
  
  //mock data
  const slot0s = poolTokens.map((_value) => {
    return { result: { sqrtPriceX96: JSBI.BigInt("34127063508144082157086714069057263"), tick: 259478, tickSpacing: 60 }, loading: false, valid: true }
  })
  const liquidities = poolTokens.map((_value) => {
    return { result: [JSBI.BigInt("904643433375596462")], loading: false, valid: true }
  })

  return useMemo(() => {
    return poolKeys.map((_key, index) => {
      const tokens = poolTokens[index]
      if (!tokens) return [PoolState.INVALID, null]
      const [token0, token1, fee] = tokens

      if (!slot0s[index]) return [PoolState.INVALID, null]
      const { result: slot0, loading: slot0Loading, valid: slot0Valid } = slot0s[index]

      if (!liquidities[index]) return [PoolState.INVALID, null]
      const { result: liquidity, loading: liquidityLoading, valid: liquidityValid } = liquidities[index]

      if (!tokens || !slot0Valid || !liquidityValid) return [PoolState.INVALID, null]
      if (slot0Loading || liquidityLoading) return [PoolState.LOADING, null]
      if (!slot0 || !liquidity) return [PoolState.NOT_EXISTS, null]
      // if (!slot0.sqrtPriceX96 || JSBI.EQ(slot0.sqrtPriceX96,0)) return [PoolState.NOT_EXISTS, null]

      try {
        const pool = PoolCache.getPool(token0, token1, fee, slot0.sqrtPriceX96, liquidity[0],slot0.tickSpacing, slot0.tick)
        return [PoolState.EXISTS, pool]
      } catch (error) {
        console.error('Error when constructing the pool', error)
        return [PoolState.NOT_EXISTS, null]
      }
    })
  }, [liquidities, poolKeys, slot0s, poolTokens])
}

export function usePool(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    feeAmount: BigNumberish | undefined,
    tickSpacing: BigNumberish | undefined,
    hooks: string | undefined
): [PoolState, Pool | null] {
    const poolKeys: [Currency | undefined, Currency | undefined, BigNumberish | undefined, BigNumberish | undefined, string | undefined
    ][] = useMemo(
        () => [
            
                [currencyA,
                currencyB,
                feeAmount,
                tickSpacing,
                hooks]
            
        ],
        [currencyA, currencyB, feeAmount, tickSpacing, hooks]
    )

    return usePools(poolKeys)[0]
}