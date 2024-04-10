import styled from "styled-components";
import { RowBetween } from "../Row";
import { Box } from "rebass";

const Tabs = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const TitleText = styled.div`
  color: ${({ theme }) => theme.text.primary};
  font-weight: 500;
  font-size: 30px;
  line-height: 36px;
  flex: 1;
  margin: auto;
`;

const TitleRow = styled(RowBetween)`
  padding: 0 24px;
  @media (min-width: 768px) {
    padding: 0;
  }
`;

export function PositionHeader({
  adding,
  creating,
  children,
}: {
  adding: boolean;
  creating: boolean;
  children: React.ReactNode;
}) {
  return (
    <Tabs>
      <TitleRow>
        <TitleText
          style={{
            textAlign: "left",
          }}
        >
          {creating
            ? "Create a new pool"
            : adding
            ? "Add liquidity"
            : "Remove liquidity"}
        </TitleText>
        {children && <Box>{children}</Box>}
      </TitleRow>
    </Tabs>
  );
}
