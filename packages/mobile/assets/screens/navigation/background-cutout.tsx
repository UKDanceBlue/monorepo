import { Box, HStack } from "native-base";
import { useWindowDimensions } from "react-native";
import Svg, { G, Path, SvgProps } from "react-native-svg";

const ratio= { x: 1920, y: 440 };
/**
 * This can never not be the full width of the screen
 */
const BackgroundCutoutBase = ({
  svgProps, color
}: { svgProps?: SvgProps; color?: string }) => (
  <Svg
    viewBox={`0 0 ${ratio.x} ${ratio.y}`}
    // @ts-expect-error This is fine
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    style={{ padding: 0, margin: 0, ...(svgProps?.style ?? {}) }}
    {...svgProps}
  >
    {/* @ts-expect-error This is fine */}
    <G data-name="Layer 2">
      <Path
        d="M 0 0 H 700 C 700 0 700 280 960 280 C 1220 280 1220 0 1220 0 H 1920 V 440 H 0 Z"
        // @ts-expect-error This is fine
        style={{ fill: color ?? "#ededed" }}
        data-name="Layer 1" />
    </G>
  </Svg>
);

const BackgroundCutout = ({
  color, svgProps
}: { svgProps?: SvgProps; color: string }) => {
  const { width: screenWidth } = useWindowDimensions();
  if (!svgProps?.height || isNaN(Number(svgProps.height))) {
    throw new Error("BackgroundCutout requires a height to be passed in svgProps");
  }
  const svgWidth = Number(svgProps.height) * (ratio.x / ratio.y);
  const sideWidth = (screenWidth - svgWidth) / 2;
  return (
    <HStack>
      <Box
        position="absolute"
        left={0}
        minWidth={sideWidth * 1.1}
        minHeight={svgProps.height}
        bg={color}
        margin={0} />
      <BackgroundCutoutBase
        svgProps={{
          ...svgProps,
          width: svgWidth,
          height: svgProps.height,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          style: {
          // @ts-expect-error This is fine
            ...(svgProps.style ?? {}),
            marginLeft: sideWidth
          }
        }}
        color={color} />
      <Box
        position="absolute"
        right={0}
        minWidth={sideWidth * 1.1}
        minHeight={svgProps.height}
        bg={color}
        margin={0} />
    </HStack>
  );
};

export default BackgroundCutout;
