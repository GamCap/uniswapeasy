import { WidgetProps, default as Widget } from "components/Widget";
import {
  default as LPWidget,
  LPWidgetProps,
} from "components/LPWidget/LPWidget";

export type UniswapEasyProps = WidgetProps & LPWidgetProps;

export function UniswapEasy(props: UniswapEasyProps) {
  return (
    <Widget {...props}>
      <LPWidget {...props} />
    </Widget>
  );
}
