import { Bound } from "../../state/v4/actions";

export interface TickDataEntry {
  activeLiquidity: number;
  price0: number;
}

export interface PriceHistoryEntry {
  price0: number;
  time: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ZoomLevels {
  initialMin: number;
  initialMax: number;
  min: number;
  max: number;
}

export interface LiquidityChartRangeInputProps {
  // to distringuish between multiple charts in the DOM
  id?: string;

  data: {
    tickData: TickDataEntry[];
    priceHistory: PriceHistoryEntry[];
    current: number;
  };
  ticksAtLimit: { [bound in Bound]?: boolean | undefined };

  styles: {
    area: {
      // color of the ticks in range
      selection: string;
    };

    brush: {
      handle: {
        west: string;
        east: string;
      };
    };

    divider: string;
  };

  dimensions: Dimensions;
  margins: Margins;

  interactive?: boolean;

  brushLabels: (d: "s" | "n", x: number) => string;
  brushDomain?: [number, number];
  onBrushDomainChange: (
    domain: [number, number],
    mode: string | undefined
  ) => void;

  zoomLevels: ZoomLevels;
}
