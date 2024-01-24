import { BoxSecondary } from "../../theme/components";
import { Currency } from "@uniswap/sdk-core";
import { Input as NumericalInput } from "../NumericalInput";
import { styled } from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { supportedChainId } from "utils/supportedChainId";
import useCurrencyBalance from "hooks/web3/useCurrencyBalances";
import { useEffect } from "react";
const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  background-color: transparent;
  text-align: left;
  font-weight: 500;
  width: 100%;
`;

//a small box that displays currency logo and symbol
//radius is 100%, 4px pad, 2px gap between logo and symbol
// row flex

const CurrencyContainer = styled.div`
  border-radius: 1000px;
  padding: 4px;
  gap: 2px;
  display: flex;
  flex-direction: row;
  background-color: #273345;
`;

const CurrencyLogo = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 100%;
  background-color: #ffffff;
`;

const CurrencyText = styled.p`
  margin: 0px;
  font-size: 12px;
  font-weight: 500;
  color: #d1d5db;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FiatValueContainer = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textTertiary};
`;

const CustomContainer = styled.div<{
  direction: "row" | "column";
  align: "flex-start" | "flex-end" | "center";
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: 4px;
  align-items: ${({ align }) => align};
`;

//max button is just a text button with a max label 12px font, 500 weight, no pad or margin, color is #3AC1D6

const MaxButton = styled.button`
  font-size: 12px;
  font-weight: 500;
  color: #3ac1d6;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0px;
  margin: 0px;
`;

interface CurrencyInputProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton?: boolean;
  currency?: Currency | null;
  id: string;
  fiatValue?: string;
  showCommonBases?: boolean;
  locked?: boolean;
}

export default function CurrencyInput({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  currency,
  id,
  fiatValue,
  showCommonBases,
  locked,
}: CurrencyInputProps) {
  const { account, chainId } = useWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );

  const chainAllowed = supportedChainId(chainId) !== undefined;

  return (
    <BoxSecondary
      id={id}
      $radius="8px"
      $padding="12px"
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <InputContainer>
        <StyledNumericalInput
          className="token-amount-input"
          value={value}
          onUserInput={onUserInput}
          disabled={!chainAllowed}
          $loading={false}
        />
        {fiatValue && <FiatValueContainer>{fiatValue}</FiatValueContainer>}
      </InputContainer>
      <CustomContainer direction="column" align="flex-end">
        <CurrencyContainer>
          <CurrencyLogo />
          <CurrencyText>{currency?.symbol}</CurrencyText>
        </CurrencyContainer>
        <CustomContainer direction="row" align="flex-end">
          <CurrencyText>
            {selectedCurrencyBalance?.toSignificant(6)}
          </CurrencyText>
          {showMaxButton && (
            <MaxButton type="button" onClick={onMax}>
              Max
            </MaxButton>
          )}
        </CustomContainer>
      </CustomContainer>
    </BoxSecondary>
  );
}
