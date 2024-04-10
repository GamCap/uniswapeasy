import { WidgetProps, default as Widget } from "components/Widget";
import {
  default as LPWidget,
  LPWidgetProps,
} from "components/LPWidget/LPWidget";
import type { Theme, Colors, Attributes } from "theme/theme";
import {
  tealDark,
  tealLight,
  orangeDark,
  orangeLight,
  defaultTheme,
} from "theme";
import type { PoolKey } from "state/v4/hooks";
import type { PoolInfo, HookInfo } from "components/LPWidget/LPWidget";
import type {
  InputField,
  Tuple,
  BaseInputField,
} from "components/DynamicFeatureForm/types";

export { PoolKey, PoolInfo, HookInfo, InputField, Tuple, BaseInputField };
export { tealDark, tealLight, orangeDark, orangeLight, defaultTheme };
export { Theme, Colors, Attributes };

export type UniswapEasyProps = WidgetProps & LPWidgetProps;

export function UniswapEasy(props: UniswapEasyProps) {
  return (
    <Widget {...(props as WidgetProps)}>
      <LPWidget
        poolInfos={props.poolInfos}
        hookInfos={props.hookInfos}
        currencyIconMap={props.currencyIconMap}
      />
    </Widget>
  );
}
