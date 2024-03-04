import { useWeb3React } from "@web3-react/core";
import styled from "styled-components";
import { RowBetween } from "../Row";
import { Box } from "rebass";

const Tabs = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 24px 32px 24px 32px;
  justify-content: space-between;
  border-bottom: 1px solid #181b24;
`;

const TitleText = styled.div`
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
  font-size: 20px;
  flex: 1;
  margin: auto;
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
  const { chainId } = useWeb3React();

  return (
    <Tabs>
      <RowBetween align="center">
        <TitleText
          style={{
            textAlign: "center",
          }}
        >
          {creating
            ? "Create a new pool"
            : adding
            ? "Add liquidity"
            : "Remove liquidity"}
        </TitleText>
        {children && <Box style={{ marginRight: ".5rem" }}>{children}</Box>}
      </RowBetween>
    </Tabs>
  );
}
