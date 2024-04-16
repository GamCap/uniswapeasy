import { Currency, Price, Token } from "@uniswap/sdk-core";
import { Bound } from "state/v4/actions";
import StepCounter from "../StepCounter";
import { BigNumberish } from "ethers";
import { styled } from "styled-components";
// currencyA is the base token

const StepCounterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 0 32px;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export default function RangeSelector({
  priceLower,
  priceUpper,
  onLeftRangeInput,
  onRightRangeInput,
  getDecrementLower,
  getIncrementLower,
  getDecrementUpper,
  getIncrementUpper,
  currencyA,
  currencyB,
  feeAmount,
  ticksAtLimit,
  disabled = false,
}: {
  priceLower?: Price<Token, Token>;
  priceUpper?: Price<Token, Token>;
  getDecrementLower: () => string;
  getIncrementLower: () => string;
  getDecrementUpper: () => string;
  getIncrementUpper: () => string;
  onLeftRangeInput: (typedValue: string) => void;
  onRightRangeInput: (typedValue: string) => void;
  currencyA?: Currency | null;
  currencyB?: Currency | null;
  feeAmount?: BigNumberish;
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };
  disabled?: boolean;
}) {
  const tokenA = (currencyA ?? undefined)?.wrapped;
  const tokenB = (currencyB ?? undefined)?.wrapped;
  const isSorted = tokenA && tokenB && tokenA.sortsBefore(tokenB);

  const leftPrice = isSorted ? priceLower : priceUpper?.invert();
  const rightPrice = isSorted ? priceUpper : priceLower?.invert();

  return (
    <StepCounterWrapper>
      <StepCounter
        value={
          ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
            ? "0"
            : leftPrice?.toSignificant(8) ?? ""
        }
        onUserInput={onLeftRangeInput}
        decrement={isSorted ? getDecrementLower : getIncrementUpper}
        increment={isSorted ? getIncrementLower : getDecrementUpper}
        decrementDisabled={
          leftPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
        }
        incrementDisabled={
          leftPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER]
        }
        feeAmount={feeAmount}
        label={leftPrice ? `${currencyB?.symbol}` : "-"}
        title={`Low price`}
        tokenA={currencyA?.symbol ?? "Currency0"}
        tokenB={currencyB?.symbol ?? "Currency1"}
        locked={disabled}
      />
      <StepCounter
        value={
          ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
            ? "∞"
            : rightPrice?.toSignificant(8) ?? ""
        }
        onUserInput={onRightRangeInput}
        decrement={isSorted ? getDecrementUpper : getIncrementLower}
        increment={isSorted ? getIncrementUpper : getDecrementLower}
        incrementDisabled={
          rightPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
        }
        decrementDisabled={
          rightPrice === undefined ||
          ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER]
        }
        feeAmount={feeAmount}
        label={rightPrice ? `${currencyB?.symbol}` : "-"}
        tokenA={currencyA?.symbol ?? "Currency0"}
        tokenB={currencyB?.symbol ?? "Currency1"}
        title={`High price`}
        locked={disabled}
      />
    </StepCounterWrapper>
  );
}
