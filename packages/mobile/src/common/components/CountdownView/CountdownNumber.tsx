import { View } from "native-base";
import React from "react";
import { useWindowDimensions } from "react-native";
import { Circle, Svg } from "react-native-svg";

const validUnits = ["sec", "min", "hours", "days", "months", "years"] as const;

export const CountdownNumber = ({
  value,
  total,
  unit,
  radius,
}: {
  value: number | undefined;
  total: number | undefined;
  unit: (typeof validUnits)[number];
  radius: number | undefined;
}) => {
  const {width} = useWindowDimensions();
  const cx = width/3;
  const cy = cx;

    return (
      <View>
        <Svg style={{position: 'absolute'}}>
          <Circle
            cx={cx}
            cy={cy}
            r={radius}
            stroke={'#000'}
            strokeWidth={30}
          />
        </Svg>
      </View>
    );
};
