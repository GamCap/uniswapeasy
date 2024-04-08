import React, { useMemo } from "react";
import {
  axisBottom,
  Axis as d3Axis,
  NumberValue,
  ScaleTime,
  select,
  timeFormat,
} from "d3";
import styled from "styled-components";

const StyledGroup = styled.g`
  .tick {
    line {
      display: none;
    }
    text {
      fill: ${({ theme }) => theme.text.tertiary};
      font-size: 12px;
    }
  }
`;

const Axis = ({
  axisGenerator,
  scale,
  tickFormat,
}: {
  axisGenerator: d3Axis<NumberValue>;
  scale: ScaleTime<number, number>;
  tickFormat: string;
}) => {
  const axisRef = (axis: SVGGElement) => {
    if (!axis) return;

    select(axis)
      .call(axisGenerator)
      .call((g) => {
        g.select(".domain").remove();
        //d is timestamp, parse it to time and format it
        g.selectAll(".tick text").text((d, i) =>
          i === 0 ? "" : timeFormat(tickFormat)(new Date(d as number))
        );
      });
  };

  return <StyledGroup ref={axisRef} />;
};

export const AxisBottom = ({
  xScale,
  height,
  tickFormat,
}: {
  xScale: ScaleTime<number, number>;
  height: number;
  tickFormat: string;
}) =>
  useMemo(
    () => (
      <StyledGroup transform={`translate(0,${height})`}>
        <Axis
          axisGenerator={axisBottom(xScale)}
          scale={xScale}
          tickFormat={tickFormat}
        />
      </StyledGroup>
    ),
    [xScale, height, tickFormat]
  );
