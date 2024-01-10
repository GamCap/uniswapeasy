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
        fontWeight={700}
        fontSize={12}
        color={"primary"}
        {...props}
      />
    );
  },
};

export const StyledBoxSecondary = styled.div<{
  $padding?: string;
}>`
  padding: ${({ $padding }) => $padding ?? "12px 16px 12px 16px"};
  width: 100%;
  height: fit-content;
  box-sizing: border-box;
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 15px;
  justify-content: space-between;
`;
