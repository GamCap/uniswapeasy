// TimePriceLine.tsx
import { useMemo } from "react";
import { line, ScaleTime, ScaleLinear, curveMonotoneX } from "d3";
import styled from "styled-components";
import { Chart2Entry } from "./types";

const Path = styled.path<{ stroke?: string }>`
  fill: none;
  stroke: ${({ stroke, theme }) => stroke ?? theme.primary};
  stroke-width: 2;
  opacity: 0.8;
`;

export const TimePriceLine = ({
  series,
  xScale,
  yScale,
  stroke,
}: {
  series: Chart2Entry[];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  stroke?: string;
}) =>
  useMemo(() => {
    const lineGenerator = line<Chart2Entry>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.price0))
      .curve(curveMonotoneX);

    return <Path stroke={stroke} d={lineGenerator(series) ?? undefined} />;
  }, [series, xScale, yScale, stroke]);
