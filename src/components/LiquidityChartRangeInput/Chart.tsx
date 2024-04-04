import { max, scaleLinear, ZoomTransform } from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bound } from "../../state/v4/actions";
import { Area } from "./Area";
import { AxisRight } from "./AxisRight";
import { Brush } from "./Brush";
import { Line } from "./Line";
import { ChartEntry, LiquidityChartRangeInputProps } from "./types";
import Zoom, { ZoomOverlay } from "./Zoom";

const xAccessor = (d: ChartEntry) => d.activeLiquidity;
const yAccessor = (d: ChartEntry) => d.price0;

export function Chart({
  id = "liquidityChartRangeInput",
  data: { series, current },
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

  const { xScale, yScale } = useMemo(() => {
    const scales = {
      yScale: scaleLinear()
        .domain([
          current * zoomLevels.initialMax,
          current * zoomLevels.initialMin,
        ] as number[])
        .range([0, innerHeight]),
      xScale: scaleLinear()
        .domain([0, max(series, xAccessor)] as number[])
        .range([Math.ceil(innerWidth * 0.2), 0]),
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
    series,
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
              current * zoomLevels.initialMin,
              current * zoomLevels.initialMax,
            ] as [number, number],
            "reset"
          );
        }}
        showResetButton={Boolean(
          ticksAtLimit[Bound.LOWER] || ticksAtLimit[Bound.UPPER]
        )}
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
              <rect x="0" y="0" width={innerWidth} height={height} />
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
                series={series}
                xScale={xScale}
                yScale={yScale}
                xValue={xAccessor}
                yValue={yAccessor}
                //style is area.selection but 30% opacity
                fill={styles.area.selection + "4D"}
              />

              {brushDomain && (
                // duplicate area chart with mask for selected area
                <g mask={`url(#${id}-chart-area-mask)`}>
                  <Area
                    series={series}
                    xScale={xScale}
                    yScale={yScale}
                    xValue={xAccessor}
                    yValue={yAccessor}
                    fill={styles.area.selection}
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
            <Line value={current} yScale={yScale} innerWidth={innerWidth} />
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
