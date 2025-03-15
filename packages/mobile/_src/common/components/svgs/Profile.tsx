import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style */

const ProfileIcon = ({
  svgProps,
  color,
}: {
  svgProps?: SvgProps;
  color?: string;
}) => (
  <Svg id="Layer_1" x={0} y={0} viewBox="0 0 248 343" {...svgProps}>
    <Path
      // @ts-expect-error This works
      style={{ fill: color ?? "#0032A0" }}
      d="M101.95 197.11c15.02-.01 30.03-.01 45.05-.02 5.59 0 11.19.05 16.78-.01 16.39-.16 31.27 11.25 35.16 27.72.71 3.02 1 6.1 1.04 9.19.04 3.31.01 6.62.01 9.94 0 .29.01.59-.01.88-.12 1.56-.8 2.23-2.36 2.31-.51.02-1.03.01-1.55.01H71.75c-.74 0-1.48.02-2.2-.06-.85-.09-1.49-.72-1.61-1.57-.08-.58-.07-1.17-.07-1.76-.01-3.53-.01-7.07-.01-10.6.02-11.22 4.45-20.4 12.91-27.65 5.83-4.99 12.67-7.63 20.28-8.33.32.21.61.2.9-.05zM95.7 153.18c-.39-18.92 14.9-37.25 36.64-38.19 20.66-.89 39.62 15.27 39.76 38.23.13 20.92-16.75 37.62-37.14 38.19-22.07.63-39.48-17.39-39.26-38.23z"
    />
  </Svg>
);

export default ProfileIcon;
