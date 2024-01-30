import { styled } from "styled-components";
import { PoolKey } from "state/v4/hooks";
import Row from "components/Row";

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
`;

const PoolTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const PoolTitleText = styled.p`
  margin: 0px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const PoolFeeTierContainer = styled.div`
  padding: 4px 6px 4px 6px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.backgroundTertiary};
`;

const PoolFeeTierText = styled.p`
  margin: 0px;
  font-size: 12px;
  font-weight: 400;
  color: #f3f4f6;
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
        <CurrencyLogo />
        <CurrencyLogo
          style={{ transform: "translate(-6px, 0px)", zIndex: 1 }}
        />
      </LogoWrapper>
      <PoolTitle>
        <PoolTitleText>
          {`To ${selectedPoolKey?.currency0.symbol}/${selectedPoolKey?.currency1.symbol} Pool`}
        </PoolTitleText>
        <PoolFeeTierContainer>
          <PoolFeeTierText>{`${
            parseFloat(selectedPoolKey?.fee.toString() ?? "3000") / 10_000
          }% fee tier`}</PoolFeeTierText>
        </PoolFeeTierContainer>
      </PoolTitle>
    </Row>
  );
}
