import {
  Axis as d3Axis,
  axisRight,
  NumberValue,
  ScaleLinear,
  select,
} from "d3";
import { useMemo } from "react";
import styled from "styled-components";

const StyledGroup = styled.g`
  .tick {
    line {
      display: none;
    }

    text {
      fill: ${({ theme }) => theme.text.primary};
      padding: 4px 8px;
    }

    rect {
      fill: ${({ theme }) => theme.surfacesAndElevation.elevation2};
      stroke: ${({ theme }) => theme.borders.borders};
      strokewidth: 1;
      border-radius: 4px;
      z-index: 2;
    }

    &.currentPrice {
      text {
        fill: ${({ theme }) => theme.surfacesAndElevation.elevation2};
      }

      rect {
        fill: ${({ theme }) => theme.text.primary};
        z-index: 1;
      }
    }
  }
`;

const Axis = ({
  axisGenerator,
  brushDomain,
  currentPrice,
}: {
  axisGenerator: d3Axis<NumberValue>;
  brushDomain?: [number, number];
  currentPrice?: number;
}) => {
  const axisRef = (axis: SVGGElement) => {
    if (!axis) return;

    const axisSelection = select(axis);
    axisSelection.call(axisGenerator).call((g) => {
      g.select(".domain").remove();

      const tickValues = [
        currentPrice,
        brushDomain ? brushDomain[0] : undefined,
        brushDomain ? brushDomain[1] : undefined,
      ].filter((d): d is number => typeof d === "number");
      g.call(axisGenerator.tickValues(tickValues));

      g.selectAll(".tick").each(function (d) {
        let tick = select(this);
        if (d === currentPrice) tick.classed("currentPrice", true);

        let textNode = tick.select("text").node() as SVGTextElement | null;
        if (textNode) {
          let bbox = textNode.getBBox();
          tick
            .insert("rect", "text")
            .attr("x", bbox.x - 4)
            .attr("y", bbox.y - 4)
            .attr("width", bbox.width + 8)
            .attr("height", bbox.height + 8)
            .attr("rx", 4);
        }
      });
      g.select(".domain").remove();
    });
  };

  return <g ref={axisRef} />;
};

export const AxisRight = ({
  yScale,
  innerWidth,
  currentPrice,
  offset = 0,
  brushDomain,
}: {
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
  currentPrice?: number;
  offset?: number;
  brushDomain?: [number, number];
}) =>
  useMemo(
    () => (
      <StyledGroup transform={`translate(${Math.ceil(innerWidth * 0.2)},0)`}>
        <Axis
          axisGenerator={axisRight(yScale)}
          brushDomain={brushDomain}
          currentPrice={currentPrice}
        />
      </StyledGroup>
    ),
    [innerWidth, offset, yScale, brushDomain, currentPrice]
  );
