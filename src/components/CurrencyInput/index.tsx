import { BoxSecondary, ThemedText } from "../../theme/components";
import { Currency } from "@uniswap/sdk-core";
import { Input as NumericalInput } from "../NumericalInput";
import { styled } from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { supportedChainId } from "utils/supportedChainId";
import useCurrencyBalance from "hooks/web3/useCurrencyBalances";
const StyledNumericalInput = styled(NumericalInput)<{ $loading: boolean }>`
  background-color: transparent;
  text-align: left;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  width: 100%;
`;

//a small box that displays currency logo and symbol
//radius is 100%, 4px pad, 2px gap between logo and symbol
// row flex
//TODO get colors from theme
const CurrencyContainer = styled.div`
  border-radius: 1000px;
  padding: 4px;
  gap: 2px;
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => theme.components.chip.background};
  align-items: center;
  justify-content: center;
`;

const CurrencyLogo = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 100%;
  background-color: #ffffff;
`;

const InputContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CustomContainer = styled.div<{
  direction: "row" | "column";
  align: "flex-start" | "flex-end" | "center";
}>`
  display: flex;
  flex-direction: ${({ direction }) => direction};
  gap: 8px;
  align-items: ${({ align }) => align};
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
  locked: boolean;
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
  locked = false,
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
          disabled={!chainAllowed || locked}
          $loading={false}
        />
        {fiatValue && (
          <ThemedText.ParagraphExtraSmall textColor="text.tertiary">
            {fiatValue}
          </ThemedText.ParagraphExtraSmall>
        )}
      </InputContainer>
      <CustomContainer direction="column" align="flex-end">
        <CurrencyContainer>
          <CurrencyLogo />
          <ThemedText.ParagraphExtraSmall textColor="components.chip.foreground">
            {currency?.symbol}
          </ThemedText.ParagraphExtraSmall>
        </CurrencyContainer>
        <CustomContainer direction="row" align="flex-end">
          <ThemedText.ParagraphExtraSmall textColor="components.inputFieldCurrencyField.foreground">
            {selectedCurrencyBalance?.toSignificant(6)}
          </ThemedText.ParagraphExtraSmall>
          {showMaxButton && (
            <div
              onClick={onMax}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText.ParagraphExtraSmall textColor="text.color">
                Max
              </ThemedText.ParagraphExtraSmall>
            </div>
          )}
        </CustomContainer>
      </CustomContainer>
    </BoxSecondary>
  );
}
