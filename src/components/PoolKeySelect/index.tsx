import { styled } from "styled-components";
import { PoolKey } from "state/v4/hooks";
import Row from "components/Row";
import { ThemedText } from "theme/components";

const CurrencyLogo = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: #ffffff;
  border: 2.4px solid ${({ theme }) => theme.background};
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: -3px;
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
  background-color: ${({ theme }) => theme.components.badge.neutral.background};
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
  return (
    <Row gap="md">
      <LogoWrapper>
        {/* 
        TODO: Replace with actual currency logos
         */}
        <CurrencyLogo />
        <CurrencyLogo />
      </LogoWrapper>
      <PoolTitle>
        <ThemedText.ParagraphRegular textColor="text.primary">
          {`To ${selectedPoolKey?.currency0.symbol}/${selectedPoolKey?.currency1.symbol} Pool`}
        </ThemedText.ParagraphRegular>
        <Badge>
          <ThemedText.ParagraphExtraSmall textColor="components.badge.neutral.foreground">{`${
            parseFloat(selectedPoolKey?.fee.toString() ?? "3000") / 10_000
          }% fee tier`}</ThemedText.ParagraphExtraSmall>
        </Badge>
      </PoolTitle>
    </Row>
  );
}
