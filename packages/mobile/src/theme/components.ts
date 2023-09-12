import type { ComponentTheme, Theme } from "native-base/src/theme";
import originalComponentThemes from "native-base/src/theme/components";

const {
  Button: originalButtonTheme,
  Text: originalTextTheme,
  View: originalViewTheme,
  VStack: originalVStackTheme,
} = originalComponentThemes;

type BaseStyleProp<T extends { baseStyle: BaseStyle }, BaseStyle extends (arg: Param) => unknown = T["baseStyle"], Param = Parameters<BaseStyle>[0]> = Param;

// We are going to want a ton of component presets here, take a look around the project and look for frequently repeated styles
export const components: Partial<Record<keyof Theme["components"], ComponentTheme>> = {
  Button: {
    baseStyle: (props: BaseStyleProp<typeof originalButtonTheme>) => ({
      ...originalButtonTheme.baseStyle(props) as ComponentTheme["baseStyle"],
      borderRadius: 5,
      margin: "1",
      padding: "3",
    }),
  },
  Text: {
    defaultProps: () => ({ fontSize: 15 }),
    baseStyle: originalTextTheme.baseStyle,
    variants: {
      "card-title": {
        color: "primary.600",
        fontSize: "xl",
        fontWeight: "bold",
        textAlign: "center",
      },
      "card-text": {
        color: "primary.600",
        fontFamily: "body",
        padding: "1em",
      },
      "error-message": {
        color: "red.500",
        fontSize: "md",
        fontWeight: "bold",
        textAlign: "center",
        margin: "1em",
      }
    },
  },
  View: {
    defaultProps: () => ({ }),
    baseStyle: originalViewTheme.baseStyle,
    variants: {
      "card-title-box": {
        backgroundColor: "primary.100",
        paddingY: "2",
      },
    },
  },
  VStack: {
    defaultProps: () => ({ }),
    baseStyle: originalVStackTheme.baseStyle,
    variants: {
      "card": {
        margin: "15",
        borderWidth: "1",
        borderColor: "light.100",
      },
    },
  },
} as const;
