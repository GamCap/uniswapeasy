import { ReactNode, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { type BigNumberish } from "ethers";
import { BoxSecondary } from "../../theme/components";
import { AutoColumn } from "../Column";
import { Input as NumericalInput } from "../NumericalInput";

const InputRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const InputColumn = styled.div<{ justify: string }>`
  display: flex;
  flex-direction: column;
  justify-content: ${({ justify }) => justify};
`;

const InputTitle = styled.p<{ textAlign: string }>`
  color: ${({ theme }) => theme.textTertiary};
  font-size: 12px;
  font-weight: 500;
  margin: 0px;
  padding: 0px;
  text-align: ${({ textAlign }) => textAlign};
`;

const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  background-color: transparent;
  text-align: left;
  font-weight: 500;
  width: 100%;
`;

//gonna be a button that contains 12x12px icon 4px padding
//circular button
//border is theme.border with 1px solid
const SmallButton = styled.button`
  border-radius: 100%;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  cursor: pointer;
`;

interface StepCounterProps {
  value: string;
  onUserInput: (value: string) => void;
  decrement: () => string;
  increment: () => string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  feeAmount?: BigNumberish;
  label?: string;
  width?: string;
  locked?: boolean; // disable input
  title: ReactNode;
  tokenA?: string;
  tokenB?: string;
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
}: StepCounterProps) => {
  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState("");
  const [useLocalValue, setUseLocalValue] = useState(false);

  const handleOnFocus = () => {
    setUseLocalValue(true);
  };

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(localValue); // trigger update on parent value
  }, [localValue, onUserInput]);

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(decrement());
  }, [decrement, onUserInput]);

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(increment());
  }, [increment, onUserInput]);

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setLocalValue(value); // reset local value to match parent
    }
  }, [localValue, useLocalValue, value]);

  return (
    <BoxSecondary
      $radius="8px"
      $padding="12px"
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
    >
      <InputRow>
        <InputColumn justify="flex-start">
          <InputTitle textAlign="left">{title}</InputTitle>
          <StyledInput
            className="rate-input-0"
            value={localValue}
            fontSize="16px"
            disabled={locked}
            onUserInput={(val) => {
              setLocalValue(val);
            }}
          />
          <InputTitle textAlign="left">{`${tokenB} per ${tokenA}`}</InputTitle>
        </InputColumn>

        <AutoColumn gap="sm">
          {!locked && (
            <SmallButton
              data-testid="increment-price-range"
              onClick={handleIncrement}
              disabled={incrementDisabled}
            >
              {/* plus icon with size 12px */}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M11.5 5.5H6.5V0.5C6.5 0.224 6.276 0 6 0C5.724 0 5.5 0.224 5.5 0.5V5.5H0.5C0.224 5.5 0 5.724 0 6C0 6.276 0.224 6.5 0.5 6.5H5.5V11.5C5.5 11.776 5.724 12 6 12C6.276 12 6.5 11.776 6.5 11.5V6.5H11.5C11.776 6.5 12 6.276 12 6C12 5.724 11.776 5.5 11.5 5.5Z"
                  fill="#D1D5DB"
                />
              </svg>
            </SmallButton>
          )}
          {!locked && (
            <SmallButton
              data-testid="decrement-price-range"
              onClick={handleDecrement}
              disabled={decrementDisabled}
            >
              {/* minus icon with size 12x12px */}
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path
                  d="M11.5 5.5H0.5C0.224 5.5 0 5.724 0 6C0 6.276 0.224 6.5 0.5 6.5H11.5C11.776 6.5 12 6.276 12 6C12 5.724 11.776 5.5 11.5 5.5Z"
                  fill="#D1D5DB"
                />
              </svg>
            </SmallButton>
          )}
        </AutoColumn>
      </InputRow>
    </BoxSecondary>
  );
};

export default StepCounter;
