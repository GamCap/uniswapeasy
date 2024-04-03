import styled from "styled-components";
import { Gap } from "theme/theme";

export const Column = styled.div<{
  $gap?: Gap;
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: ${({ $gap: gap, theme }) => gap && theme.grids[gap]};
`;
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`;

export const AutoColumn = styled.div<{
  $gap?: Gap;
  $justify?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "space-between";
  $grow?: true;
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ $gap: gap, theme }) => (gap && theme.grids[gap]) || gap};
  justify-items: ${({ $justify: justify }) => justify && justify};
  flex-grow: ${({ $grow: grow }) => grow && 1};
`;

export default Column;
