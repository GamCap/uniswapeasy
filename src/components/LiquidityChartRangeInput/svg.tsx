/**
 * Generates an SVG path for the east brush handle.
 * Apply `scale(-1, 1)` to generate west brush handle.
 *
 *    |```````\
 *    |  | |  |
 *    |______/
 *    |
 *    |
 *    |
 *    |
 *    |
 *
 * https://medium.com/@dennismphil/one-side-rounded-rectangle-using-svg-fb31cf318d90
 */
export const brushHandlePath = (width: number) =>
  [
    // handle
    `M ${Math.floor(width * 0.8)} 0`, // move to origin
    `H ${width}`, // horizontal line'
    `m 0 1`, // move 1px down
    `H ${Math.floor(width * 0.8)}`, // horizontal line back to the start
    `m 1 0`, // move 1px down

    // `M 0 0`, // move to origin
    // `h ${width}`, // horizontal line
    // "m 0 1", // move 1px down
    // `H 0`, // second horizontal line back to the start
    // `M 1 0`, // move down slightly from top

    // head
    "v -12", // vertical line down
    "q 0 -2 2 -2", // rounded corner to the right
    "h 22", // horizontal line right
    "q 2 0 2 2", // rounded corner upwards
    "v 12", // vertical line up
    `z`, // close path
  ].join(" ");

export const dashedBrushHandlePath = (width: number) =>
  //this is just a line with
  [`M 0 0`, `H ${width}`].join(" ");

export const brushHandleAccentPath = () =>
  [
    "m 5 7", // move to first accent
    "v 14", // vertical line
    "M 0 0", // move to origin
    "m 9 7", // move to second accent
    "v 14", // vertical line
    "z",
  ].join(" ");

export const OffScreenHandle = ({
  color,
  size = 10,
  margin = 10,
}: {
  color: string;
  size?: number;
  margin?: number;
}) => (
  <polygon
    points={`0 0, ${size} ${size}, 0 ${size}`}
    transform={` translate(${size + margin}, ${margin}) rotate(45) `}
    fill={color}
    stroke={color}
    strokeWidth="4"
    strokeLinejoin="round"
  />
);
