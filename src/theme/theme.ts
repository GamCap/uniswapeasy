export interface Gaps {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  lgplus: string;
  xl: string;
}
export type Gap = keyof Gaps;

export type BorderRadius = {
  xsmall: number;
  small: number;
  medium: number;
  large: number;
};
export interface Attributes {
  borderRadius: BorderRadius;
  grids: Gaps;
  font: { family: string };
}
export interface Colors {
  surfacesAndElevation: {
    pageBackground: string;
    elevation1: string;
    elevation2: string;
    elevation3: string;
    // elevation4: string;
  };
  borders: {
    borders: string;
    dividers: string;
    dividerBlank: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    // placeholder: string;
    // disabled: string;
    color: string;
    gain: string;
    loss: string;
  };
  components: {
    icon: {
      icon: string;
    };
    button: {
      primary: {
        background: string;
        foreground: string;
        hoverAndFocusBackground: string;
        hoverAndFocusForeground: string;
        disabledBackground: string;
        disabledForeground: string;
      };
      secondary: {
        foreground: string;
        hoverAndFocusBackground: string;
        hoverAndFocusForeground: string;
        disabledBorder: string;
        disabledForeground: string;
        border: string;
        hoverAndFocusBorder: string;
        background: string;
      };
      // tertiary: {
      //   background: string;
      //   foreground: string;
      //   hoverAndFocusBackground: string;
      //   hoverAndFocusForeground: string;
      //   disabledForeground: string;
      //   disabledBackground: string;
      // };
      ghost: {
        background: string;
        hoverAndFocusBackground: string;
        hoverAndFocusForeground: string;
        disabledBackground: string;
      };
      // alert: {
      //   background: string;
      //   foreground: string;
      //   hoverAndFocusBackground: string;
      //   hoverAndFocusForeground: string;
      //   disabledForeground: string;
      //   disabledBackground: string;
      // };
    };
    // focusRing: {
    //   focusRing: string;
    // };
    badge: {
      // primaryBackground: string;
      // primaryForefround: string;
      neutralBackground: string;
      neutralForeground: string;
      // successBackground: string;
      // successForeground: string;
      alertBackground: string;
      alertForeground: string;
    };
    inputFieldCurrencyField: {
      background: string;
      border: string;
      // hoverBackground: string;
      foreground: string;
      // hoverForeground: string;
      // typeAndActiveBackground: string;
      typeAndActiveForeground: string;
      // borderDestructive: string;
      // disabledBackground: string;
      disabledForeground: string;
      // typeAndActiveBorder: string;
      filledBackground: string;
      filledForeground: string;
      // filledBorder: string;
    };
    dropdown: {
      background: string;
      foreground: string;
      // disabledForeground: string;
      hoverForeground: string;
      hoverBackground: string;
    };
    chip: {
      background: string;
      foreground: string;
      // hoverAndFocusBackground: string;
      // hoverAndFocusForeground: string;
      // activeBackground: string;
      // activeForeground: string;
      // disabledBackground: string;
      // disabledForeground: string;
    };
    // tab: {
    //   foreground: string;
    //   hoverAndFocusBackground: string;
    //   hoverAndFocusForeground: string;
    //   activeBackground: string;
    //   activeForeground: string;
    //   disabledForeground: string;
    //   activeHoverAndFocusBackground: string;
    //   activeHoverAndFocusForeground: string;
    // };
    toggle: {
      activeDefaultBackground: string;
      activeDefaultForeground: string;
      // activeDisabledBackground: string;
      // activeDisabledForeground: string;
      // inactiveDisabledBackground: string;
      // inactiveDisabledForeground: string;
      inactiveDefaultBackground: string;
      // inactiveDefaultForeground: string;
      // inactiveHoverAndFocusBackground: string;
      // inactiveHoverAndFocusForeground: string;
      // activeHoverAndFocusBackground: string;
      // activeHoverAndFocusForeground: string;
    };
    // segmentationControl: {
    //   baseInactiveHoverAndFocusForeground: string;
    //   baseActiveBackground: string;
    //   baseActiveForeground: string;
    //   baseDisabledForeground: string;
    //   background: string;
    //   baseInactiveForeground: string;
    //   border: string;
    // };
    tooltip: {
      background: string;
      foreground: string;
    };
    // radioButton: {
    //   selectedDefaultBackground: string;
    //   selectedDefaultForeground: string;
    //   selectedHoverAndFocusBackground: string;
    //   selectedHoverAndFocusForeground: string;
    //   selectedDisabledBackground: string;
    //   selectedDisabledForeground: string;
    //   unselectedStroke: string;
    //   unselectedHoverAndFocusBackground: string;
    //   unselectedHoverAndFocusForeground: string;
    //   unselectedDisabledBackground: string;
    //   unselectedDisabledStroke: string;
    //   unselectedHoverAndFocusStroke: string;
    // };
    // checkbox: {
    //   unselectedStroke: string;
    //   unselectedHoverAndFocusStroke: string;
    //   unselectedHoverAndFocusBackground: string;
    //   unselectedHoverAndFocusForeground: string;
    //   unselectedDisabledStroke: string;
    //   unselectedDisabledBackground: string;
    //   selectedDefaultBackground: string;
    //   selectedDefaultForeground: string;
    //   selectedHoverAndFocusBackground: string;
    //   selectedHoverAndFocusForeground: string;
    //   selectedDisabledBackground: string;
    //   selectedDisabledForeground: string;
    // };
    // selector: {
    //   border: string;
    //   hoverBackground: string;
    //   activeBackground: string;
    // };
    textButton: {
      // secondary: {
      //   default: string;
      //   hoverAndFocus: string;
      //   disabled: string;
      // };
      primary: {
        default: string;
        // hoverAndFocus: string;
        // disabled: string;
      };
      tertiary: {
        default: string;
        // hoverAndFocus: string;
        // disabled: string;
      };
    };
    graph: {
      main: string;
      // secondary: string;
    };
  };
}

export interface Theme extends Colors, Attributes {}
