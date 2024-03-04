import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PoolKey,
  useRangeHopCallbacks,
  useV4MintState,
  useV4PoolActionHandlers,
  useV4PoolInfo,
} from "../../state/v4/hooks";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, Contract } from "ethers";
import usePoolManager from "../../hooks/web3/usePoolManager";
import usePoolModifyPosition from "../../hooks/web3/usePoolModifiyPosition";
import { Bound, Field } from "../../state/v4/actions";
import LiquidityChartRangeInput from "../LiquidityChartRangeInput";
import Column, { AutoColumn } from "components/Column";
import { Header } from "../Header";
import styled, { useTheme } from "styled-components";
import Row from "components/Row";
import { ButtonText } from "components/Button";
import { Box, BoxPrimary, BoxSecondary, ThemedText } from "theme/components";
import PoolKeySelect from "../PoolKeySelect";
import PriceRangeManual from "../PriceRangeManual";
import { IPoolManager, PoolKeyStruct } from "abis/types/PoolManager";
import { toHex } from "utils/toHex";
import CurrencyInput from "components/CurrencyInput";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { useTokenContract } from "hooks/web3/useContract";
import { parseUnits } from "ethers/lib/utils";

interface BodyWrapperProps {
  $maxWidth?: string;
}

const ContentColumn = styled(Column)`
  width: 100%;
  max-width: 692px;
`;

const SubHeader = styled(Box)`
  padding: 24px 32px 24px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

//TODO add border radius to theme
const Section = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.gap.lg};
  align-items: center;
  align-self: stretch;
  border: 1px solid ${({ theme }) => theme.borders.borders};
  border-radius: 24px;
`;

const BodyWrapper = styled.div<BodyWrapperProps>`
  position: relative;
  max-width: ${({ $maxWidth }) => $maxWidth ?? "420px"};
  width: 100%;
`;

const StyledBoddyWrapper = styled(BodyWrapper)<{
  $hasExistingPosition: boolean;
}>`
  padding: ${({ $hasExistingPosition }) =>
    $hasExistingPosition ? "10px" : "0"};
  max-width: 640px;
`;

const MediumOnly = styled.div`
  @media (max-width: 960px) {
    display: none;
  }
`;

export type LPWidgetProps = {
  poolKeys: PoolKey[];
};

export default function LPWidget({ poolKeys }: LPWidgetProps) {
  const { account, chainId, provider } = useWeb3React();
  //TODO: add a check for existing position
  const theme = useTheme();
  const [poolKey, setPoolKey] = useState<PoolKey | undefined>(poolKeys[0]);

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

  const { poolModifyPosition } = usePoolModifyPosition();

  const formattedPrice = useMemo(() => {
    return price
      ? (invertPrice ? price.invert() : price).toSignificant(6)
      : undefined;
  }, [price, invertPrice]);

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV4PoolActionHandlers(noLiquidity);

  const isValid = !errorMessage && !invalidRange;

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  //TODO: add handler for native currency (balance - min gas fee)
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_0,
    Field.CURRENCY_1,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: currencyBalances[field],
    };
  }, {});

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [
    Field.CURRENCY_0,
    Field.CURRENCY_1,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? "0"),
    };
  }, {});

  const { poolManager } = usePoolManager();

  //TODO: transaction approval callbacks
  const c0contract = useTokenContract(
    currencies?.CURRENCY_0?.isToken ? currencies.CURRENCY_0.address : undefined
  );
  const c1contract = useTokenContract(
    currencies?.CURRENCY_1?.isToken ? currencies.CURRENCY_1.address : undefined
  );

  //TODO
  //Look into native currency handling
  async function onAdd() {
    if (
      !chainId ||
      !provider ||
      !account ||
      !poolManager ||
      !poolModifyPosition
    ) {
      return;
    }
    if (
      !poolKey ||
      !currencies.CURRENCY_0 ||
      !currencies.CURRENCY_1 ||
      !c0contract ||
      !c1contract
    ) {
      return;
    }
    if (
      !position ||
      !account ||
      !parsedAmounts[Field.CURRENCY_0] ||
      !parsedAmounts[Field.CURRENCY_1]
    ) {
      return;
    }

    const approveAndSendTransaction = async (
      contract: Contract,
      spender: string,
      amount: CurrencyAmount<Currency>
    ) => {
      //TODO
      //decide on slippage
      // const slippage = 1;
      // const slippageAmount = amount.mul(100 + slippage).div(100);

      const data = contract.interface.encodeFunctionData("approve", [
        spender,
        toHex(amount.quotient),
      ]);

      const tx: {
        to: string;
        data: string;
        value: string;
        gasLimit: BigNumber;
      } = {
        to: contract.address,
        data: data,
        value: toHex(0),
        gasLimit: BigNumber.from(500000),
      };

      try {
        const response = await provider.getSigner().sendTransaction(tx);
        console.log(response);
      } catch (error) {
        console.error("Failed to send transaction", error);
        if (error?.code !== 4001) {
          console.error(error);
        }
      }
    };

    try {
      await Promise.all([
        approveAndSendTransaction(
          c0contract,
          poolModifyPosition.address,
          parsedAmounts[Field.CURRENCY_0]
        ),
        approveAndSendTransaction(
          c1contract,
          poolModifyPosition.address,
          parsedAmounts[Field.CURRENCY_1]
        ),
      ]);

      const data = poolModifyPosition.interface.encodeFunctionData(
        "modifyPosition",
        [
          {
            currency0: poolKey.currency0.isToken
              ? poolKey.currency0.address
              : "0x",
            currency1: poolKey.currency1.isToken
              ? poolKey.currency1.address
              : "0x",
            fee: poolKey.fee,
            tickSpacing: poolKey.tickSpacing,
            hooks: poolKey.hooks,
          } as PoolKeyStruct,
          {
            tickLower: BigNumber.from(position.tickLower),
            tickUpper: BigNumber.from(position.tickUpper),
            liquidityDelta: BigNumber.from(position.liquidity.toString()),
          } as IPoolManager.ModifyPositionParamsStruct,
          "0x",
        ]
      );

      const tx: {
        to: string;
        data: string;
        value: string;
        gasLimit: BigNumber;
      } = {
        to: poolModifyPosition.address,
        data: data,
        value: toHex(0),
        gasLimit: BigNumber.from(500000),
      };

      try {
        const response = await provider.getSigner().sendTransaction(tx);
        console.log(response);
      } catch (error) {
        console.error("Failed to send transaction", error);
        if (error?.code !== 4001) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error("Failed to approve and send transactions", error);
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

  //TODO: add existing position check
  const hasExistingPosition = false;

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

  useEffect(() => {
    console.log("pool", pool);
    console.log("position", position);
  }, [pool, position]);

  return (
    <>
      {!account ? (
        <div>Connect Wallet</div>
      ) : invalidPool ? (
        <div>Invalid Pool</div>
      ) : (
        <StyledBoddyWrapper $hasExistingPosition={hasExistingPosition}>
          <Column gap="xl">
            {/* Header */}
            <Header adding={true} creating={false}>
              {!hasExistingPosition && (
                <Row
                  justify="flex-end"
                  style={{ width: "fit-content", minWidth: "fit-content" }}
                >
                  <MediumOnly>
                    <ButtonText onClick={clearAll}>
                      <ThemedText.SmallActiveGreen>
                        Clear all
                      </ThemedText.SmallActiveGreen>
                    </ButtonText>
                  </MediumOnly>
                </Row>
              )}
            </Header>
            <ContentColumn gap="lg">
              {/* Pool Key Selection */}
              <Section>
                <AutoColumn gap="md" justify="start" grow>
                  {/* <SubHeader>
                  <ThemedText.SubHeader>Select Pool</ThemedText.SubHeader>
                </SubHeader> */}
                  <Box $padding="24px 32px 24px 32px">
                    <PoolKeySelect
                      poolKeys={poolKeys}
                      selectedPoolKey={poolKey}
                      onSelect={setPoolKey}
                    />
                  </Box>
                </AutoColumn>
              </Section>
              {/* Chart Range Input */}
              <Section>
                <AutoColumn gap="md" justify="start" grow>
                  <SubHeader>
                    <ThemedText.SubHeader>Price Range</ThemedText.SubHeader>
                  </SubHeader>
                  {/* <LiquidityChartRangeInput
                currencyA={currencies.CURRENCY_0}
                currencyB={currencies.CURRENCY_1}
                feeAmount={
                  pool?.fee
                    ? BigNumber.from(pool?.fee.toString() ?? "0")
                    : undefined
                }
                tickSpacing={
                  pool?.tickSpacing
                    ? BigNumber.from(pool?.tickSpacing.toString() ?? "0")
                    : undefined
                }
                price={
                  price
                    ? parseFloat(
                        (invertPrice ? price.invert() : price).toSignificant(6)
                      )
                    : undefined
                }
                priceLower={priceLower}
                priceUpper={priceUpper}
                ticksAtLimit={ticksAtLimit}
                onLeftRangeInput={onLeftRangeInput}
                onRightRangeInput={onRightRangeInput}
                interactive={true}
              /> */}
                  {/* Price Range Component (Manual) */}
                  <Box $padding="24px 32px 24px 32px">
                    <BoxSecondary $radius="8px" $padding="12px">
                      <Column
                        gap="md"
                        style={{
                          alignItems: "flex-start",
                        }}
                      >
                        <ThemedText.SubHeader>
                          Current Price
                        </ThemedText.SubHeader>
                        <ThemedText.SmallText>
                          {formattedPrice}
                        </ThemedText.SmallText>
                      </Column>
                    </BoxSecondary>
                  </Box>
                  <Box $padding="24px 32px 24px 32px">
                    <PriceRangeManual
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                      getDecrementLower={getDecrementLower}
                      getIncrementLower={getIncrementLower}
                      getDecrementUpper={getDecrementUpper}
                      getIncrementUpper={getIncrementUpper}
                      onLeftRangeInput={onLeftRangeInput}
                      onRightRangeInput={onRightRangeInput}
                      currencyA={currencies.CURRENCY_0}
                      currencyB={currencies.CURRENCY_1}
                      feeAmount={
                        pool?.fee
                          ? BigNumber.from(pool?.fee.toString() ?? "0")
                          : undefined
                      }
                      ticksAtLimit={ticksAtLimit}
                    />
                  </Box>
                </AutoColumn>
              </Section>
              {/* Deposit Amounts */}
              <Section>
                {/* border bottom and get color from theme */}
                <SubHeader>
                  <ThemedText.SubHeader>Deposit Amounts</ThemedText.SubHeader>
                </SubHeader>
                <Box $padding="24px 32px 24px 32px">
                  <Row gap="md">
                    <CurrencyInput
                      value={formattedAmounts[Field.CURRENCY_0]}
                      onUserInput={onFieldAInput}
                      onMax={() => {
                        onFieldAInput(
                          maxAmounts[Field.CURRENCY_0]?.toExact() ?? ""
                        );
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_0]}
                      currency={currencies[Field.CURRENCY_0] ?? null}
                      id="add-liquidity-input-token0"
                      showCommonBases
                      locked={depositADisabled}
                    />
                    <CurrencyInput
                      value={formattedAmounts[Field.CURRENCY_1]}
                      onUserInput={onFieldBInput}
                      onMax={() => {
                        onFieldBInput(
                          maxAmounts[Field.CURRENCY_1]?.toExact() ?? ""
                        );
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_1]}
                      currency={currencies[Field.CURRENCY_1] ?? null}
                      id="add-liquidity-input-token1"
                      showCommonBases
                      locked={depositBDisabled}
                    />
                  </Row>
                </Box>
              </Section>
              {/* Transaction Info */}
              {/* Buttons */}
              <Section>
                <button
                  onClick={onAdd}
                  disabled={
                    !isValid ||
                    !poolKey ||
                    !pool ||
                    !poolManager ||
                    !account ||
                    !provider ||
                    !chainId ||
                    !position
                  }
                  style={{
                    color: theme.primary,
                    border: `1px solid ${theme.border}`,
                    backgroundColor: theme.background,
                    borderRadius: "1000px",
                    padding: "12px",
                    fontSize: "16px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Add Liquidity
                </button>
              </Section>
            </ContentColumn>
          </Column>
        </StyledBoddyWrapper>
      )}
    </>
  );
}
