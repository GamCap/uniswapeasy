export interface Colors {
    primary: string;
    secondary: string;
    tertiary: string;
    background: string;
    text: string;
    textInverted: string; 
}

export type Color = keyof Colors;
export type BorderRadius = {
    xsmall: string;
    small: string;
    medium: string;
    large: string;
}
export interface Attributes {
    borderRadius: BorderRadius;
}

export interface Theme extends Partial<Colors>, Partial<Attributes> {}