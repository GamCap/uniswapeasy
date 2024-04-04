import { Currency } from '@uniswap/sdk-core'
// import { TickProcessed, usePoolActiveLiquidity } from '../../hooks/web3/usePoolTickData'
import { useCallback, useEffect, useMemo } from 'react'
import { ChartEntry } from './types'
import { BigNumberish } from 'ethers'
import JSBI from 'jsbi'
import { usePoolActiveLiquidity } from 'hooks/web3/usePoolTickData'

type TickProcessed = {
  tick: number
  liquidityActive: JSBI
  liquidityNet: JSBI
  price0: string
}
export function useDensityChartData({
    currencyA,
    currencyB,
    feeAmount,
    tickSpacing,
    hooks,
}: {
    currencyA?: Currency
    currencyB?: Currency
    feeAmount?: BigNumberish
    tickSpacing?: BigNumberish
    hooks?: string
}) {
  
  const { isLoading, error, data } = usePoolActiveLiquidity(currencyA, currencyB, feeAmount, tickSpacing, hooks)
  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined
    }

    const newData: ChartEntry[] = []

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i]

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      }

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry)
      }
    }

    return newData
  }, [data])

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: true ? formatData() : undefined,
    }
  }, [ formatData])
}