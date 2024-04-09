import { area, curveStepAfter, ScaleLinear } from "d3";
import { useMemo } from "react";
import styled from "styled-components";

import { TickDataEntry } from "./types";

const Path = styled.path<{ $opacity: number }>`
  opacity: ${({ $opacity }) => $opacity};
  stroke: ${({ theme }) => theme.components.graph.main};
  fill: ${({ theme }) => theme.components.graph.main};
`;

export const Area = ({
  series,
  xScale,
  yScale,
  xValue,
  yValue,
  opacity,
}: {
  series: TickDataEntry[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xValue: (d: TickDataEntry) => number;
  yValue: (d: TickDataEntry) => number;
  opacity?: number;
}) =>
  useMemo(
    () => (
      <Path
        $opacity={opacity ?? 1}
        d={
          area()
            .curve(curveStepAfter)
            .x((d: unknown) => xScale(xValue(d as TickDataEntry)))
            .y1((d: unknown) => yScale(yValue(d as TickDataEntry)))
            .y0(yScale(0))(
            series.filter((d) => {
              const value = xScale(xValue(d));
              return value > 0 && value <= window.innerWidth;
            }) as Iterable<[number, number]>
          ) ?? undefined
        }
      />
    ),
    [opacity, series, xScale, xValue, yScale, yValue]
  );
