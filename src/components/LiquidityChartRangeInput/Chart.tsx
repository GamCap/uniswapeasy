import { max, min, scaleLinear, scaleTime, ZoomTransform } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { Area } from "./Area";
import { AxisRight } from "./AxisRight";
import { Brush } from "./Brush";
import { Line } from "./Line";
import {
  TickDataEntry,
  LiquidityChartRangeInputProps,
  PriceHistoryEntry,
} from "./types";
import Zoom, { ZoomOverlay } from "./Zoom";
import { AxisBottom } from "./AxisBottom";
import { TimePriceLine } from "./LinePath";
import styled from "styled-components";

const PriceLine = styled.line`
  stroke: ${({ theme }) => theme.borders.dividers};
  stroke-width: 1;
`;
const PriceDot = styled.circle`
  fill: ${({ theme }) => theme.components.graph.main};
`;
const xAccessor = (d: TickDataEntry) => d.activeLiquidity;
const yAccessor = (d: TickDataEntry) => d.price0;
const timeAccessor = (d: PriceHistoryEntry) => d.time;

export function Chart({
  id = "liquidityChartRangeInput",
  data: { tickData, priceHistory, current },
  ticksAtLimit,
  styles,
  dimensions: { width, height },
  margins,
  interactive = true,
  brushDomain,
  brushLabels,
  onBrushDomainChange,
  zoomLevels,
}: LiquidityChartRangeInputProps) {
  const zoomRef = useRef<SVGRectElement | null>(null);

  const [zoom, setZoom] = useState<ZoomTransform | null>(null);

  const { innerHeight, innerWidth } = useMemo(
    () => ({
      innerHeight: height - margins.top - margins.bottom,
      innerWidth: width - margins.left - margins.right,
    }),
    [width, height, margins]
  );

  const { xScale, yScale, xTimeScale } = useMemo(() => {
    const scales = {
      yScale: scaleLinear()
        .domain([
          current * zoomLevels.initialMax,
          current * zoomLevels.initialMin,
        ] as number[])
        .range([0, innerHeight]),
      xScale: scaleLinear()
        .domain([0, max(tickData, xAccessor)] as number[])
        .range([Math.ceil(innerWidth * 0.2), 0]),
      xTimeScale: scaleTime()
        .domain([
          min(priceHistory, timeAccessor),
          max(priceHistory, timeAccessor),
        ] as number[])
        .range([0, Math.floor(innerWidth * 0.8) - 20]),
    };

    if (zoom) {
      const newYScale = zoom.rescaleY(scales.yScale);
      scales.yScale.domain(newYScale.domain());
    }

    return scales;
  }, [
    current,
    zoomLevels.initialMin,
    zoomLevels.initialMax,
    innerWidth,
    tickData,
    priceHistory,
    innerHeight,
    zoom,
  ]);

  // useEffect(() => {
  //   // reset zoom as necessary
  //   setZoom(null);
  // }, [zoomLevels]);

  useEffect(() => {
    if (!brushDomain) {
      onBrushDomainChange(yScale.domain() as [number, number], undefined);
    }
  }, [brushDomain, onBrushDomainChange, xScale]);

  return (
    <>
      <Zoom
        svg={zoomRef.current}
        yScale={yScale}
        setZoom={setZoom}
        width={width}
        height={innerHeight}
        resetBrush={() => {
          onBrushDomainChange(
            [
              current * zoomLevels.initialMax,
              current * zoomLevels.initialMin,
            ] as [number, number],
            "reset"
          );
        }}
        // showResetButton={Boolean(
        //   ticksAtLimit[Bound.LOWER] || ticksAtLimit[Bound.UPPER]
        // )}
        showResetButton={true}
        zoomLevels={zoomLevels}
      />
      <div>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          style={{ overflow: "visible" }}
        >
          <defs>
            <clipPath id={`${id}-chart-clip`}>
              <rect x="0" y="0" width={innerWidth} height={innerHeight} />
            </clipPath>

            {brushDomain && (
              // mask to highlight selected area
              <mask id={`${id}-chart-area-mask`}>
                <rect
                  fill="white"
                  x={0}
                  y={yScale(brushDomain[0])}
                  width={innerWidth}
                  height={yScale(brushDomain[1]) - yScale(brushDomain[0])}
                />
              </mask>
            )}
          </defs>

          <g transform={`translate(${margins.left},${margins.top})`}>
            <g
              clipPath={`url(#${id}-chart-clip)`}
              transform={`translate(${Math.floor(innerWidth * 0.8)} , 0 )`}
            >
              <Area
                series={tickData}
                xScale={xScale}
                yScale={yScale}
                xValue={xAccessor}
                yValue={yAccessor}
                //style is area.selection but 30% opacity
                opacity={0.3}
              />

              {brushDomain && (
                // duplicate area chart with mask for selected area
                <g mask={`url(#${id}-chart-area-mask)`}>
                  <Area
                    series={tickData}
                    xScale={xScale}
                    yScale={yScale}
                    xValue={xAccessor}
                    yValue={yAccessor}
                  />
                </g>
              )}

              <AxisRight
                yScale={yScale}
                innerWidth={innerWidth}
                brushDomain={brushDomain}
                currentPrice={current}
              />
            </g>
            <AxisBottom
              xScale={xTimeScale}
              height={innerHeight}
              tickFormat={"%H:%M"}
            />
            <g clipPath={`url(#${id}-chart-clip)`}>
              <TimePriceLine
                series={priceHistory}
                xScale={xTimeScale}
                yScale={yScale}
              />
              <Line value={current} yScale={yScale} innerWidth={innerWidth} />
              <PriceDot
                cx={xTimeScale(priceHistory[priceHistory.length - 1].time)}
                cy={yScale(priceHistory[priceHistory.length - 1].price0)}
                r="5"
              />
            </g>
            <PriceLine x1="0" y1={innerHeight} x2={width} y2={innerHeight} />

            <ZoomOverlay width={width} height={height} ref={zoomRef} />

            <Brush
              id={id}
              yScale={yScale}
              interactive={interactive}
              brushLabelValue={brushLabels}
              brushExtent={brushDomain ?? (yScale.domain() as [number, number])}
              innerWidth={innerWidth}
              innerHeight={innerHeight}
              setBrushExtent={onBrushDomainChange}
              southHandleColor={styles.brush.handle.west}
              northHandleColor={styles.brush.handle.east}
            />
          </g>
        </svg>
      </div>
    </>
  );
}
