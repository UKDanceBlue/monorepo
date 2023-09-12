import { memo } from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */

const DanceBlueRibbon = ({
  svgProps, color
}: { svgProps?: SvgProps; color?: string }) => (
  <Svg
    id="Layer_1"
    x={0}
    y={0}
    viewBox="0 0 248 343"
    {...svgProps}
  >
    <Path
      // @ts-expect-error This works
      style={{ fill: color ?? "#FFC72C" }}
      d="M147.69 67.39c-.09-.26-.17-.44-.17-.44s-.01.18.17.44zM143.85 96.31c-2.18 4.88-7.67 15.77-14.72 29.45 4.62 10.45 9.93 22.3 15.33 34.24 2.96-5.83 15.95-32.06 15.95-46.69 0-16.55-4.88-27.53-7.23-33.28-2-4.97-4.79-10.98-5.49-12.55.78 1.91 3.92 11.32-3.84 28.83zM109.01 164.18c-18.82 35.54-37.99 71.27-37.99 71.27l11.06 39.38 42.17-77.63-15.24-33.02z"
    />
    <Path
      // @ts-expect-error This works
      style={{ fill: color ?? "#FFC72C" }}
      d="M110.92 63.56s-5.75 9.06 1.74 29.45 63.95 143.4 63.95 143.4L163.02 275l-54.45-117.27s-14.55-32.32-13.51-48.79c1.04-16.55 6.62-27.18 9.32-32.76 2.71-5.74 6.54-12.62 6.54-12.62z"
    />
    <Path
      // @ts-expect-error This works
      style={{ fill: color ?? "#FFC72C" }}
      d="M128.08 81.24c6.27 0 12.03 2.26 16.73 6.01 1.22-4.01 1.83-7.75 1.92-11.24.09-4.35-.78-6.97-1.13-7.67-.09-.26-4.7-12.63-17.51-12.63-4.7 0-9.14 1.65-12.89 4.53-.7 1.13-3.83 6.44-4.01 12.28-.09 4.01.44 8.54 1.74 13.42 4.35-2.96 9.58-4.7 15.15-4.7z"
    />
  </Svg>
);

export default memo(DanceBlueRibbon);
