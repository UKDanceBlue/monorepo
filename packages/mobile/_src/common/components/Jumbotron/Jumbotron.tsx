import { FontAwesome5 } from "@expo/vector-icons";
import type { Icon as IconType } from "@expo/vector-icons/build/createIconSet";
import { Icon, Text, View } from "native-base";

import { useThemeColors } from "../../customHooks";

const JumbotronIcon = <IconFontName extends string, IconName extends string>({
  icon,
  iconColor,
  iconType,
  iconSize = 36,
}: {
  icon: IconName;
  iconColor: string;
  iconType: IconType<IconName, IconFontName>;
  iconSize: number;
}) => {
  const colors = useThemeColors();
  if (iconType === FontAwesome5) {
    let cssIconColor = iconColor;
    if (iconColor.includes(".")) {
      // @ts-expect-error We should probably fix this, but it's not a big deal
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      cssIconColor = colors[iconColor.split(".")[0]]?.[iconColor.split(".")[1]];
      if (!cssIconColor) {
        cssIconColor = iconColor;
      }
    }
    return <FontAwesome5 name={icon} size={iconSize} color={cssIconColor} />;
  } else {
    return <Icon as={iconType} name={icon} color={iconColor} size={iconSize} />;
  }
};

const Jumbotron = <IconFontName extends string, IconName extends string>({
  icon,
  iconColor,
  iconType,
  title,
  subTitle,
  bodyText,
  iconSize = 36,
}: {
  icon?: IconName;
  iconColor?: string;
  iconType?: IconType<IconName, IconFontName>;
  title?: string;
  subTitle?: string;
  bodyText?: string;
  iconSize?: number;
}) => {
  return (
    <View
      margin={3}
      backgroundColor={"primary.100"}
      padding={4}
      paddingTop={6}
      alignItems="center"
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
    >
      {icon && iconType && iconColor && (
        <JumbotronIcon
          icon={icon}
          iconColor={iconColor}
          iconType={iconType}
          iconSize={iconSize}
        />
      )}
      {title && (
        <Text
          textAlign="center"
          fontSize="2xl"
          color="primary.600"
          fontFamily="headingBold"
          bold
        >
          {title}
        </Text>
      )}
      {subTitle && (
        <Text textAlign="center" fontSize="lg" color="primary.600" bold>
          {subTitle}
        </Text>
      )}
      {bodyText && (
        <Text
          textAlign="center"
          fontSize="md"
          color="primary.600"
          fontFamily="mono"
        >
          {bodyText}
        </Text>
      )}
    </View>
  );
};

export default Jumbotron;
