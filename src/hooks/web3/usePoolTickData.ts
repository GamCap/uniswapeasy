import { Currency, V3_CORE_FACTORY_ADDRESSES } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'

import JSBI from 'jsbi'
import { useEffect, useMemo, useState } from 'react'

import { PoolState, usePool } from './usePools'
import { BigNumberish } from 'ethers'
import { tickToPrice } from '../../utils/priceTickConversions'
import computeSurroundingTicks from '../../utils/computeSurroundingTicks'
const PRICE_FIXED_DIGITS = 8

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
  tick: number
  liquidityActive: JSBI
  liquidityNet: JSBI
  price0: string
}

const getActiveTick = (tickCurrent: number | undefined, feeAmount: number | undefined, tickSpacing: number | undefined) =>
  tickCurrent && feeAmount && tickSpacing ? Math.floor(tickCurrent / tickSpacing) * tickSpacing : undefined

function useTicksFromSubgraph(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    feeAmount: BigNumberish | undefined,
) {
  const { chainId } = useWeb3React()
  //not implemented yet
  //return a mock data
  return {
    data: {
      ticks: [
        {
          tickIdx: 0,
          liquidityGross: "0",
          liquidityNet: "0",
          price0: "0",
          price1: "0"
        }
      ]
  },
  error: undefined,
    loading: false
    }

}

interface TickData {
  tick: number
  liquidityGross: string
  liquidityNet: string
  price0: string
  price1: string
}
// Fetches all ticks for a given pool
function useAllV4Ticks(
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    feeAmount: BigNumberish | undefined
): {
  isLoading: boolean
  error: unknown
  ticks?: TickData[]
} {
  const [subgraphTickData, setSubgraphTickData] = useState<any[]>([])
  const { data, error, loading: isLoading } = useTicksFromSubgraph(currencyA, currencyB, feeAmount)

  // useEffect(() => {
  //   if (data?.ticks.length) {
  //     setSubgraphTickData((tickData) => [...tickData, ...data.ticks])
  //   }
  // }, [data?.ticks])

  return {
    isLoading: isLoading,
    error,
    ticks: data.ticks.map((t) => ({
      tick: Number(t.tickIdx),
      liquidityGross: t.liquidityGross,
      liquidityNet: t.liquidityNet,
      price0: t.price0,
      price1: t.price1,
    })),
  }
}

export function usePoolActiveLiquidity(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  feeAmount: BigNumberish | undefined,
  tickSpacing: BigNumberish | undefined,
  hooks: string | undefined,
  
): {
  isLoading: boolean
  error: any
  activeTick?: number
  data?: TickProcessed[]
} {
  const pool = usePool(currencyA, currencyB, feeAmount, tickSpacing, hooks)

  // Find nearest valid tick for pool in case tick is not initialized.
  const activeTick = useMemo(() => getActiveTick(pool[1]?.tickCurrent, feeAmount ? parseFloat(feeAmount.toString()) : undefined, tickSpacing? parseFloat(tickSpacing.toString()) : undefined), [pool, feeAmount, tickSpacing])

  const { isLoading, error, ticks } = useAllV4Ticks(currencyA, currencyB, feeAmount)

  return useMemo(() => {
    if (
      !currencyA ||
      !currencyB ||
      activeTick === undefined ||
      pool[0] !== PoolState.EXISTS ||
      !ticks ||
      ticks.length === 0 ||
      isLoading
    ) {
      return {
        isLoading: isLoading || pool[0] === PoolState.LOADING,
        error,
        activeTick,
        data: undefined,
      }
    }

    const token0 = currencyA?.wrapped
    const token1 = currencyB?.wrapped

    // find where the active tick would be to partition the array
    // if the active tick is initialized, the pivot will be an element
    // if not, take the previous tick as pivot
    const pivot = ticks.findIndex(({ tick }) => tick > activeTick) - 1

    if (pivot < 0) {
      // consider setting a local error
      console.error('TickData pivot not found')
      return {
        isLoading,
        error,
        activeTick,
        data: undefined,
      }
    }

    const activeTickProcessed: TickProcessed = {
      liquidityActive: JSBI.BigInt(pool[1]?.liquidity ?? 0),
      tick: activeTick,
      liquidityNet: Number(ticks[pivot].tick) === activeTick ? JSBI.BigInt(ticks[pivot].liquidityNet) : JSBI.BigInt(0),
      price0: tickToPrice(token0, token1, activeTick).toFixed(PRICE_FIXED_DIGITS),
    }

    const subsequentTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, true)

    const previousTicks = computeSurroundingTicks(token0, token1, activeTickProcessed, ticks, pivot, false)

    const ticksProcessed = previousTicks.concat(activeTickProcessed).concat(subsequentTicks)

    return {
      isLoading,
      error,
      activeTick,
      data: ticksProcessed,
    }
  }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, error])
}