import { styled, useTheme } from "styled-components";
import { PoolKey } from "state/v4/hooks";
import Row, { RowBetween } from "components/Row";
import { ThemedText } from "theme/components";

const CurrencyLogo = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ffffff;
  border: 2.4px solid ${({ theme }) => theme.text.primary};
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PoolTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Badge = styled.div`
  padding: 4px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background-color: ${({ theme }) => theme.components.badge.neutralBackground};
`;

const ChangeButton = styled.button`
  display: flex;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 1000px;
  border: ${({ theme }) =>
    `1px solid ${theme.components.button.secondary.border}`};
  background: ${({ theme }) => theme.components.button.secondary.background};
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export default function PoolKeySelect({
  poolKeys,
  selectedPoolKey,
  onSelect,
}: {
  poolKeys?: PoolKey[];
  selectedPoolKey?: PoolKey;
  onSelect?: (poolKey: PoolKey) => void;
}) {
  const theme = useTheme();
  return (
    <RowBetween padding="20px 32px">
      <Row gap="md">
        <LogoWrapper>
          {/* 
        TODO: Replace with actual currency logos
         */}
          <CurrencyLogo />
          <CurrencyLogo
            style={{
              transform: "translateX(-6px)",
            }}
          />
        </LogoWrapper>
        <PoolTitle>
          <ThemedText.ParagraphRegular textColor="text.primary">
            {`To ${selectedPoolKey?.currency0.symbol}/${selectedPoolKey?.currency1.symbol} Pool`}
          </ThemedText.ParagraphRegular>
          <BadgeWrapper>
            <Badge>
              <ThemedText.ParagraphExtraSmall textColor="components.badge.neutralForeground">{`${
                parseFloat(selectedPoolKey?.fee.toString() ?? "3000") / 10_000
              }% fee tier`}</ThemedText.ParagraphExtraSmall>
            </Badge>
            {/* Other Badges */}
          </BadgeWrapper>
        </PoolTitle>
      </Row>
      {/* Change Button */}
      <ChangeButton>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M11.2001 2.1333L13.8667 4.79997M13.8667 4.79997L11.2001 7.46663M13.8667 4.79997H2.1333"
            stroke={theme.components.icon.icon}
            stroke-width="0.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M2.1333 11.2001L4.79997 8.53345M2.1333 11.2001L4.79997 13.8668M2.1333 11.2001H13.8666"
            stroke={theme.components.icon.icon}
            stroke-width="0.9"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <ThemedText.ParagraphExtraSmall textColor="components.button.secondary.foreground">
          Change
        </ThemedText.ParagraphExtraSmall>
      </ChangeButton>
    </RowBetween>
  );
}
