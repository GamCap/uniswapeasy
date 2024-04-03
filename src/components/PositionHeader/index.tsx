import { useWeb3React } from "@web3-react/core";
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
      <RowBetween $align="center">
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
      </RowBetween>
    </Tabs>
  );
}
