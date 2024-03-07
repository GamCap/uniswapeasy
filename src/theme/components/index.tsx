import { Text, TextProps as TextPropsOriginal } from "rebass";
import styled from "styled-components";

type TextProps = Omit<TextPropsOriginal, "css">;

interface ThemedTextProps extends TextProps {
  textColor: string;
}

const getColorFromTheme = (color: string, theme: any) => {
  const path = color.split(".");
  let currentObj = theme;
  for (const p of path) {
    if (!currentObj[p]) {
      console.warn(`Theme color not found: ${color}`);
      return theme.text.primary;
    }

    currentObj = currentObj[p];
  }
  return currentObj;
};

const TextWrapper = styled(Text)<{ textColor: string }>`
  color: ${({ textColor, theme }) => getColorFromTheme(textColor, theme)};
`;

export const ThemedText = {
  ParagraphRegular({ textColor, ...props }: ThemedTextProps) {
    return (
      <TextWrapper
        fontSize={16}
        fontWeight={500}
        lineHeight={"24px"}
        textColor={textColor}
        {...props}
      />
    );
  },
  ParagraphExtraSmall({ textColor, ...props }: ThemedTextProps) {
    return (
      <TextWrapper
        fontSize={12}
        fontWeight={400}
        lineHeight={"16px"}
        textColor={textColor}
        {...props}
      />
    );
  },
  MediumHeader({ textColor, ...props }: ThemedTextProps) {
    return (
      <TextWrapper
        fontWeight={535}
        fontSize={20}
        textColor={textColor}
        {...props}
      />
    );
  },
  SmallActiveGreen({ textColor, ...props }: ThemedTextProps) {
    return <TextWrapper fontSize={12} textColor={textColor} {...props} />;
  },
  SubHeader({ textColor, ...props }: ThemedTextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        fontSize={16}
        textColor={textColor}
        {...props}
      />
    );
  },
  SmallText({ textColor, ...props }: ThemedTextProps) {
    return (
      <TextWrapper
        fontSize={12}
        fontWeight={500}
        textColor={textColor}
        {...props}
      />
    );
  },
};

export const Box = styled.div<{
  $padding?: string;
  $radius?: string;
  $border?: string;
}>`
  padding: ${({ $padding }) => $padding ?? "0px"};
  border: ${({ $border }) => $border ?? "none"};
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  border-radius: ${({ $radius }) => $radius ?? "0px"};
`;

export const BoxPrimary = styled(Box)`
  background: ${({ theme }) => theme.surfacesAndElevation.elevation1};
`;

export const BoxSecondary = styled(Box)`
  background: ${({ theme }) => theme.surfacesAndElevation.elevation2};
`;
