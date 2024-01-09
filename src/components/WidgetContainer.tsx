import { PropsWithChildren } from "react";
import styled from "styled-components";

const StyledWidgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.grids["md"]};
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.background};
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
