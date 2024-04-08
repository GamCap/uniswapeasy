import {
  brushHandleAccentPath,
  brushHandlePath,
  dashedBrushHandlePath,
  OffScreenHandle,
} from "./svg";
import { BrushBehavior, brushY, D3BrushEvent, ScaleLinear, select } from "d3";
import usePrevious from "../../hooks/usePrevious";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";

const Handle = styled.path<{ color: string }>`
  cursor: ns-resize;
  pointer-events: none;

  stroke-width: 3;
  stroke: ${({ color }) => color};
  fill: ${({ color }) => color};
`;

const DashedHandle = styled.path<{ color: string }>`
  pointer-events: none;
  stroke-dasharray: 2;
  stroke-width: 1;
  stroke: ${({ color }) => color};
  fill: ${({ color }) => color};
`;

const HandleAccent = styled.path`
  cursor: ew-resize;
  pointer-events: none;

  stroke-width: 1.5;
  stroke: ${({ theme }) => theme.primary};
  opacity: ${({ theme }) => 0.5};
`;

const LabelGroup = styled.g<{ visible: boolean }>`
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  transition: opacity 300ms;
`;

const TooltipBackground = styled.rect`
  fill: ${({ theme }) => theme.backgroundTertiary};
`;

const Tooltip = styled.text`
  text-anchor: middle;
  font-size: 12px;
  fill: ${({ theme }) => theme.primary};
`;

// flips the handles draggers when close to the container edges
const FLIP_HANDLE_THRESHOLD_PX = 20;

// margin to prevent tick snapping from putting the brush off screen
const BRUSH_EXTENT_MARGIN_PX = 2;

/**
 * Returns true if every element in `a` maps to the
 * same pixel coordinate as elements in `b`
 */
const compare = (
  a: [number, number],
  b: [number, number],
  xScale: ScaleLinear<number, number>
): boolean => {
  // normalize pixels to 1 decimals
  const aNorm = a.map((x) => xScale(x).toFixed(1));
  const bNorm = b.map((x) => xScale(x).toFixed(1));
  return aNorm.every((v, i) => v === bNorm[i]);
};

export const Brush = ({
  id,
  yScale,
  interactive,
  brushLabelValue,
  brushExtent,
  setBrushExtent,
  innerWidth,
  innerHeight,
  southHandleColor,
  northHandleColor,
}: {
  id: string;
  yScale: ScaleLinear<number, number>;
  interactive: boolean;
  brushLabelValue: (d: "s" | "n", x: number) => string;
  brushExtent: [number, number];
  setBrushExtent: (extent: [number, number], mode: string | undefined) => void;
  innerWidth: number;
  innerHeight: number;
  southHandleColor: string;
  northHandleColor: string;
}) => {
  const brushRef = useRef<SVGGElement | null>(null);
  const brushBehavior = useRef<BrushBehavior<SVGGElement> | null>(null);

  // only used to drag the handles on brush for performance
  const [localBrushExtent, setLocalBrushExtent] = useState<
    [number, number] | null
  >(brushExtent);
  const [showLabels, setShowLabels] = useState(false);
  const [hovering, setHovering] = useState(false);

  const previousBrushExtent = usePrevious(brushExtent);

  const brushed = useCallback(
    (event: D3BrushEvent<unknown>) => {
      const { type, selection, mode } = event;

      if (!selection) {
        setLocalBrushExtent(null);
        return;
      }

      const scaled = (selection as [number, number]).map(yScale.invert) as [
        number,
        number
      ];

      // avoid infinite render loop by checking for change
      if (type === "end" && !compare(brushExtent, scaled, yScale)) {
        setBrushExtent(scaled, mode);
      }

      setLocalBrushExtent(scaled);
    },
    [yScale, brushExtent, setBrushExtent]
  );

  // keep local and external brush extent in sync
  // i.e. snap to ticks on bruhs end
  useEffect(() => {
    setLocalBrushExtent(brushExtent);
  }, [brushExtent]);

  // initialize the brush
  useEffect(() => {
    if (!brushRef.current) return;

    brushBehavior.current = brushY<SVGGElement>()
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .handleSize(30)
      .filter(() => interactive)
      .on("brush end", brushed);

    brushBehavior.current(select(brushRef.current));

    if (
      previousBrushExtent &&
      compare(brushExtent, previousBrushExtent, yScale)
    ) {
      select(brushRef.current)
        .transition()
        .call(brushBehavior.current.move as any, brushExtent.map(yScale));
    }

    // brush linear gradient
    select(brushRef.current)
      .selectAll(".selection")
      .attr("width", innerWidth)
      .attr("stroke", "none")
      .attr("fill-opacity", "0.05")
      .attr("fill", `url(#${id}-gradient-selection)`);
  }, [
    brushExtent,
    brushed,
    id,
    innerHeight,
    innerWidth,
    interactive,
    previousBrushExtent,
    yScale,
  ]);

  // respond to xScale changes only
  useEffect(() => {
    if (!brushRef.current || !brushBehavior.current) return;

    brushBehavior.current.move(
      select(brushRef.current) as any,
      brushExtent.map(yScale) as any
    );
  }, [brushExtent, yScale]);

  // show labels when local brush changes
  useEffect(() => {
    setShowLabels(true);
    const timeout = setTimeout(() => setShowLabels(false), 1500);
    return () => clearTimeout(timeout);
  }, [localBrushExtent]);

  // variables to help render the SVGs
  const flipNHandle =
    localBrushExtent && yScale(localBrushExtent[0]) > FLIP_HANDLE_THRESHOLD_PX;
  const flipSHandle =
    localBrushExtent &&
    yScale(localBrushExtent[1]) > innerHeight - FLIP_HANDLE_THRESHOLD_PX;

  const showNArrow =
    localBrushExtent &&
    (yScale(localBrushExtent[0]) < 0 || yScale(localBrushExtent[1]) < 0);
  const showSArrow =
    localBrushExtent &&
    (yScale(localBrushExtent[0]) > innerHeight ||
      yScale(localBrushExtent[1]) > innerHeight);

  const nHandleInView =
    localBrushExtent &&
    yScale(localBrushExtent[0]) >= 0 &&
    yScale(localBrushExtent[0]) <= innerHeight;
  const sHandleInView =
    localBrushExtent &&
    yScale(localBrushExtent[1]) >= 0 &&
    yScale(localBrushExtent[1]) <= innerHeight;

  const theme = useTheme();
  return useMemo(
    () => (
      <>
        <defs>
          <linearGradient
            id={`${id}-gradient-selection`}
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
          >
            <stop stopColor={northHandleColor} />
            <stop stopColor={southHandleColor} offset={1} />
          </linearGradient>

          {/* clips at exactly the svg area */}
          <clipPath id={`${id}-brush-clip`}>
            <rect x="0" y="0" width={innerWidth} height={innerHeight} />
          </clipPath>
        </defs>

        {/* will host the d3 brush */}
        <g
          ref={brushRef}
          clipPath={`url(#${id}-brush-clip)`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        />

        {/* custom brush handles */}
        {localBrushExtent && (
          <>
            {/* west handle */}
            {nHandleInView ? (
              <g
                transform={`translate(0,${Math.max(
                  0,
                  yScale(localBrushExtent[0])
                )}), scale(1,${flipNHandle ? "1" : "-1"})`}
              >
                <g>
                  <DashedHandle
                    color={northHandleColor}
                    d={dashedBrushHandlePath(innerWidth)}
                    transform="translate(0,2)"
                  />
                </g>
                <g>
                  <Handle
                    color={northHandleColor}
                    d={brushHandlePath(innerWidth)}
                  />
                  <HandleAccent d={brushHandleAccentPath()} />
                </g>
                <line
                  x1="0"
                  y1="0"
                  x2="12"
                  y2="0"
                  stroke={theme.text.primary}
                  strokeWidth="1"
                  transform={`translate(${
                    Math.floor(innerWidth * 0.8) + 7
                  }, -3.5)`}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="12"
                  y2="0"
                  stroke={theme.text.primary}
                  strokeWidth="1"
                  transform={`translate(${
                    Math.floor(innerWidth * 0.8) + 7
                  }, -7)`}
                />
              </g>
            ) : null}

            {/* east handle */}
            {sHandleInView ? (
              <g
                transform={`translate(0,${yScale(
                  localBrushExtent[1]
                )}), scale(1,${flipSHandle ? "1" : "-1"})`}
              >
                <g>
                  <DashedHandle
                    color={southHandleColor}
                    d={dashedBrushHandlePath(innerWidth)}
                    transform="translate(0,2)"
                  />
                </g>
                <g>
                  <Handle
                    color={southHandleColor}
                    d={brushHandlePath(innerWidth)}
                  />
                  <HandleAccent d={brushHandleAccentPath()} />
                </g>
                <line
                  x1="0"
                  y1="0"
                  x2="12"
                  y2="0"
                  stroke={theme.text.primary}
                  strokeWidth="1"
                  transform={`translate(${
                    Math.floor(innerWidth * 0.8) + 7
                  }, -3.5)`}
                />
                <line
                  x1="0"
                  y1="0"
                  x2="12"
                  y2="0"
                  stroke={theme.text.primary}
                  strokeWidth="1"
                  transform={`translate(${
                    Math.floor(innerWidth * 0.8) + 7
                  }, -7)`}
                />
              </g>
            ) : null}

            {showNArrow && (
              <g
                transform={`translate(${Math.floor(innerWidth * 0.8) - 10}, 0)`}
              >
                <OffScreenHandle color={northHandleColor} />
              </g>
            )}

            {showSArrow && (
              <g
                transform={`translate( ${
                  Math.floor(innerWidth * 0.8) - 10
                }, ${innerHeight}) scale(1,-1)`}
              >
                <OffScreenHandle color={southHandleColor} />
              </g>
            )}
          </>
        )}
      </>
    ),
    [
      brushLabelValue,
      northHandleColor,
      sHandleInView,
      flipSHandle,
      flipNHandle,
      hovering,
      id,
      innerHeight,
      innerWidth,
      localBrushExtent,
      showSArrow,
      showLabels,
      showNArrow,
      southHandleColor,
      nHandleInView,
      yScale,
    ]
  );
};
