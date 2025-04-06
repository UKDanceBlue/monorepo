import type { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import Svg, { Path } from "react-native-svg";

/**
 * This can never not be the full width of the screen
 */
const BackgroundCutoutBase = ({
  color,
  ...svgProps
}: SvgProps & {
  color?: string;
}) => (
  <Svg viewBox={`0 0 520 520`} {...svgProps}>
    <Path
      d="M0,0 C0,0,0,260,260,260 C520,260,520,0,520,0 H520 V520 H0 Z"
      // @ts-expect-error This is fine
      style={{ fill: color ?? "#00000000" }}
    />
  </Svg>
);

const BackgroundCutout = ({
  color,
  children,
  left,
  right,
  ...svgProps
}: SvgProps & {
  height: number;
  color?: string;
  children: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  if (!svgProps.height || Number.isNaN(Number(svgProps.height))) {
    throw new Error(
      "BackgroundCutout requires a height to be passed in svgProps"
    );
  }
  const svgWidth = svgProps.height;
  const sideWidth = (screenWidth - svgWidth) / 2;

  return (
    <View style={{ display: "flex", flexDirection: "row" }}>
      <View
        style={{
          backgroundColor: color,
          width: sideWidth,
          height: svgWidth,
        }}
        className="flex-row"
      >
        {left}
      </View>
      <BackgroundCutoutBase
        {...svgProps}
        style={{
          // @ts-expect-error This is fine
          ...(svgProps.style ?? {}),
          width: svgWidth,
          height: svgWidth,
        }}
        color={color}
      />
      <View
        style={{
          position: "absolute",
          bottom: svgWidth / 2,
          left: sideWidth,
          right: sideWidth,
          width: svgWidth,
          height: svgWidth,
        }}
      >
        {children}
      </View>
      <View
        style={{
          backgroundColor: color,
          width: sideWidth,
          height: svgWidth,
        }}
        className="flex-row"
      >
        {right}
      </View>
    </View>
  );
};

export default BackgroundCutout;
