import {
  Currency,
  CurrencyAmount,
  Price,
  Rounding,
  Token,
} from "@uniswap/sdk-core";
import { Pool } from "../../entities/pool";
import { PoolState, usePool } from "../../hooks/web3/usePools";
import { ReactNode, useCallback, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import { TickMath } from "../../utils/tickMath";
import JSBI from "jsbi";
import { BigNumberish } from "ethers";
import { encodeSqrtRatioX96 } from "../../utils/encodeSqrtRatioX96";
import { priceToClosestTick } from "../../utils/priceTickConversions";
import { nearestUsableTick } from "../../utils/nearestUsableTick";
import { tryConvertBigNumberishToNumber, tryParseTick } from "./utils";
import {
  Bound,
  Field,
  setFullRange,
  typeInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeStartPriceInput,
} from "./actions";
import { AppState } from "../reducer";
import { useAppDispatch, useAppSelector } from "../hooks";
import tryParseCurrencyAmount from "../../utils/tryParseCurrencyAmount";
import { tickToPrice } from "../../utils/priceTickConversions";
import { Position } from "../../entities/position";
import { useCurrencyBalances } from "hooks/web3/useCurrencyBalances";

export function useV4MintState(): AppState["mintV4"] {
  return useAppSelector((state) => state.mintV4);
}
export function useV4PoolActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void;
  onFieldBInput: (typedValue: string) => void;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  onStartPriceInput: (typedValue: string) => void;
} {
  const dispatch = useAppDispatch();

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_0,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      );
    },
    [dispatch, noLiquidity]
  );

  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_1,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      );
    },
    [dispatch, noLiquidity]
  );

  const onLeftRangeInput = useCallback(
    (typedValue: string) => {
      dispatch(typeLeftRangeInput({ typedValue }));
    },
    [dispatch]
  );

  const onRightRangeInput = useCallback(
    (typedValue: string) => {
      dispatch(typeRightRangeInput({ typedValue }));
    },
    [dispatch]
  );

  const onStartPriceInput = useCallback(
    (typedValue: string) => {
      dispatch(typeStartPriceInput({ typedValue }));
    },
    [dispatch]
  );

  return {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  };
}

export type PoolKey = {
  currency0: Currency;
  currency1: Currency;
  fee: BigNumberish;
  tickSpacing: BigNumberish;
  hooks: string;
};

export function useV4PoolInfo(
  poolKey?: PoolKey
  //existingPosition?: Position,
): {
  pool?: Pool | null;
  poolState: PoolState;
  ticks: { [bound in Bound]?: number | undefined };
  price?: Price<Token, Token>;
  pricesAtTicks: {
    [bound in Bound]?: Price<Token, Token> | undefined;
  };
  pricesAtLimit: {
    [bound in Bound]?: Price<Token, Token> | undefined;
  };
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
  dependentField: Field;
  parsedAmounts: { [field in Field]?: CurrencyAmount<Currency> };
  position?: Position;
  noLiquidity?: boolean;
  errorMessage?: ReactNode;
  invalidPool: boolean;
  outOfRange: boolean;
  invalidRange: boolean;
  depositADisabled: boolean;
  depositBDisabled: boolean;
  invertPrice: boolean;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
} {
  const { currency0, currency1, baseCurrency, fee, tickSpacing, hooks } =
    parsePoolKey(poolKey);

  const { account } = useWeb3React();

  const {
    independentField,
    typedValue,
    leftRangeTypedValue,
    rightRangeTypedValue,
    startPriceTypedValue,
  } = useV4MintState();

  const dependentField =
    independentField === Field.CURRENCY_0 ? Field.CURRENCY_1 : Field.CURRENCY_0;

  // currencies
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_0]: currency0,
      [Field.CURRENCY_1]: currency1,
    }),
    [currency0, currency1]
  );

  // formatted with tokens
  const [tokenA, tokenB, baseToken] = useMemo(
    () => [currency0?.wrapped, currency1?.wrapped, baseCurrency?.wrapped],
    [currency0, currency1, baseCurrency]
  );

  const [token0, token1] = useMemo(
    () =>
      tokenA && tokenB
        ? tokenA.sortsBefore(tokenB)
          ? [tokenA, tokenB]
          : [tokenB, tokenA]
        : [undefined, undefined],
    [tokenA, tokenB]
  );

  // balances
  //NOTE:
  //v3 uses peripery and multicall to get balances
  //which is not implemented yet, so we need some clarification on how to get balances
  //for now we just return 0
  const balances = useCurrencyBalances(
    account ?? undefined,
    useMemo(
      () => [currencies[Field.CURRENCY_0], currencies[Field.CURRENCY_1]],
      [currencies]
    )
  );

  const currencyBalances: { [field in Field]?: CurrencyAmount<Currency> } = {
    [Field.CURRENCY_0]: balances[0],
    [Field.CURRENCY_1]: balances[1],
  };

  // pool
  const [poolState, pool] = usePool(
    currencies[Field.CURRENCY_0],
    currencies[Field.CURRENCY_1],
    fee,
    tickSpacing,
    hooks
  );
  const noLiquidity = poolState === PoolState.NOT_EXISTS;

  // note to parse inputs in reverse
  const invertPrice = Boolean(baseToken && token0 && !baseToken.equals(token0));

  // always returns the price with 0 as base token
  const price: Price<Token, Token> | undefined = useMemo(() => {
    // if no liquidity use typed value
    if (noLiquidity) {
      const parsedQuoteAmount = tryParseCurrencyAmount(
        startPriceTypedValue,
        invertPrice ? token0 : token1
      );
      if (parsedQuoteAmount && token0 && token1) {
        const baseAmount = tryParseCurrencyAmount(
          "1",
          invertPrice ? token1 : token0
        );
        const price =
          baseAmount && parsedQuoteAmount
            ? new Price(
                baseAmount.currency,
                parsedQuoteAmount.currency,
                baseAmount.quotient,
                parsedQuoteAmount.quotient
              )
            : undefined;
        return (invertPrice ? price?.invert() : price) ?? undefined;
      }
      return undefined;
    } else {
      // get the amount of quote currency
      return pool && token0 ? pool.priceOf(token0) : undefined;
    }
  }, [noLiquidity, startPriceTypedValue, invertPrice, token1, token0, pool]);

  // check for invalid price input (converts to invalid ratio)
  const invalidPrice = useMemo(() => {
    const sqrtRatioX96 = price
      ? encodeSqrtRatioX96(price.numerator, price.denominator)
      : undefined;
    return (
      price &&
      sqrtRatioX96 &&
      !(
        JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO) &&
        JSBI.lessThan(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)
      )
    );
  }, [price]);

  // used for ratio calculation when pool not initialized
  const mockPool = useMemo(() => {
    if (tokenA && tokenB && fee && price && !invalidPrice && tickSpacing) {
      const currentTick = priceToClosestTick(price);
      const currentSqrt = TickMath.getSqrtRatioAtTick(currentTick);
      return new Pool(
        tokenA,
        tokenB,
        fee,
        currentSqrt,
        JSBI.BigInt(0),
        tickSpacing,
        currentTick,
        []
      );
    } else {
      return undefined;
    }
  }, [fee, invalidPrice, price, tokenA, tokenB]);

  // if pool exists use it, if not use the mock pool
  const poolForPosition: Pool | undefined = pool ?? mockPool;

  // lower and upper limits in the tick space for `feeAmoun<Trans>
  const tickSpaceLimits = useMemo(
    () => ({
      [Bound.LOWER]: fee
        ? nearestUsableTick(
            TickMath.MIN_TICK,
            tryConvertBigNumberishToNumber(tickSpacing) ?? 0
          )
        : undefined,
      [Bound.UPPER]: fee
        ? nearestUsableTick(
            TickMath.MAX_TICK,
            tryConvertBigNumberishToNumber(tickSpacing) ?? 0
          )
        : undefined,
    }),
    [fee]
  );

  // parse typed range values and determine closest ticks
  // lower should always be a smaller tick
  //TODO
  //Look into this while implementing the existing position
  const ticks = useMemo(() => {
    return {
      [Bound.LOWER]:
        // typeof existingPosition?.tickLower === "number"
        //   ? existingPosition.tickLower
        //   :
        (invertPrice && typeof rightRangeTypedValue === "boolean") ||
        (!invertPrice && typeof leftRangeTypedValue === "boolean")
          ? tickSpaceLimits[Bound.LOWER]
          : invertPrice
          ? tryParseTick(
              tickSpacing,
              token1,
              token0,
              fee,
              rightRangeTypedValue.toString()
            )
          : tryParseTick(
              tickSpacing,
              token0,
              token1,
              fee,
              leftRangeTypedValue.toString()
            ),
      [Bound.UPPER]:
        // typeof existingPosition?.tickUpper === "number"
        //   ? existingPosition.tickUpper
        //   :
        (!invertPrice && typeof rightRangeTypedValue === "boolean") ||
        (invertPrice && typeof leftRangeTypedValue === "boolean")
          ? tickSpaceLimits[Bound.UPPER]
          : invertPrice
          ? tryParseTick(
              tickSpacing,
              token1,
              token0,
              fee,
              leftRangeTypedValue.toString()
            )
          : tryParseTick(
              tickSpacing,
              token0,
              token1,
              fee,
              rightRangeTypedValue.toString()
            ),
    };
  }, [
    // existingPosition,
    fee,
    invertPrice,
    leftRangeTypedValue,
    rightRangeTypedValue,
    token0,
    token1,
    tickSpaceLimits,
  ]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks || {};

  // specifies whether the lower and upper ticks is at the exteme bounds
  const ticksAtLimit = useMemo(
    () => ({
      [Bound.LOWER]: fee ? tickLower === tickSpaceLimits.LOWER : false,
      [Bound.UPPER]: fee ? tickUpper === tickSpaceLimits.UPPER : false,
    }),
    [tickSpaceLimits, tickLower, tickUpper, fee]
  );

  // mark invalid range
  const invalidRange = Boolean(
    typeof tickLower === "number" &&
      typeof tickUpper === "number" &&
      tickLower >= tickUpper
  );

  const pricesAtLimit = useMemo(() => {
    return {
      [Bound.LOWER]:
        token0 && token1 && tickSpaceLimits.LOWER
          ? tickToPrice(token0, token1, tickSpaceLimits.LOWER)
          : undefined,
      [Bound.UPPER]:
        token0 && token1 && tickSpaceLimits.UPPER
          ? tickToPrice(token0, token1, tickSpaceLimits.UPPER)
          : undefined,
    };
  }, [token0, token1, tickSpaceLimits.LOWER, tickSpaceLimits.UPPER]);

  // always returns the price with 0 as base token
  const pricesAtTicks = useMemo(() => {
    return {
      [Bound.LOWER]:
        token0 && token1 && ticks[Bound.LOWER]
          ? tickToPrice(token0, token1, ticks[Bound.LOWER])
          : undefined,
      [Bound.UPPER]:
        token0 && token1 && ticks[Bound.UPPER]
          ? tickToPrice(token0, token1, ticks[Bound.UPPER])
          : undefined,
    };
  }, [token0, token1, ticks]);
  const { [Bound.LOWER]: lowerPrice, [Bound.UPPER]: upperPrice } =
    pricesAtTicks;

  // liquidity range warning
  const outOfRange = Boolean(
    !invalidRange &&
      price &&
      lowerPrice &&
      upperPrice &&
      (price.lessThan(lowerPrice) || price.greaterThan(upperPrice))
  );

  // amounts
  const independentAmount: CurrencyAmount<Currency> | undefined =
    tryParseCurrencyAmount(typedValue, currencies[independentField]);

  const dependentAmount: CurrencyAmount<Currency> | undefined = useMemo(() => {
    // we wrap the currencies just to get the price in terms of the other token
    const wrappedIndependentAmount = independentAmount?.wrapped;
    const dependentCurrency =
      dependentField === Field.CURRENCY_1 ? currency1 : currency0;
    if (
      independentAmount &&
      wrappedIndependentAmount &&
      typeof tickLower === "number" &&
      typeof tickUpper === "number" &&
      poolForPosition
    ) {
      // if price is out of range or invalid range - return 0 (single deposit will be independent)
      if (outOfRange || invalidRange) {
        return undefined;
      }

      const position: Position | undefined =
        wrappedIndependentAmount.currency.equals(poolForPosition.token0)
          ? Position.fromAmount0({
              pool: poolForPosition,
              tickLower,
              tickUpper,
              amount0: independentAmount.quotient,
              useFullPrecision: true, // we want full precision for the theoretical position
            })
          : Position.fromAmount1({
              pool: poolForPosition,
              tickLower,
              tickUpper,
              amount1: independentAmount.quotient,
            });

      const dependentTokenAmount = wrappedIndependentAmount.currency.equals(
        poolForPosition.token0
      )
        ? position.amount1
        : position.amount0;
      return (
        dependentCurrency &&
        CurrencyAmount.fromRawAmount(
          dependentCurrency,
          dependentTokenAmount.quotient
        )
      );
    }

    return undefined;
  }, [
    independentAmount,
    outOfRange,
    dependentField,
    currency1,
    currency0,
    tickLower,
    tickUpper,
    poolForPosition,
    invalidRange,
  ]);

  const parsedAmounts: {
    [field in Field]: CurrencyAmount<Currency> | undefined;
  } = useMemo(() => {
    return {
      [Field.CURRENCY_0]:
        independentField === Field.CURRENCY_0
          ? independentAmount
          : dependentAmount,
      [Field.CURRENCY_1]:
        independentField === Field.CURRENCY_0
          ? dependentAmount
          : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  // single deposit only if price is out of range
  const deposit0Disabled = Boolean(
    typeof tickUpper === "number" &&
      poolForPosition &&
      poolForPosition.tickCurrent >= tickUpper
  );
  const deposit1Disabled = Boolean(
    typeof tickLower === "number" &&
      poolForPosition &&
      poolForPosition.tickCurrent <= tickLower
  );

  // sorted for token order
  const depositADisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled &&
        poolForPosition &&
        tokenA &&
        poolForPosition.token0.equals(tokenA)) ||
        (deposit1Disabled &&
          poolForPosition &&
          tokenA &&
          poolForPosition.token1.equals(tokenA))
    );
  const depositBDisabled =
    invalidRange ||
    Boolean(
      (deposit0Disabled &&
        poolForPosition &&
        tokenB &&
        poolForPosition.token0.equals(tokenB)) ||
        (deposit1Disabled &&
          poolForPosition &&
          tokenB &&
          poolForPosition.token1.equals(tokenB))
    );

  // create position entity based on users selection
  const position: Position | undefined = useMemo(() => {
    if (
      !poolForPosition ||
      !tokenA ||
      !tokenB ||
      typeof tickLower !== "number" ||
      typeof tickUpper !== "number" ||
      invalidRange
    ) {
      return undefined;
    }

    // mark as 0 if disabled because out of range
    const amount0 = !deposit0Disabled
      ? parsedAmounts?.[
          tokenA.equals(poolForPosition.token0)
            ? Field.CURRENCY_0
            : Field.CURRENCY_1
        ]?.quotient
      : JSBI.BigInt(0);
    const amount1 = !deposit1Disabled
      ? parsedAmounts?.[
          tokenA.equals(poolForPosition.token0)
            ? Field.CURRENCY_1
            : Field.CURRENCY_0
        ]?.quotient
      : JSBI.BigInt(0);

    if (amount0 !== undefined && amount1 !== undefined) {
      return Position.fromAmounts({
        pool: poolForPosition,
        tickLower,
        tickUpper,
        amount0,
        amount1,
        useFullPrecision: true, // we want full precision for the theoretical position
      });
    } else {
      return undefined;
    }
  }, [
    parsedAmounts,
    poolForPosition,
    tokenA,
    tokenB,
    deposit0Disabled,
    deposit1Disabled,
    invalidRange,
    tickLower,
    tickUpper,
  ]);

  let errorMessage: ReactNode | undefined;
  if (!account) {
    errorMessage = "Connect wallet";
  }

  if (poolState === PoolState.INVALID) {
    errorMessage = errorMessage ?? "Invalid pair";
  }

  if (invalidPrice) {
    errorMessage = errorMessage ?? "Invalid price input";
  }

  if (
    (!parsedAmounts[Field.CURRENCY_0] && !depositADisabled) ||
    (!parsedAmounts[Field.CURRENCY_1] && !depositBDisabled)
  ) {
    errorMessage = errorMessage ?? "Enter an amount";
  }

  const {
    [Field.CURRENCY_0]: currency0Amount,
    [Field.CURRENCY_1]: currency1Amount,
  } = parsedAmounts;

  if (
    currency0Amount &&
    currencyBalances?.[Field.CURRENCY_0]?.lessThan(currency0Amount)
  ) {
    errorMessage = `Insufficient ${
      currencies[Field.CURRENCY_0]?.symbol
    } balance`;
  }

  if (
    currency1Amount &&
    currencyBalances?.[Field.CURRENCY_1]?.lessThan(currency1Amount)
  ) {
    errorMessage = `Insufficient ${
      currencies[Field.CURRENCY_1]?.symbol
    } balance`;
  }

  const invalidPool = poolState === PoolState.INVALID;

  return {
    dependentField,
    currencies,
    pool,
    poolState,
    currencyBalances,
    parsedAmounts,
    ticks,
    price,
    pricesAtTicks,
    pricesAtLimit,
    position,
    noLiquidity,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  };
}
//TODO
//look into baseCurrency and how it's determined
function parsePoolKey(poolKey?: PoolKey): {
  currency0?: Currency;
  currency1?: Currency;
  baseCurrency?: Currency;
  fee?: BigNumberish;
  tickSpacing?: BigNumberish;
  hooks?: string;
} {
  const { chainId } = useWeb3React();
  if (!chainId || !poolKey) {
    return {};
  }
  return {
    currency0: poolKey.currency0,
    currency1: poolKey.currency1,
    baseCurrency: poolKey.currency0,
    fee: poolKey.fee,
    tickSpacing: poolKey.tickSpacing,
    hooks: poolKey.hooks,
  };
}

export function useRangeHopCallbacks(
  baseCurrency: Currency | undefined,
  quoteCurrency: Currency | undefined,
  feeAmount: BigNumberish | undefined,
  tickSpacing: BigNumberish | undefined,
  tickLower: number | undefined,
  tickUpper: number | undefined,
  pool?: Pool | undefined | null
) {
  const dispatch = useAppDispatch();

  const baseToken = useMemo(() => baseCurrency?.wrapped, [baseCurrency]);
  const quoteToken = useMemo(() => quoteCurrency?.wrapped, [quoteCurrency]);

  const getDecrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower - parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent - parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getIncrementLower = useCallback(() => {
    if (baseToken && quoteToken && typeof tickLower === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickLower + parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickLower === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent + parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickLower, feeAmount, pool]);

  const getDecrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper - parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent - parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getIncrementUpper = useCallback(() => {
    if (baseToken && quoteToken && typeof tickUpper === "number" && feeAmount) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        tickUpper + parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    // use pool current tick as starting tick if we have pool but no tick input
    if (
      !(typeof tickUpper === "number") &&
      baseToken &&
      quoteToken &&
      feeAmount &&
      pool
    ) {
      const newPrice = tickToPrice(
        baseToken,
        quoteToken,
        pool.tickCurrent + parseFloat(tickSpacing?.toString() ?? "0")
      );
      return newPrice.toSignificant(5, undefined, Rounding.ROUND_UP);
    }
    return "";
  }, [baseToken, quoteToken, tickUpper, feeAmount, pool]);

  const getSetFullRange = useCallback(() => {
    dispatch(setFullRange());
  }, [dispatch]);

  return {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  };
}
