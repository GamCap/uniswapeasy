import { useTheme } from "styled-components";

import { StyledRotatingSVG } from "./shared";

/**
 * Takes in custom size and stroke for circle color, default to primary color as fill,
 * need ...rest for layered styles on top
 */

//TODO: Update colors according to theme
export default function Loader({
  size = "16px",
  stroke,
  strokeWidth,
  ...rest
}: {
  size?: string;
  stroke?: string;
  strokeWidth?: number;
  [k: string]: any;
}) {
  const theme = useTheme();
  return (
    <StyledRotatingSVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      size={size}
      stroke={stroke ?? theme.text.primary}
      {...rest}
    >
      <path
        d="M2,12 a10,10 0 0,1 10,-10 M12,22 a10,10 0 0,1 -10,-10 M22,12 a10,10 0 0,1 -10,10"
        strokeWidth={strokeWidth ?? "2.5"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </StyledRotatingSVG>
  );
}
