import { Currency } from "@uniswap/sdk-core";
// import { TickProcessed, usePoolActiveLiquidity } from '../../hooks/web3/usePoolTickData'
import { useCallback, useEffect, useMemo } from "react";
import { PriceHistoryEntry, TickDataEntry } from "./types";
import { BigNumberish } from "ethers";
import JSBI from "jsbi";
import { usePoolActiveLiquidity } from "hooks/web3/usePoolTickData";

type TickProcessed = {
  tick: number;
  liquidityActive: JSBI;
  liquidityNet: JSBI;
  price0: string;
};
export function useTickDataEntry({
  currencyA,
  currencyB,
  feeAmount,
  tickSpacing,
  hooks,
}: {
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: BigNumberish;
  tickSpacing?: BigNumberish;
  hooks?: string;
}) {
  const { isLoading, error, data } = usePoolActiveLiquidity(
    currencyA,
    currencyB,
    feeAmount,
    tickSpacing,
    hooks
  );
  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined;
    }

    const newData: TickDataEntry[] = [];

    for (let i = 0; i < data.length; i++) {
      const t: TickProcessed = data[i];

      const chartEntry = {
        activeLiquidity: parseFloat(t.liquidityActive.toString()),
        price0: parseFloat(t.price0),
      };

      if (chartEntry.activeLiquidity > 0) {
        newData.push(chartEntry);
      }
    }

    return newData;
  }, [data]);

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: true ? formatData() : undefined,
    };
  }, [formatData]);
}

type PriceProcessed = {
  time: number;
  price0?: number;
};
export function usePriceHistoryEntry({
  currencyA,
  currencyB,
  feeAmount,
  tickSpacing,
  hooks,
  currentPrice,
}: {
  currencyA?: Currency;
  currencyB?: Currency;
  feeAmount?: BigNumberish;
  tickSpacing?: BigNumberish;
  hooks?: string;
  currentPrice?: number;
}) {
  const { isLoading, error, data } = usePoolPriceHistory(
    currencyA,
    currencyB,
    feeAmount,
    tickSpacing,
    hooks,
    currentPrice
  );

  //TODO: format price history data here

  const formatData = useCallback(() => {
    if (!data?.length) {
      return undefined;
    }

    const newData: PriceHistoryEntry[] = [];

    for (let i = 0; i < data.length; i++) {
      const t: PriceProcessed = data[i];

      const PriceHistoryEntry = {
        time: t.time,
        price0: t.price0 ?? 0,
      };

      if (PriceHistoryEntry.price0 > 0) {
        newData.push(PriceHistoryEntry);
      }
    }

    return newData;
  }, [data]);

  return useMemo(() => {
    return {
      isLoading,
      error,
      formattedData: true ? formatData() : undefined,
    };
  }, [formatData]);
}

const usePoolPriceHistory = (
  currencyA?: Currency,
  currencyB?: Currency,
  feeAmount?: BigNumberish,
  tickSpacing?: BigNumberish,
  hooks?: string,
  currentPrice?: number
) => {
  //mock data
  const data = [
    { time: 1712167200000, price0: 64205 },
    { time: 1712170800000, price0: 57559 },
    { time: 1712174400000, price0: 58068 },
    { time: 1712178000000, price0: 68755 },
    { time: 1712181600000, price0: 63017 },
    { time: 1712185200000, price0: 56234 },
    { time: 1712188800000, price0: 67503 },
    { time: 1712192400000, price0: 58928 },
    { time: 1712196000000, price0: 62132 },
    { time: 1712199600000, price0: 60253 },
    { time: 1712203200000, price0: 69720 },
    { time: 1712206800000, price0: 66864 },
    { time: 1712210400000, price0: 54941 },
    { time: 1712214000000, price0: 53713 },
    { time: 1712217600000, price0: 63363 },
    { time: 1712221200000, price0: 64121 },
    { time: 1712224800000, price0: 52520 },
    { time: 1712228400000, price0: 67149 },
    { time: 1712232000000, price0: 60203 },
    { time: 1712235600000, price0: 52585 },
    { time: 1712239200000, price0: 66845 },
    { time: 1712242800000, price0: 58667 },
    { time: 1712246400000, price0: 65665 },
    { time: 1712250000000, price0: currentPrice },
  ];

  const error = undefined;

  const isLoading = false;

  return { data, error, isLoading };
};
