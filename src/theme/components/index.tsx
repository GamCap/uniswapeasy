import { Text, TextProps as TextPropsOriginal } from "rebass";
import styled from "styled-components";

type TextProps = Omit<TextPropsOriginal, "css">;

const TextWrapper = styled(Text).withConfig({
  shouldForwardProp: (prop) => prop !== "color",
})<{ color: string }>`
  color: ${({ color, theme }) => (theme as any)[color]};
`;

export const ThemedText = {
  MediumHeader(props: TextProps) {
    return <TextWrapper fontWeight={535} fontSize={20} {...props} />;
  },
  SmallActiveGreen(props: TextProps) {
    return <TextWrapper color="textActive" fontSize={12} {...props} />;
  },
  SubHeader(props: TextProps) {
    return (
      <TextWrapper
        fontWeight={500}
        fontSize={16}
        color={"primary"}
        {...props}
      />
    );
  },
  SmallText(props: TextProps) {
    return <TextWrapper fontSize={12} fontWeight={500} color="textTertiary" />;
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
  background: ${({ theme }) => theme.background};
`;

export const BoxSecondary = styled(Box)`
  background: ${({ theme }) => theme.backgroundSecondary};
`;
