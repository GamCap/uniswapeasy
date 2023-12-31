export interface Colors {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    text: string;
    textInverted: string; 
}
export interface Gaps  {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
};
export type Gap = keyof Gaps;
export type Color = keyof Colors;
export type BorderRadius = {
    xsmall: number;
    small: number;
    medium: number;
    large: number;
}
export interface Attributes {
    borderRadius: BorderRadius;
    grids: Gaps;
}

export interface Theme extends Partial<Colors>, Partial<Attributes> {}