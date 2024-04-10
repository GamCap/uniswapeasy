import { ScaleLinear } from "d3";
import { useMemo } from "react";
import styled from "styled-components";

const StyledLine = styled.line`
  opacity: 0.5;
  strokewidth: 1;
  stroke-dasharray: 2;
  stroke: ${({ theme }) => theme.text.primary};
  fill: none;
`;

export const Line = ({
  value,
  yScale,
  innerWidth,
}: {
  value: number;
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
}) =>
  useMemo(
    () => (
      <StyledLine
        x1="0"
        y1={yScale(value)}
        x2={innerWidth}
        y2={yScale(value)}
      />
    ),
    [value, yScale, innerWidth]
  );
