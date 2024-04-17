import React, { useState, useRef, useEffect } from "react";
import styled, { useTheme } from "styled-components";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  defaultPosition?: TooltipPosition;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled.div<{
  $isVisible: boolean;
  $position: TooltipPosition;
}>`
  box-sizing: border-box;
  width: max-content;
  position: absolute;
  padding: 8px 12px;
  max-width: 160px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.components.tooltip.background};
  color: ${({ theme }) => theme.components.tooltip.foreground};
  font-size: 12px;
  line-height: 16px;
  white-space: normal;
  visibility: ${({ $isVisible: isVisible }) =>
    isVisible ? "visible" : "hidden"};
  opacity: ${({ $isVisible: isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s, visibility 0.3s ease-in-out;
  z-index: 100;

  ${({ $position: position }) => {
    switch (position) {
      case "top":
        return `
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom":
        return `
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case "left":
        return `
          top: 50%;
          right: calc(100% + 8px);
          transform: translateY(-50%);
        `;
      case "right":
        return `
          top: 50%;
          left: calc(100% + 8px);
          transform: translateY(-50%);
        `;
    }
  }}

  &:after {
    content: "";
    position: absolute;
    border-style: solid;
    ${({ $position: position, theme }) => {
      switch (position) {
        case "top":
          return `
              top: 100%;
              left: 50%;
              border-width: 5px 5px 0 5px;
              border-color: ${theme.components.tooltip.background} transparent transparent transparent;
              transform: translateX(-50%);
            `;
        case "bottom":
          return `
              bottom: 100%; 
              left: 50%;
              border-width: 0 5px 5px 5px;
              border-color: transparent transparent ${theme.components.tooltip.background} transparent;
              transform: translateX(-50%);
            `;
        case "left":
          return `
              top: 50%;
              left: 100%;
              border-width: 5px 0 5px 5px;
              border-color: transparent transparent transparent ${theme.components.tooltip.background};
              transform: translateY(-50%);
            `;
        case "right":
          return `
              top: 50%;
              right: 100%; 
              border-width: 5px 5px 5px 0;
              border-color: transparent ${theme.components.tooltip.background} transparent transparent;
              transform: translateY(-50%);
            `;
      }
    }};
  }
`;

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  defaultPosition = "top",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>(defaultPosition);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const updateTooltipPosition = () => {
    if (!containerRef.current || !tooltipRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const positions: TooltipPosition[] = ["top", "bottom", "left", "right"];

    const fitsInViewport = (pos: TooltipPosition) => {
      switch (pos) {
        case "top":
          return containerRect.top >= tooltipRect.height + 8;
        case "bottom":
          return (
            window.innerHeight - containerRect.bottom >= tooltipRect.height + 8
          );
        case "left":
          return containerRect.left >= tooltipRect.width + 8;
        case "right":
          return (
            window.innerWidth - containerRect.right >= tooltipRect.width + 8
          );
      }
    };

    const validPositions = positions.filter(fitsInViewport);
    if (
      validPositions.length > 0 &&
      !validPositions.includes(defaultPosition)
    ) {
      setPosition(validPositions[0]);
    } else {
      setPosition(defaultPosition);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateTooltipPosition);
    return () => window.removeEventListener("resize", updateTooltipPosition);
  }, [position]);

  const showTooltip = () => {
    updateTooltipPosition();
    setIsVisible(true);
  };
  const hideTooltip = () => setIsVisible(false);

  return (
    <TooltipContainer
      ref={containerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <TooltipText ref={tooltipRef} $isVisible={isVisible} $position={position}>
        {content}
      </TooltipText>
    </TooltipContainer>
  );
};

export default Tooltip;
