import { Icon as IconType } from "@expo/vector-icons/build/createIconSet";
import { Box, Icon, Text } from "native-base";
import { ImageBackground, ImageSourcePropType } from "react-native";

import { useThemeColors } from "../../customHooks";

/** @deprecated TODO - Merge with Jumbotron */
const JumbotronGeometric = <PossibleIconNames extends string, IconFontName extends string, IconName extends PossibleIconNames>({
  icon, iconType, title, text, bgColor="blue"
}: { icon?:IconName; iconType?: IconType<PossibleIconNames, IconFontName>; title:string; text?:string; bgColor?:string }) => {
  const {
    primary,
    secondary,
  } = useThemeColors();

  function validateBGColor() {
    switch (bgColor) {
    case "white": return require("../../../../assets/bg-geometric/white.png") as ImageSourcePropType;
    case "blue": return require("../../../../assets/bg-geometric/blue.png") as ImageSourcePropType;
    case "lightblue": return require("../../../../assets/bg-geometric/lightblue.png") as ImageSourcePropType;
    default: return require("../../../../assets/bg-geometric/blue.png") as ImageSourcePropType;
    }
  }

  function iconColor() {
    switch (bgColor) {
    case "white": return primary[600];
    case "blue": return secondary[200];
    case "lightblue": return primary[600];
    default: return secondary[200];
    }
  }

  function fontColor(loc:string) {
    switch (loc){
    case "title":
      switch (bgColor) {
      case "white": return primary[600];
      case "blue": return secondary[200];
      case "lightblue": return primary[600];
      default: return secondary[200];
      }
    default:
      switch (bgColor) {
      case "white": return primary[600];
      case "blue": return "white";
      case "lightblue": return primary[600];
      default: return "white";
      }
    }
  }

  return (
    <ImageBackground source={validateBGColor()} resizeMode="cover">
      <Box
        display="flex"
        minHeight={200}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        {icon && (<Icon
          flex={1}
          as={iconType}
          name={icon}
          color={iconColor()}/>)}
        {title && (
          <Text
            fontFamily="headingBold"
            color={fontColor("title")}
            fontSize={30}
            marginBottom={3}
          >{title}</Text>
        )}
        {text && (
          <Text
            fontFamily="mono"
            color={fontColor("caption")}
            fontSize={18}
          >{text}</Text>
        )}
      </Box>
    </ImageBackground>
  );
};

export default JumbotronGeometric;
