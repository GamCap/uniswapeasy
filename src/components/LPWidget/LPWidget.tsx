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
import usePoolModifyLiquidity from "../../hooks/web3/usePoolModifiyPosition";
import { Bound, Field } from "../../state/v4/actions";
import LiquidityChartRangeInput from "../LiquidityChartRangeInput";
import Column from "components/Column";
import { PositionHeader } from "../PositionHeader";
import Header from "../Header";
import styled, { useTheme } from "styled-components";
import Row from "components/Row";
import { BoxSecondary, ThemedText, Section } from "theme/components";
import PoolKeySelect from "../PoolKeySelect";
import PriceRangeManual from "../PriceRangeManual";
import { IPoolManager, PoolKeyStruct } from "abis/types/PoolManager";
import { toHex } from "utils/toHex";
import CurrencyInput from "components/CurrencyInput";
import { Currency, CurrencyAmount } from "@uniswap/sdk-core";
import { useTokenContract } from "hooks/web3/useContract";
import { defaultAbiCoder, parseUnits } from "ethers/lib/utils";
import { InputField } from "../DynamicFeatureForm/types";
import DynamicFeatureForm from "../DynamicFeatureForm";
import { useFormState } from "state/form/hooks";
import { isTuple } from "components/DynamicFeatureForm/utils";

interface BodyWrapperProps {
  $maxWidth?: string;
}

const ContentColumn = styled(Column)`
  width: 100%;
  max-width: 692px;
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

type PoolInfo = {
  chainId: number;
  poolKey: PoolKey;
};

type HookInfo = {
  address: string;
  name: string;
  abbr: string;
  desc: string;
  inputFields: InputField[];
};

export type LPWidgetProps = {
  poolInfos: PoolInfo[];
  hookInfos: HookInfo[];
};

export default function LPWidgetWrapper(props: LPWidgetProps) {
  const { chainId } = useWeb3React();
  if (!chainId || chainId !== 11155111)
    return (
      <ThemedText.MediumHeader textColor="text.primary">
        Unsupported Chain
      </ThemedText.MediumHeader>
    );
  return <LPWidget {...props} />;
}

function LPWidget({ poolInfos, hookInfos }: LPWidgetProps) {
  const { account, chainId, provider } = useWeb3React();
  //TODO: add a check for existing position
  const theme = useTheme();

  const [poolKey, setPoolKey] = useState<PoolKey | undefined>(undefined);
  const [swapToRatio, setSwapToRatio] = useState(false);

  const poolKeys = useMemo(() => {
    return poolInfos
      .filter((poolInfo) => poolInfo.chainId === chainId)
      .map((poolInfo) => poolInfo.poolKey);
  }, [poolInfos, chainId]);

  const hookAddressToAbbr = useMemo(() => {
    return hookInfos.reduce((accumulator, hookInfo) => {
      return {
        ...accumulator,
        [hookInfo.address]: hookInfo.abbr,
      };
    }, {});
  }, [hookInfos]);

  useEffect(() => {
    if (poolKeys.length > 0) {
      setPoolKey(poolKeys[0]);
    }
  }, [poolKeys]);

  const selectedHook = useMemo(() => {
    return hookInfos.find((hookInfo) => hookInfo.address === poolKey?.hooks);
  }, [hookInfos, poolKey]);

  const { values } = useFormState();

  useEffect(() => {
    console.log("values", values);
  }, [values]);

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

  const { poolModifyLiquidity } = usePoolModifyLiquidity();

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
      !poolModifyLiquidity
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
        console.log("transaction response", response);
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
          poolModifyLiquidity.address,
          parsedAmounts[Field.CURRENCY_0]
        ),
        approveAndSendTransaction(
          c1contract,
          poolModifyLiquidity.address,
          parsedAmounts[Field.CURRENCY_1]
        ),
      ]);

      const mapValuesToEncodedFormat = (
        stateValues: Record<string, any>,
        fields: InputField[]
      ): any[] => {
        const encodedValues: any[] = [];

        fields.forEach((field) => {
          if (isTuple(field)) {
            // This field is a tuple, recursively map its nested fields
            const nestedStateValues = stateValues[field.name];
            const nestedEncodedValues = mapValuesToEncodedFormat(
              nestedStateValues,
              field.fields
            );
            encodedValues.push(nestedEncodedValues);
          } else {
            // This field is a simple input field
            encodedValues.push(stateValues[field.name]);
          }
        });

        return encodedValues;
      };

      //
      const mapInputFieldTypesToAbiTypes = (fields: InputField[]) => {
        const abiTypes: any[] = [];

        fields.forEach((field) => {
          if (isTuple(field)) {
            // This field is a tuple, recursively map its nested fields
            const nestedAbiTypes = mapInputFieldTypesToAbiTypes(field.fields);
            abiTypes.push(nestedAbiTypes);
          } else {
            // This field is a simple input field
            abiTypes.push(field.type);
          }
        });

        return abiTypes;
      };

      //get data from values for each hook field. go to nested values for nested fields
      const types = selectedHook
        ? mapInputFieldTypesToAbiTypes(selectedHook.inputFields)
        : [];
      const vals = selectedHook
        ? mapValuesToEncodedFormat(values, selectedHook.inputFields)
        : [];
      const hookData = selectedHook
        ? defaultAbiCoder.encode(types, vals)
        : "0x";

      console.log("types", types);
      console.log("vals", vals);
      console.log("hookData", hookData);
      const data = poolModifyLiquidity.interface.encodeFunctionData(
        "modifyLiquidity((address,address,uint24,int24,address),(int24,int24,int256),bytes)",
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
          } as IPoolManager.ModifyLiquidityParamsStruct,
          hookData,
        ]
      );

      const tx: {
        to: string;
        data: string;
        value: string;
        gasLimit: BigNumber;
      } = {
        to: poolModifyLiquidity.address,
        data: data,
        value: toHex(0),
        gasLimit: BigNumber.from(500000),
      };

      try {
        const response = await provider.getSigner().sendTransaction(tx);
        console.log("modify position response", response);
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

  //TODO: add existing position check
  const hasExistingPosition = false;

  useEffect(() => {
    console.log("pool", pool);
    console.log("position", position);
  }, [pool, position]);

  return (
    <>
      {!account ? (
        <ThemedText.MediumHeader textColor="text.primary">
          Connect Wallet
        </ThemedText.MediumHeader>
      ) : invalidPool ? (
        <ThemedText.MediumHeader textColor="text.primary">
          Invalid Pool
        </ThemedText.MediumHeader>
      ) : (
        <StyledBoddyWrapper $hasExistingPosition={hasExistingPosition}>
          <Column gap="xl">
            {/* Header */}
            <PositionHeader adding={true} creating={false}>
              {!hasExistingPosition && (
                <Row
                  justify="flex-end"
                  style={{ width: "fit-content", minWidth: "fit-content" }}
                >
                  <MediumOnly>
                    <div
                      onClick={clearAll}
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ThemedText.SmallActiveGreen textColor="components.textButton.primary.default">
                        Clear all
                      </ThemedText.SmallActiveGreen>
                    </div>
                  </MediumOnly>
                </Row>
              )}
            </PositionHeader>
            <ContentColumn gap="lg">
              {/* Pool Key Selection */}
              <Section>
                <PoolKeySelect
                  poolKeys={poolKeys}
                  hookAddressToAbbr={hookAddressToAbbr}
                  selectedPoolKey={poolKey}
                  onSelect={setPoolKey}
                />
              </Section>
              {/* Chart Range Input */}
              <Section $padding="0 0 24px 0">
                <Header
                  title="Price Range"
                  info="Placeholder Price Range Info"
                />
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
                {/*Placeholder Current Price */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    padding: "0 24px",
                    boxSizing: "border-box",
                    height: "fit-content",
                  }}
                >
                  <BoxSecondary $radius="8px" $padding="12px">
                    <Column
                      gap="md"
                      style={{
                        alignItems: "flex-start",
                        width: "fit-content",
                      }}
                    >
                      <ThemedText.SubHeader textColor="text.tertiary">
                        Current Price
                      </ThemedText.SubHeader>
                      <ThemedText.SmallText textColor="text.primary">
                        {formattedPrice}
                      </ThemedText.SmallText>
                    </Column>
                  </BoxSecondary>
                </div>
                {/* Price Range Component (Manual) */}
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
                  disabled={!poolKey || invalidPool}
                />
                {outOfRange && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "0 24px",
                      boxSizing: "border-box",
                      height: "fit-content",
                    }}
                  >
                    <BoxSecondary $radius="15px" $padding="8px 16px">
                      <ThemedText.SmallText textColor="text.loss">
                        Your position will not earn fees or be used in trades
                        until the market price moves into your range.
                      </ThemedText.SmallText>
                    </BoxSecondary>
                  </div>
                )}

                {invalidRange && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      padding: "0 24px",
                      boxSizing: "border-box",
                      height: "fit-content",
                    }}
                  >
                    <BoxSecondary $radius="15px" $padding="8px 16px">
                      <ThemedText.SmallText textColor="text.loss">
                        Invalid range selected. The min price must be lower than
                        the max price.
                      </ThemedText.SmallText>
                    </BoxSecondary>
                  </div>
                )}
              </Section>
              {/* Deposit Amounts */}
              <Section $padding="0 0 24px">
                <Header title="Deposit Amounts">
                  <Row gap="sm">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <ThemedText.ParagraphExtraSmall textColor="text.primary">
                        Swap to Ratio
                      </ThemedText.ParagraphExtraSmall>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="78"
                        height="2"
                        viewBox="0 0 78 2"
                        fill="none"
                      >
                        <path
                          d="M1 1H77"
                          stroke="#4B5563"
                          strokeLinecap="square"
                          strokeDasharray="2 3"
                        />
                      </svg>
                    </div>
                    <svg
                      id="toggleSVG"
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="24"
                      viewBox="0 0 40 24"
                      onClick={() => setSwapToRatio(!swapToRatio)}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <path
                        d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12C40 18.6274 34.6274 24 28 24H12C5.37258 24 0 18.6274 0 12Z"
                        fill={
                          swapToRatio
                            ? theme.components.toggle.activeDefaultBackground
                            : theme.components.toggle.inactiveDefaultBackground
                        }
                        style={{
                          transition: "fill 0.3s ease",
                        }}
                      />
                      <circle
                        id="toggleCircle"
                        cx={swapToRatio ? "28" : "12"}
                        cy="12"
                        r="8"
                        fill={theme.components.toggle.activeDefaultForeground}
                        style={{
                          transition: "cx 0.3s ease",
                        }}
                      />
                    </svg>
                  </Row>
                </Header>
                <Column
                  gap="lgplus"
                  style={{
                    padding: "0 24px",
                  }}
                >
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
                  {/*TODO: Swap to Ratio info text */}
                </Column>
              </Section>
              {/* Transaction Info */}

              {/* Pool Feature Settings */}
              {selectedHook && (
                <Section $padding="0 0 24px">
                  <Header
                    title="Pool feature settings"
                    info="This form is generated dynamically based on the fields provided."
                  />
                  <DynamicFeatureForm fields={selectedHook.inputFields} />
                </Section>
              )}
              {/*Placeholder Buttons */}
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
                    color: theme.text.secondary,
                    border: `1px solid ${theme.borders.borders}`,
                    backgroundColor: "transparent",
                    width: "100%",
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
