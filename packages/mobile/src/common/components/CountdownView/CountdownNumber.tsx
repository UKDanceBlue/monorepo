import { fontSizes } from "@theme/typography";
import { View } from "native-base";
import React from "react";
import { useWindowDimensions } from "react-native";
import { Circle, Svg, Text } from "react-native-svg";

const validUnits = ["sec", "min", "hours", "days", "months", "years"] as const;

export const CountdownNumber = ({
  value,
  total: _total,
  unit,
  amountInRow,
  radius,
}: {
  value: number | undefined;
  total: number | undefined;
  unit: (typeof validUnits)[number];
  amountInRow: number | undefined;
  radius: number | undefined;
}) => {
  const { width, height } = useWindowDimensions();

  // Calculate the width of each component based on the screen width and the number of components in a row
  const canvasWidth = amountInRow ? width / amountInRow : width;
  const maxRadius = canvasWidth / 2;

  if (!radius) {
    radius = maxRadius;
  }

  const strokeWidth = 0.1 * radius;

  if (radius > maxRadius - strokeWidth) {
    radius = maxRadius - strokeWidth;
  }

  const canvasHeight = height / 7;

  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  const fontSizeValue = fontSizes["4xl"] ?? 0;
  const fontSizeUnit = fontSizes.xl;

  const viewBox = `0 0 ${canvasWidth} ${canvasHeight}`;

  return (
    <View height={canvasWidth} width={canvasWidth}>
      <Svg width="100%" height="100%" viewBox={viewBox}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={"#ffc72c"}
          strokeWidth={strokeWidth}
          fill={"#0032dd"}
        />
        <Text // numbers
          x={cx}
          y={cy - fontSizeValue / 2} // Adjust the y-coordinate
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="bodoni-flf-bold"
          fontWeight={"bold"}
          fontSize={fontSizeValue}
          fill={"#ffffff"}
        >
          {value}
        </Text>
        <Text // words
          x={cx}
          y={cy + fontSizeValue / 2} // Adjust the y-coordinate to position the unit below the number
          textAnchor="middle"
          alignmentBaseline="middle"
          fontFamily="bodoni-flf-bold"
          fontSize={fontSizeUnit} // Adjust the font size of the unit
          fill={"#ffffff"}
        >
          {unit}
        </Text>
      </Svg>
    </View>
  );
};
