import styled, { css, keyframes } from "styled-components";

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RotationStyle = css`
  animation: 2s ${rotateAnimation} linear infinite;
`;

export const StyledSVG = styled.svg<{
  $size: string;
}>`
  height: ${({ $size: size }) => size};
  width: ${({ $size: size }) => size};
  path {
    stroke: ${({ stroke }) => stroke};
    background: ${({ theme }) => theme.text.primary};
    fill: ${({ fill }) => fill};
  }
`;

export const StyledRotatingSVG = styled(StyledSVG)`
  ${RotationStyle}
`;
