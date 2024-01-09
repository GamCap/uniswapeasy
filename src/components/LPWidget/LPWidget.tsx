import { useCallback, useEffect, useState } from "react";
import {
  useRangeHopCallbacks,
  useV4MintState,
  useV4PoolActionHandlers,
  useV4PoolInfo,
} from "../../state/v4/hooks";
import { PoolKeyStruct } from "../../abis/types/PoolManager";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, BigNumberish } from "ethers";
import usePoolManager from "../../hooks/web3/usePoolManager";
import { Bound } from "../../state/v4/actions";
import LiquidityChartRangeInput from "../LiquidityChartRangeInput";

export type LPWidgetProps = {
  poolKeys: PoolKeyStruct[];
};
export default function LPWidget({ poolKeys }: LPWidgetProps) {
  const { account, chainId, provider } = useWeb3React();
  //TODO: add a check for existing position

  const [poolKey, setPoolKey] = useState<PoolKeyStruct | undefined>(
    poolKeys[0]
  );

  const { independentField, typedValue, startPriceTypedValue } =
    useV4MintState();
  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV4PoolInfo(
    poolKey
    //existingPosition
  );

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV4PoolActionHandlers(noLiquidity);

  const isValid = !errorMessage && !invalidRange;

  //TODO:add useCurrency

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const poolManager = usePoolManager();

  //TODO: transaction approval callbacks

  async function onAdd() {
    if (!chainId || !provider || !account) return;
    if (!poolKey) return;
    //TODO: transaction deadline?
    if (position && account) {
      //prepare txn data
      //provider -> estimate gas -> send transaction
    } else {
      return;
    }
  }

  //TODO: pool select handler

  const clearAll = useCallback(() => {
    onLeftRangeInput("");
    onRightRangeInput("");
    onFieldAInput("");
    onFieldBInput("");
  }, [onLeftRangeInput, onRightRangeInput, onFieldAInput, onFieldBInput]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks;
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    pricesAtTicks;

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  } = useRangeHopCallbacks(
    currencies.CURRENCY_0,
    currencies.CURRENCY_1,
    BigNumber.from(pool?.fee.toString() ?? "0"),
    BigNumber.from(pool?.tickSpacing.toString() ?? "0"),
    tickLower,
    tickUpper,
    pool
  );

  const [minPrice, setMinPrice] = useState<string | undefined>();
  const [maxPrice, setMaxPrice] = useState<string | undefined>();

  const handleSetFullRange = useCallback(() => {
    getSetFullRange();
    const tempMinPrice = pricesAtLimit[Bound.LOWER];
    if (tempMinPrice && tempMinPrice.toSignificant(5) !== minPrice) {
      setMinPrice(tempMinPrice.toSignificant(5));
    }
    const tempMaxPrice = pricesAtLimit[Bound.UPPER];
    if (tempMaxPrice && tempMaxPrice.toSignificant(5) !== maxPrice) {
      setMaxPrice(tempMaxPrice.toSignificant(5));
    }
  }, [getSetFullRange, pricesAtLimit]);

  useEffect(() => {
    if (minPrice && typeof minPrice === "string" && !isNaN(minPrice as any)) {
      onLeftRangeInput(minPrice);
    }
  }, [minPrice, onLeftRangeInput]);

  useEffect(() => {
    if (maxPrice && typeof maxPrice === "string" && !isNaN(maxPrice as any)) {
      onRightRangeInput(maxPrice);
    }
  }, [maxPrice, onRightRangeInput]);

  return (
    <>
      {!account ? (
        <div>Connect Wallet</div>
      ) : invalidPool ? (
        <div>Invalid Pool</div>
      ) : (
        <LiquidityChartRangeInput
          currencyA={currencies.CURRENCY_0}
          currencyB={currencies.CURRENCY_1}
          feeAmount={
            pool?.fee ? BigNumber.from(pool?.fee.toString() ?? "0") : undefined
          }
          tickSpacing={
            pool?.tickSpacing
              ? BigNumber.from(pool?.tickSpacing.toString() ?? "0")
              : undefined
          }
          price={
            // price
            //   ? parseFloat(
            //       (invertPrice ? price.invert() : price).toSignificant(6)
            //     )
            //   : undefined
            159085938358.4664
          }
          priceLower={priceLower}
          priceUpper={priceUpper}
          ticksAtLimit={ticksAtLimit}
          onLeftRangeInput={onLeftRangeInput}
          onRightRangeInput={onRightRangeInput}
          interactive={true}
        />
      )}
    </>
  );
}
