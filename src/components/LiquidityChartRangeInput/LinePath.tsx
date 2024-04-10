// TimePriceLine.tsx
import { useMemo } from "react";
import { line, ScaleTime, ScaleLinear, curveMonotoneX } from "d3";
import styled from "styled-components";
import { PriceHistoryEntry } from "./types";

const Path = styled.path<{ stroke?: string }>`
  fill: none;
  stroke: ${({ stroke, theme }) => stroke ?? theme.components.graph.main};
  strokewidth: 2;
  opacity: 0.8;
`;

export const TimePriceLine = ({
  series,
  xScale,
  yScale,
  stroke,
}: {
  series: PriceHistoryEntry[];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  stroke?: string;
}) =>
  useMemo(() => {
    const lineGenerator = line<PriceHistoryEntry>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.price0))
      .curve(curveMonotoneX);

    return <Path stroke={stroke} d={lineGenerator(series) ?? undefined} />;
  }, [series, xScale, yScale, stroke]);
