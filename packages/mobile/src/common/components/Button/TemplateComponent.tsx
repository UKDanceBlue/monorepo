// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck This file is currently unused
import { Text, useTheme, View } from "native-base";

import { useThemeColors, useThemeFonts } from "../../customHooks";

const TemplateComponent = ({ param }: { param: string }) => {
  const themes = useTheme();
  const {
    primary, // Standard is 600, light background is 100
    secondary, // Standard is 400
    tertiary, // Standard is 500
    success,
    warning,
    error,
    danger,
    blue,
  } = useThemeColors();
  const { heading, body, mono } = useThemeFonts();

  return (
    <View>
      <Text bg={primary[700]} color="#fff" fontFamily={body}>
        hi {param} {"<3"}
      </Text>
    </View>
  );
};

export default TemplateComponent;
