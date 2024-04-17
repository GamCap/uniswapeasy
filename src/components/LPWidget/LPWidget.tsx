import { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  PoolKey,
  useRangeHopCallbacks,
  useV4PoolActionHandlers,
  useV4PoolInfo,
} from "../../state/v4/hooks";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { Bound, Field } from "../../state/v4/actions";
import LiquidityChartRangeInput from "../LiquidityChartRangeInput";
import Column from "components/Column";
import { PositionHeader } from "../PositionHeader";
import Header from "../Header";
import styled from "styled-components";
import Row, { RowBetween } from "components/Row";
import { BoxSecondary, ThemedText, Section } from "theme/components";
import PoolKeySelect from "../PoolKeySelect";
import PriceRangeManual from "../PriceRangeManual";
import { IPoolManager, PoolKeyStruct } from "abis/types/PoolManager";
import { toHex } from "utils/toHex";
import CurrencyInput from "components/CurrencyInput";
import { useTokenContract } from "hooks/web3/useContract";
import { defaultAbiCoder } from "ethers/lib/utils";
import { InputField } from "../DynamicFeatureForm/types";
import DynamicFeatureForm from "../DynamicFeatureForm";
import { useFormState } from "state/form/hooks";
import Modal from "components/Modal";
import TransactionModalContent from "components/TransactionModalContent";
import {
  mapInputFieldTypesToAbiTypes,
  mapValuesToEncodedFormat,
  sendModifyLiquidityTransaction,
  approveAndSendTransaction,
} from "./utils";
import {
  usePoolManagerContract,
  usePoolModifyLiquidityContract,
} from "hooks/web3/useContract";
import { isSupportedChainId } from "constants/chains";
import { Button } from "components/Button";
import { Web3Provider } from "@ethersproject/providers";

interface BodyWrapperProps {
  $maxWidth?: string;
}

const ContentColumn = styled(Column)`
  width: 100%;
`;

const BodyWrapper = styled.div<BodyWrapperProps>`
  position: relative;
  @media (min-width: 768px) {
    max-width: 692px;
  }
  width: 100%;
`;

const StyledBoddyWrapper = styled(BodyWrapper)<{
  $hasExistingPosition: boolean;
}>`
  padding: ${({ $hasExistingPosition }) =>
    $hasExistingPosition ? "10px" : "0"};
`;

const TransactionDialogueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
`;

const CloseButton = styled.button`
  background: none;
  padding: 8px;
  border: none;
  color: ${({ theme }) => theme.components.icon.icon};
  cursor: pointer;
`;

const StyledButton = styled.button`
  background: none;
  appearance: none;
  border: none;
  cursor: pointer;
  &:disabled {
    background-color: transparent;
    cursor: not-allowed;
    color: transparent;
    border-color: transparent;
    border: none;
  }
`;

// a container that contains 6 rows of text max, the rest is overflowed and can be seen by scrolling
const OverflowContainer = styled.div`
  max-height: 132px;
  overflow-y: auto;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 12px;
  white-space: normal;
  word-break: break-word;
  background-color: ${({ theme }) => theme.surfacesAndElevation.pageBackground};
  &::-webkit-scrollbar {
    width: 8px;
    padding-right: 12px;
    background: transparent;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.surfacesAndElevation.elevation3};
    border-radius: 50px;
    background-clip: padding-box;
  }
`;

const TransactionIconPath = styled.path<{ $status: TransactionStatus }>`
  fill: ${({ theme, $status }) => {
    switch ($status) {
      case "approve":
        return theme.text.primary;
      case "inProgress":
        return theme.components.graph.main;
      case "success":
        return theme.text.gain;
      case "failed":
        return theme.text.loss;
      default:
        return theme.text.primary;
    }
  }};
`;

const ErrorIconPath = styled.path`
  fill: ${({ theme }) => theme.components.icon.icon};
`;

const SwapToRatioIcon = styled.path<{ $swapToRatio: boolean }>`
  fill: ${({ theme, $swapToRatio }) =>
    $swapToRatio
      ? theme.components.toggle.activeDefaultBackground
      : theme.components.toggle.inactiveDefaultBackground};
`;

const SwapToRatioCircle = styled.circle`
  fill: ${({ theme }) => theme.components.toggle.activeDefaultForeground};
`;

const CurrencyInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export type PoolInfo = {
  chainId: number;
  poolKey: PoolKey;
};

export type HookInfo = {
  address: string;
  name: string;
  abbr: string;
  desc: string;
  inputFields: InputField[];
  overrideInputFields?: boolean;
};

export type LPWidgetProps = {
  poolInfos: PoolInfo[];
  hookInfos: HookInfo[];
  currencyIconMap: Record<string, string>;
  onPoolSelect?: (poolKey: PoolKey) => void;
  hookData?: string;
};

function LPWidgetWrapper(props: LPWidgetProps) {
  const { chainId, provider } = useWeb3React();
  useEffect(() => {
    if (!provider || !provider.provider) return;
    //making sure network is set to any to be able to listen to network changes
    const p = new Web3Provider(provider.provider, "any");

    p.on("network", (newNetwork, prevNetwork) => {
      if (newNetwork && prevNetwork && newNetwork !== prevNetwork)
        window?.location?.reload?.();
    });

    return () => {
      p.removeAllListeners();
    };
  }, [provider]);

  if (!provider || !chainId)
    return (
      <ThemedText.MediumHeader textColor="text.primary">
        Connect Wallet
      </ThemedText.MediumHeader>
    );
  if (!isSupportedChainId(chainId))
    return (
      <ThemedText.MediumHeader textColor="text.primary">
        Unsupported Chain
      </ThemedText.MediumHeader>
    );
  return <LPWidget {...props} />;
}

type TransactionStatus =
  | "idle"
  | "approve"
  | "inProgress"
  | "success"
  | "failed";

const LPWidget = memo(function ({
  poolInfos,
  hookInfos,
  currencyIconMap,
  onPoolSelect,
  hookData: hookDataProp,
}: LPWidgetProps) {
  const { account, chainId, provider } = useWeb3React();
  //TODO: add a check for existing position

  const [swapToRatio, setSwapToRatio] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>("idle");
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);
  const [txnAddress, setTxnAddress] = useState<string>("");

  const { poolKey, setPoolKey, poolKeys, hookAddressToAbbr, selectedHook } =
    usePoolAndHookManagement(poolInfos, hookInfos, chainId, onPoolSelect);

  const { values } = useFormState();

  const {
    pool,
    ticks,
    // dependentField,
    price,
    formattedPrice,
    formattedAmounts,
    maxAmounts,
    atMaxAmounts,
    pricesAtTicks,
    // pricesAtLimit,
    parsedAmounts,
    // currencyBalances,
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

  const poolModifyLiquidity = usePoolModifyLiquidityContract();

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    // onStartPriceInput,
  } = useV4PoolActionHandlers(noLiquidity);

  const isValid = !errorMessage && !invalidRange;

  const poolManager = usePoolManagerContract();

  //TODO: transaction approval callbacks
  const c0contract = useTokenContract(
    currencies?.CURRENCY_0?.isToken ? currencies.CURRENCY_0.address : undefined
  );
  const c1contract = useTokenContract(
    currencies?.CURRENCY_1?.isToken ? currencies.CURRENCY_1.address : undefined
  );

  function getNecessaryVariables() {
    if (
      !provider ||
      !poolModifyLiquidity ||
      !c0contract ||
      !c1contract ||
      !position ||
      !parsedAmounts?.[Field.CURRENCY_0] ||
      !parsedAmounts?.[Field.CURRENCY_1] ||
      !poolKey ||
      !poolKey.currency0 ||
      !poolKey.currency1
    ) {
      return null;
    }

    const poolKeyStruct: PoolKeyStruct = {
      currency0: poolKey.currency0.isToken ? poolKey.currency0.address : "0x",
      currency1: poolKey.currency1.isToken ? poolKey.currency1.address : "0x",
      fee: poolKey.fee,
      tickSpacing: poolKey.tickSpacing,
      hooks: poolKey.hooks,
    };

    const modifyLiquidityParams: IPoolManager.ModifyLiquidityParamsStruct = {
      tickLower: BigNumber.from(position.tickLower),
      tickUpper: BigNumber.from(position.tickUpper),
      liquidityDelta: BigNumber.from(position.liquidity.toString()),
    };

    return {
      provider,
      poolModifyLiquidity,
      c0contract,
      c1contract,
      poolKeyStruct,
      modifyLiquidityParams,
      parsedAmount0: parsedAmounts[Field.CURRENCY_0],
      parsedAmount1: parsedAmounts[Field.CURRENCY_1],
    };
  }

  const isValidValues = useMemo(() => {
    console.log("selectedHook", selectedHook);
    console.log("values", values);
    if (!selectedHook || selectedHook.overrideInputFields) return true;
    const checkValues = (values: any): boolean => {
      if (values === undefined || values === null) return false;
      if (typeof values === "object") {
        return Object.values(values).every((v) => checkValues(v));
      }
      if (values === "") return false;
      return true;
    };
    return checkValues(values);
  }, [selectedHook, values]);

  const getHookData = useCallback(() => {
    if (!selectedHook) return "0x";
    if (selectedHook.overrideInputFields) return hookDataProp ?? "0x";
    const types = mapInputFieldTypesToAbiTypes(selectedHook.inputFields);
    const vals = mapValuesToEncodedFormat(values, selectedHook.inputFields);
    return defaultAbiCoder.encode(types, vals);
  }, [selectedHook, values, defaultAbiCoder, hookDataProp]);

  //TODO
  //Look into native currency handling
  async function onAdd() {
    const necessaryVariables = getNecessaryVariables();

    if (!necessaryVariables) {
      console.error(
        "Cannot proceed: one or more necessary variables are missing."
      );
      return;
    }

    const {
      provider,
      poolModifyLiquidity,
      c0contract,
      c1contract,
      poolKeyStruct,
      modifyLiquidityParams,
      parsedAmount0,
      parsedAmount1,
    } = necessaryVariables;

    try {
      setTransactionStatus("approve");
      setTransactionError(null);
      setTxnAddress("");
      setTransactionModalOpen(true);

      const contractData0 = c0contract.interface.encodeFunctionData("approve", [
        poolModifyLiquidity.address,
        toHex(parsedAmount0.quotient.toString()),
      ]);
      const contractData1 = c1contract.interface.encodeFunctionData("approve", [
        poolModifyLiquidity.address,
        toHex(parsedAmount1.quotient.toString()),
      ]);

      const approval1 = approveAndSendTransaction(
        provider,
        c0contract.address,
        contractData0
      );
      const approval2 = approveAndSendTransaction(
        provider,
        c1contract.address,
        contractData1
      );

      const approvals = await Promise.all([approval1, approval2]);
      if (approvals.includes(undefined))
        throw new Error("Approval failed on wallet side");

      setTransactionStatus("inProgress");
      setTransactionModalOpen(true);
      const waitForApprovals = await Promise.all(
        approvals.map((a) => a?.wait())
      );
      if (waitForApprovals.includes(undefined))
        throw new Error("Approval failed on blockchain side");

      setTransactionStatus("approve");
      const hookData = getHookData();
      const modifyTxResult = await sendModifyLiquidityTransaction(
        poolModifyLiquidity,
        poolKeyStruct,
        modifyLiquidityParams,
        hookData,
        provider
      );

      if (!modifyTxResult.success || !modifyTxResult.transaction)
        throw new Error(
          modifyTxResult.errorMessage ||
            "Modify liquidity transaction failed on wallet side"
        );
      setTransactionStatus("inProgress");
      const waitModifyTx = await modifyTxResult.transaction.wait();
      if (!waitModifyTx)
        throw new Error(
          "Modify liquidity transaction failed on blockchain side"
        );

      setTransactionStatus("success");
      setTransactionModalOpen(true);
      setTxnAddress(waitModifyTx.transactionHash ?? "");
    } catch (error) {
      console.error("Transaction process failed", error);
      setTransactionStatus("failed");
      setTransactionModalOpen(true);
      setTransactionError(
        error instanceof Error ? error.message : JSON.stringify(error)
      );
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
    // getSetFullRange,
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

  const TransactionStateModalContent = useMemo(() => {
    switch (transactionStatus) {
      case "idle":
        return null;
      case "approve":
        return (
          <TransactionModalContent
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
              >
                <TransactionIconPath
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.5016 4.10107C10.8089 4.10107 4.60156 12.0407 4.60156 20.0011C4.60156 27.9615 10.8089 35.9011 20.5016 35.9011C25.174 35.9011 29.0242 34.0617 31.7661 31.2718C33.2405 29.7716 34.3959 27.9949 35.1845 26.0787C35.2896 25.8233 35.5818 25.7015 35.8372 25.8066C36.0925 25.9117 36.2144 26.2039 36.1093 26.4592C35.2729 28.4914 34.0469 30.3777 32.4793 31.9727C29.5569 34.9463 25.4528 36.9011 20.5016 36.9011C10.1862 36.9011 3.60156 28.4407 3.60156 20.0011C3.60156 11.5615 10.1862 3.10107 20.5016 3.10107C20.7777 3.10107 21.0016 3.32493 21.0016 3.60107C21.0016 3.87722 20.7777 4.10107 20.5016 4.10107Z"
                  $status={transactionStatus}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 20.5 20"
                    to="360 20.5 20"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </TransactionIconPath>
              </svg>
            }
            title={"Confirm in your wallet"}
            info={`Add ${
              parsedAmounts?.[Field.CURRENCY_0]?.toSignificant(6) ?? ""
            } ${currencies.CURRENCY_0?.symbol} and ${
              parsedAmounts?.[Field.CURRENCY_1]?.toSignificant(6) ?? ""
            } ${currencies.CURRENCY_1?.symbol}`}
            children={undefined}
            buttonText={"Close"}
            buttonAction={() => {
              setTransactionError(null);
              setTxnAddress("");
              setTransactionModalOpen(false);
            }}
          />
        );
      case "inProgress":
        return (
          <TransactionModalContent
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
              >
                <TransactionIconPath
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.5016 4.10107C10.8089 4.10107 4.60156 12.0407 4.60156 20.0011C4.60156 27.9615 10.8089 35.9011 20.5016 35.9011C25.174 35.9011 29.0242 34.0617 31.7661 31.2718C33.2405 29.7716 34.3959 27.9949 35.1845 26.0787C35.2896 25.8233 35.5818 25.7015 35.8372 25.8066C36.0925 25.9117 36.2144 26.2039 36.1093 26.4592C35.2729 28.4914 34.0469 30.3777 32.4793 31.9727C29.5569 34.9463 25.4528 36.9011 20.5016 36.9011C10.1862 36.9011 3.60156 28.4407 3.60156 20.0011C3.60156 11.5615 10.1862 3.10107 20.5016 3.10107C20.7777 3.10107 21.0016 3.32493 21.0016 3.60107C21.0016 3.87722 20.7777 4.10107 20.5016 4.10107Z"
                  $status={transactionStatus}
                >
                  <animateTransform
                    attributeName="transform"
                    attributeType="XML"
                    type="rotate"
                    from="0 20.5 20"
                    to="360 20.5 20"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </TransactionIconPath>
              </svg>
            }
            title={"Transaction pending"}
            info={"Please wait while the transaction is being processed"}
            children={
              <ThemedText.ParagraphExtraSmall textColor="text.primary">
                {txnAddress}
              </ThemedText.ParagraphExtraSmall>
            }
            buttonText={"Close"}
            buttonAction={() => {
              setTransactionError(null);
              setTxnAddress("");
              setTransactionModalOpen(false);
            }}
          />
        );
      case "success":
        return (
          <TransactionModalContent
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
              >
                <TransactionIconPath
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.4992 3.10522C11.1688 3.10522 3.60498 10.669 3.60498 19.9994C3.60498 29.3298 11.1688 36.8937 20.4992 36.8937C29.8295 36.8937 37.3934 29.3298 37.3934 19.9994C37.3934 10.669 29.8295 3.10522 20.4992 3.10522ZM4.60498 19.9994C4.60498 11.2213 11.7211 4.10522 20.4992 4.10522C29.2773 4.10522 36.3934 11.2213 36.3934 19.9994C36.3934 28.7775 29.2773 35.8937 20.4992 35.8937C11.7211 35.8937 4.60498 28.7775 4.60498 19.9994ZM26.9095 14.2874C27.0684 14.0615 27.0141 13.7496 26.7883 13.5907C26.5625 13.4318 26.2506 13.486 26.0917 13.7119L17.9925 25.2212L14.1907 21.3489C13.9972 21.1519 13.6806 21.149 13.4836 21.3425C13.2865 21.5359 13.2836 21.8525 13.4771 22.0495L17.6993 26.3499C17.8033 26.4558 17.9489 26.51 18.0968 26.4979C18.2447 26.4859 18.3796 26.4087 18.465 26.2874L26.9095 14.2874Z"
                  $status={transactionStatus}
                />
              </svg>
            }
            title={"Success"}
            info={`Add ${
              parsedAmounts?.[Field.CURRENCY_0]?.toSignificant(6) ?? ""
            } ${currencies.CURRENCY_0?.symbol} and ${
              parsedAmounts?.[Field.CURRENCY_1]?.toSignificant(6) ?? ""
            } ${currencies.CURRENCY_1?.symbol}`}
            //TODO: view in explorer
            children={undefined}
            //TODO: see my portfolio
            buttonText={"Close"}
            buttonAction={() => {
              setTransactionStatus("idle");
              setTransactionError(null);
              setTxnAddress("");
              setTransactionModalOpen(false);
            }}
          />
        );
      case "failed":
        return (
          <TransactionModalContent
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
              >
                <TransactionIconPath
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.4451 0.608857C21.0185 -0.106925 19.9819 -0.106923 19.5552 0.608858L0.744674 32.1702C0.30767 32.9035 0.836006 33.8334 1.68958 33.8334H39.3108C40.1644 33.8334 40.6927 32.9035 40.2557 32.1702L21.4451 0.608857ZM20.4143 1.12082C20.453 1.05575 20.5473 1.05575 20.5861 1.12082L39.3967 32.6822C39.4364 32.7489 39.3884 32.8334 39.3108 32.8334H1.68958C1.61198 32.8334 1.56395 32.7489 1.60368 32.6822L20.4143 1.12082ZM18.7052 11.9631C18.6661 10.9447 19.481 10.0978 20.5002 10.0978C21.5193 10.0978 22.3343 10.9447 22.2951 11.9631L21.8847 22.6322C21.8561 23.3761 21.2447 23.9645 20.5002 23.9645C19.7556 23.9645 19.1442 23.3761 19.1156 22.6322L18.7052 11.9631ZM22.4999 27.9361C22.4999 29.0407 21.6044 29.9361 20.4999 29.9361C19.3953 29.9361 18.4999 29.0407 18.4999 27.9361C18.4999 26.8315 19.3953 25.9361 20.4999 25.9361C21.6044 25.9361 22.4999 26.8315 22.4999 27.9361Z"
                  $status={transactionStatus}
                />
              </svg>
            }
            title={"Something went wrong"}
            info={"Look at the error details below"}
            children={
              <>
                <RowBetween
                  style={{
                    width: "100%",
                  }}
                >
                  <ThemedText.ParagraphRegular textColor="components.textButton.tertiary.default">
                    Error details
                  </ThemedText.ParagraphRegular>
                  <Row
                    style={{
                      width: "fit-content",
                      gap: "16px",
                    }}
                  >
                    {/* Copy error message to clipboard */}
                    <StyledButton
                      onClick={() => {
                        navigator?.clipboard?.writeText(transactionError ?? "");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 13 14"
                        fill="none"
                      >
                        <ErrorIconPath
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M0.0830081 9.16683C0.0830082 9.85719 0.642652 10.4168 1.33301 10.4168H2.99967V9.5835H1.33301C1.10289 9.5835 0.916342 9.39695 0.916341 9.16683L0.916341 1.8335C0.916341 1.60338 1.10289 1.41683 1.33301 1.41683L8.66634 1.41683C8.89646 1.41683 9.08301 1.60338 9.08301 1.8335V3.5H4.3335C3.59712 3.5 3.00016 4.09695 3.00016 4.83333V12.1667C3.00016 12.903 3.59712 13.5 4.3335 13.5H11.6668C12.4032 13.5 13.0002 12.903 13.0002 12.1667V4.83334C13.0002 4.09696 12.4032 3.5 11.6668 3.5H9.91634V1.8335C9.91634 1.14314 9.3567 0.583496 8.66634 0.583496L1.33301 0.583496C0.642652 0.583496 0.0830078 1.14314 0.0830078 1.8335L0.0830081 9.16683ZM4.00016 4.83333C4.00016 4.64924 4.1494 4.5 4.3335 4.5H11.6668C11.8509 4.5 12.0002 4.64924 12.0002 4.83334V12.1667C12.0002 12.3508 11.8509 12.5 11.6668 12.5H4.3335C4.1494 12.5 4.00016 12.3508 4.00016 12.1667V4.83333Z"
                        />
                      </svg>
                    </StyledButton>
                    <StyledButton
                      onClick={() => {
                        setErrorMessageOpen(!errorMessageOpen);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 16"
                        fill="none"
                        style={{
                          transform: errorMessageOpen
                            ? "rotate(180deg)"
                            : "none",
                        }}
                      >
                        <ErrorIconPath
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M3.13523 6.65803C3.3241 6.45657 3.64052 6.44637 3.84197 6.63523L7.5 10.0646L11.158 6.63523C11.3595 6.44637 11.6759 6.45657 11.8648 6.65803C12.0536 6.85949 12.0434 7.17591 11.842 7.36477L7.84197 11.1148C7.64964 11.2951 7.35036 11.2951 7.15803 11.1148L3.15803 7.36477C2.95657 7.17591 2.94637 6.85949 3.13523 6.65803Z"
                        />
                      </svg>
                    </StyledButton>
                  </Row>
                </RowBetween>
                {errorMessageOpen && (
                  <OverflowContainer>
                    <ThemedText.ParagraphExtraSmall textColor="text.primary">
                      {transactionError}
                    </ThemedText.ParagraphExtraSmall>
                  </OverflowContainer>
                )}
              </>
            }
            buttonText={"Close"}
            buttonAction={() => {
              setTransactionStatus("idle");
              setTransactionError(null);
              setTxnAddress("");
              setTransactionModalOpen(false);
            }}
          />
        );
    }
  }, [
    transactionStatus,
    transactionError,
    txnAddress,
    currencies,
    errorMessageOpen,
  ]);

  return (
    <>
      {!account ? (
        <ThemedText.MediumHeader textColor="text.primary">
          Connect Wallet
        </ThemedText.MediumHeader>
      ) : (
        <StyledBoddyWrapper $hasExistingPosition={hasExistingPosition}>
          {/* Transaction dialogue */}
          <Modal
            isOpen={transactionModalOpen}
            onClose={() => {
              setTransactionModalOpen(false);
            }}
            breakpoints={[
              {
                breakpoint: "768px",
                width: "445px",
              },
            ]}
            customHeader={
              <TransactionDialogueHeader>
                <div
                  style={{
                    backgroundColor: "#6B8AFF33",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M11.9817 4.29043L7.58715 11.516C7.41315 11.8019 7.50806 12.1725 7.79743 12.3421L12.192 14.9163C12.3818 15.0279 12.6182 15.0279 12.808 14.9163L17.2026 12.3421C17.4919 12.1725 17.5869 11.8019 17.4129 11.516L13.0192 4.29043C12.7838 3.90319 12.2171 3.90319 11.9817 4.29043Z"
                      fill="#6B8AFF"
                    />
                    <path
                      d="M16.2897 15.0102C16.2897 14.999 16.2878 14.9888 16.2869 14.9786C16.285 14.9684 16.2831 14.9582 16.2813 14.948C16.2785 14.9359 16.2748 14.9248 16.2711 14.9127C16.2683 14.9035 16.2655 14.8951 16.2608 14.8868C16.2552 14.8738 16.2478 14.8608 16.2404 14.8487C16.2366 14.8422 16.2329 14.8348 16.2283 14.8283C16.2153 14.8098 16.2013 14.7912 16.1846 14.7754C16.1678 14.7597 16.1502 14.7448 16.1316 14.7318C16.125 14.7272 16.1185 14.7244 16.1111 14.7198C16.099 14.7123 16.086 14.7049 16.073 14.6993C16.0646 14.6956 16.0553 14.6928 16.046 14.6891C16.0348 14.6854 16.0228 14.6817 16.0107 14.6789C16.0004 14.6761 15.9902 14.6743 15.98 14.6734C15.9697 14.6715 15.9595 14.6706 15.9484 14.6706C15.9363 14.6706 15.9251 14.6697 15.913 14.6706C15.9046 14.6706 15.8963 14.6724 15.887 14.6734C15.874 14.6752 15.8609 14.6761 15.8479 14.6789C15.8442 14.6789 15.8405 14.6817 15.8368 14.6826C15.7968 14.6928 15.7586 14.7086 15.7233 14.7318L12.8311 16.4363C12.6265 16.5569 12.3735 16.5569 12.1689 16.4363L9.27673 14.7318C9.24139 14.7086 9.20326 14.6928 9.16327 14.6826C9.15955 14.6817 9.15583 14.6799 9.15211 14.6789C9.13909 14.6761 9.12607 14.6752 9.11305 14.6734C9.10468 14.6724 9.09631 14.6715 9.08701 14.6706C9.07492 14.6706 9.06376 14.6706 9.05167 14.6706C9.04144 14.6706 9.03029 14.6724 9.02006 14.6734C9.00983 14.6752 8.9996 14.6771 8.98937 14.6789C8.97728 14.6817 8.96612 14.6854 8.95403 14.6891C8.94473 14.6919 8.93636 14.6956 8.92706 14.6993C8.91404 14.7049 8.90102 14.7123 8.88893 14.7198C8.88242 14.7235 8.87498 14.7272 8.86847 14.7318C8.84987 14.7448 8.83127 14.7587 8.81546 14.7754C8.79965 14.7921 8.78477 14.8098 8.77175 14.8283C8.7671 14.8348 8.76431 14.8413 8.75966 14.8487C8.75222 14.8617 8.74478 14.8738 8.7392 14.8868C8.73548 14.8951 8.73269 14.9044 8.72897 14.9127C8.72525 14.9248 8.72153 14.9359 8.71874 14.948C8.71595 14.9582 8.71409 14.9684 8.71316 14.9786C8.7113 14.9888 8.71037 15 8.71037 15.0102C8.71037 15.0213 8.70944 15.0334 8.71037 15.0445C8.71037 15.0538 8.71223 15.0621 8.71316 15.0714C8.71502 15.0844 8.71595 15.0974 8.71874 15.1095C8.71967 15.115 8.72153 15.1197 8.72339 15.1243C8.73455 15.167 8.75315 15.2069 8.78012 15.244L11.9681 19.7265C12.2275 20.0911 12.7706 20.0911 13.0301 19.7265L16.218 15.244C16.245 15.2069 16.2636 15.167 16.2748 15.1243C16.2757 15.1197 16.2785 15.1141 16.2794 15.1095C16.2822 15.0965 16.2831 15.0844 16.285 15.0714C16.2859 15.0621 16.2869 15.0538 16.2878 15.0445C16.2878 15.0334 16.2878 15.0213 16.2878 15.0102H16.2897Z"
                      fill="#6B8AFF"
                    />
                  </svg>
                </div>
                <CloseButton
                  onClick={() => {
                    setTransactionModalOpen(false);
                    if (
                      transactionStatus === "success" ||
                      transactionStatus === "failed"
                    ) {
                      setTransactionStatus("idle");
                      setTransactionError(null);
                      setTxnAddress("");
                    }
                  }}
                >
                  X
                </CloseButton>
              </TransactionDialogueHeader>
            }
          >
            {TransactionStateModalContent}
          </Modal>

          <Column $gap="xl">
            {/* Header */}
            <PositionHeader adding={true} creating={false}>
              {!hasExistingPosition && (
                <Row
                  $justify="flex-end"
                  style={{ width: "fit-content", minWidth: "fit-content" }}
                >
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
                </Row>
              )}
            </PositionHeader>
            <ContentColumn $gap="lg">
              {/* Pool Key Selection */}
              <Section>
                <PoolKeySelect
                  poolKeys={poolKeys}
                  hookAddressToAbbr={hookAddressToAbbr}
                  selectedPoolKey={poolKey}
                  currencyIconMap={currencyIconMap}
                  onSelect={setPoolKey}
                />
              </Section>
              {/* Chart Range Input */}
              <Section
                $padding="0 0 24px 0"
                $disabled={!poolKey || invalidPool}
              >
                <Header
                  title="Price Range"
                  info="Select the price bounds within which you'll earn fees."
                />
                <Column $gap="md" style={{ width: "100%" }}>
                  <LiquidityChartRangeInput
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
                    hooks={pool?.hooks}
                    price={
                      price
                        ? parseFloat(
                            (invertPrice
                              ? price.invert()
                              : price
                            ).toSignificant(6)
                          )
                        : undefined
                    }
                    formattedPrice={formattedPrice}
                    priceLower={priceLower}
                    priceUpper={priceUpper}
                    ticksAtLimit={ticksAtLimit}
                    onLeftRangeInput={onLeftRangeInput}
                    onRightRangeInput={onRightRangeInput}
                    interactive={true}
                  />

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
                        padding: "0 32px",
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
                        padding: "0 32px",
                        boxSizing: "border-box",
                        height: "fit-content",
                      }}
                    >
                      <BoxSecondary $radius="15px" $padding="8px 16px">
                        <ThemedText.SmallText textColor="text.loss">
                          Invalid range selected. The min price must be lower
                          than the max price.
                        </ThemedText.SmallText>
                      </BoxSecondary>
                    </div>
                  )}
                </Column>
              </Section>
              {/* Deposit Amounts */}
              <Section $padding="0 0 24px" $disabled={!poolKey || invalidPool}>
                <Header title="Deposit Amounts">
                  <Row $gap="sm">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "2px",
                        whiteSpace: "nowrap",
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
                    <StyledButton
                      onClick={() => setSwapToRatio(!swapToRatio)}
                      disabled={!poolKey || invalidPool}
                    >
                      <svg
                        id="toggleSVG"
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="24"
                        viewBox="0 0 40 24"
                      >
                        <SwapToRatioIcon
                          d="M0 12C0 5.37258 5.37258 0 12 0H28C34.6274 0 40 5.37258 40 12C40 18.6274 34.6274 24 28 24H12C5.37258 24 0 18.6274 0 12Z"
                          style={{
                            transition: "fill 0.3s ease",
                          }}
                          $swapToRatio={swapToRatio}
                        />
                        <SwapToRatioCircle
                          id="toggleCircle"
                          cx={swapToRatio ? "28" : "12"}
                          cy="12"
                          r="8"
                          style={{
                            transition: "cx 0.3s ease",
                          }}
                        />
                      </svg>
                    </StyledButton>
                  </Row>
                </Header>
                <Column
                  $gap="lgplus"
                  style={{
                    padding: "0 32px",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <CurrencyInputWrapper>
                    <CurrencyInput
                      value={formattedAmounts[Field.CURRENCY_0]}
                      onUserInput={onFieldAInput}
                      onMax={() => {
                        onFieldAInput(
                          maxAmounts[Field.CURRENCY_0]?.toExact() ?? ""
                        );
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_0]}
                      currency={currencies[Field.CURRENCY_0] ?? "C0"}
                      currencyIconMap={currencyIconMap}
                      id="add-liquidity-input-token0"
                      showCommonBases
                      locked={depositADisabled}
                      disabled={!poolKey || invalidPool}
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
                      currency={currencies[Field.CURRENCY_1] ?? "C1"}
                      currencyIconMap={currencyIconMap}
                      id="add-liquidity-input-token1"
                      showCommonBases
                      locked={depositBDisabled}
                      disabled={!poolKey || invalidPool}
                    />
                  </CurrencyInputWrapper>
                  {/*TODO: Swap to Ratio info text */}
                </Column>
              </Section>
              {/* Transaction Info */}

              {/* Pool Feature Settings */}
              {selectedHook && !selectedHook.overrideInputFields && (
                <Section
                  $padding="0 0 24px"
                  $disabled={!poolKey || invalidPool}
                >
                  <Header
                    title="Pool feature settings"
                    info="This form is generated dynamically based on the fields provided."
                  />
                  <DynamicFeatureForm
                    fields={selectedHook.inputFields}
                    disabled={!poolKey || invalidPool}
                  />
                </Section>
              )}
              {/*Placeholder Buttons */}
              <Section $disabled={!poolKey || invalidPool} $padding="20px 32px">
                <Button
                  type="primary"
                  onClick={onAdd}
                  disabled={
                    !isValid ||
                    !poolKey ||
                    !pool ||
                    !poolManager ||
                    !account ||
                    !provider ||
                    !chainId ||
                    !position ||
                    transactionStatus === "inProgress" ||
                    transactionStatus === "approve" ||
                    !isValidValues
                  }
                  buttonSize="medium"
                  label={
                    !isValid
                      ? errorMessage
                      : !isValidValues
                      ? "Invalid feature values"
                      : "Add liquidity"
                  }
                  width="100%"
                />
              </Section>
            </ContentColumn>
          </Column>
        </StyledBoddyWrapper>
      )}
    </>
  );
});

interface PoolAndHookManagement {
  poolKey: PoolKey | undefined;
  setPoolKey: (poolKey: PoolKey) => void;
  poolKeys: PoolKey[];
  hookAddressToAbbr: { [address: string]: string };
  selectedHook: HookInfo | undefined;
}

function usePoolAndHookManagement(
  poolInfos: PoolInfo[],
  hookInfos: HookInfo[],
  chainId: number | undefined,
  onPoolSelect?: (poolKey: PoolKey) => void
): PoolAndHookManagement {
  const [poolKey, setPoolKey] = useState<PoolKey | undefined>(undefined);

  const poolKeys: PoolKey[] = useMemo(() => {
    return poolInfos
      .filter((poolInfo) => poolInfo.chainId === chainId)
      .map((poolInfo) => poolInfo.poolKey);
  }, [poolInfos, chainId]);

  const hookAddressToAbbr: { [address: string]: string } = useMemo(() => {
    return hookInfos.reduce((accumulator, hookInfo) => {
      return {
        ...accumulator,
        [hookInfo.address]: hookInfo.abbr,
      };
    }, {});
  }, [hookInfos]);

  const selectedHook: HookInfo | undefined = useMemo(() => {
    return hookInfos.find((hookInfo) => hookInfo.address === poolKey?.hooks);
  }, [hookInfos, poolKey]);

  return {
    poolKey,
    setPoolKey: (poolKey: PoolKey) => {
      setPoolKey(poolKey);
      onPoolSelect?.(poolKey);
    },
    poolKeys,
    hookAddressToAbbr,
    selectedHook,
  };
}

export default memo(LPWidgetWrapper);
