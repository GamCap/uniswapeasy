import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

export interface WidgetContainerProps {
  className?: string;
}

export default function WidgetContainer(
  props: PropsWithChildren<WidgetContainerProps>
) {
  return (
    <StyledWidgetContainer className={props.className}>
      {props.children}
    </StyledWidgetContainer>
  );
}
