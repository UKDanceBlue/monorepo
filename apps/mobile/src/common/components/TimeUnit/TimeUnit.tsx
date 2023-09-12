import { Text, View } from "native-base";
import { useWindowDimensions } from "react-native";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const validUnits = [
  "sec", "min", "hours", "days", "months", "years"
] as const;

/**
 * A label for a unit of time
 * @param props The react props
 * @param props.value The value of time
 * @param props.unit The unit of time (plural)
 */
const TimeUnit = ({
  value,
  unit,
}: {
  value: number | undefined;
  unit: typeof validUnits[number];
}) => {
  const {
    headingBold, body
  } = useThemeFonts();
  const { fontScale } = useWindowDimensions();
  const { primary } = useThemeColors();

  if (!validUnits.includes(unit)) {
    throw new Error(`Invalid unit: ${unit}`);
  }

  return (
    <View
      bgColor={`${primary[700]}BD`}
      marginX={2}
      style={{ alignItems: "center", paddingLeft: 7, paddingRight: 7, flex: 1 }}
      minWidth={30*fontScale}>
      <Text
        color="secondary.400"
        fontSize="3xl"
        fontFamily={headingBold}
        flex={1}
        minHeight={fontScale*40}>
        {Math.max(0, value ?? 0)}
      </Text>
      <Text
        color="secondary.400"
        fontSize="xl"
        fontFamily={body}
        flex={1}
        minHeight={fontScale*30}>
        {unit}
      </Text>
    </View>
  );
};

export default TimeUnit;
