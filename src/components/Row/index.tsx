import { Box } from "rebass/styled-components";
import styled from "styled-components";
import { Gap } from "theme/theme";

const Row = styled(Box)<{
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  gap?: Gap | string;
}>`
  width: ${({ width }) => width ?? "100%"};
  display: flex;
  padding: 0;
  align-items: ${({ align }) => align ?? "center"};
  justify-content: ${({ justify }) => justify ?? "flex-start"};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  gap: ${({ gap, theme }) => gap && (theme.grids[gap as Gap] || gap)};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export default Row;
