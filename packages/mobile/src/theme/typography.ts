import type { Theme } from "native-base";

export const letterSpacings: Partial<Theme["letterSpacings"]> = {
  "xs": "-0.05em",
  "sm": "-0.025em",
  "md": 0,
  "lg": "0.025em",
  "xl": "0.05em",
  "2xl": "0.1em",
} as const;
export const lineHeights: Partial<Theme["lineHeights"]> = {
  "2xs": "1em",
  "xs": "1.125em",
  "sm": "1.25em",
  "md": "1.375em",
  "lg": "1.5em",
  "xl": "1.75em",
  "2xl": "2em",
  "3xl": "2.5em",
  "4xl": "3em",
  "5xl": "4em",
} as const;
export const fontWeights: Partial<Theme["fontWeights"]> = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
  extraBlack: 950,
} as const;

export const fontConfig: Partial<Theme["fontConfig"]> = {
  "bodoni-flf": {
    100: {
      normal: "bodoni-flf-roman",
      italic: "bodoni-flf-italic",
    },
    200: {
      normal: "bodoni-flf-roman",
      italic: "bodoni-flf-italic",
    },
    300: {
      normal: "bodoni-flf-roman",
      italic: "bodoni-flf-italic",
    },
    400: {
      normal: "bodoni-flf-roman",
      italic: "bodoni-flf-italic",
    },
    500: {
      normal: "bodoni-flf-roman",
      italic: "bodoni-flf-italic",
    },
    600: {
      normal: "bodoni-flf-roman",
      italic: "bodoni-flf-italic",
    },
    700: {
      normal: "bodoni-flf-bold",
      italic: "bodoni-flf-bold-italic",
    },
    800: {
      normal: "bodoni-flf-bold",
      italic: "bodoni-flf-bold-italic",
    },
    900: {
      normal: "bodoni-flf-bold",
      italic: "bodoni-flf-bold-italic",
    },
  },
  "opensans-condensed": {
    100: {
      normal: "opensans-condensed-light",
      italic: "opensans-condensed-light-italic",
    },
    200: {
      normal: "opensans-condensed-light",
      italic: "opensans-condensed-light-italic",
    },
    300: {
      normal: "opensans-condensed-light",
      italic: "opensans-condensed-light-italic",
    },
    400: {
      normal: "opensans-condensed-light",
      italic: "opensans-condensed-light-italic",
    },
    500: {
      normal: "opensans-condensed-light",
      italic: "opensans-condensed-light-italic",
    },
    600: {
      normal: "opensans-condensed-light",
      italic: "opensans-condensed-light-italic",
    },
    700: {
      normal: "opensans-condensed-bold",
      italic: "opensans-condensed-light-italic",
    },
    800: {
      normal: "opensans-condensed-bold",
      italic: "opensans-condensed-light-italic",
    },
    900: {
      normal: "opensans-condensed-bold",
      italic: "opensans-condensed-light-italic",
    },
  },
} as const;

export const fonts = {
  headingBold: "bodoni-flf-bold",
  heading: "bodoni-flf-roman",
  body: "opensans-condensed-bold",
  mono: "opensans-condensed-light",
} as const;

export const fontSizes: Partial<Theme["fontSizes"]> = {
  "2xs": 10,
  "xs": 12,
  "sm": 14,
  "md": 16,
  "lg": 18,
  "xl": 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
  "9xl": 128,
} as const;
export const opacity: Partial<Theme["opacity"]> = {
  0: 0,
  5: 0.05,
  10: 0.1,
  20: 0.2,
  25: 0.25,
  30: 0.3,
  40: 0.4,
  50: 0.5,
  60: 0.6,
  70: 0.7,
  75: 0.75,
  80: 0.8,
  90: 0.9,
  95: 0.95,
  100: 1,
} as const;
export const shadows: Partial<Theme["shadows"]> = {
  0: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,
    elevation: 1,
  },
  1: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  3: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  4: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  5: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  6: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  7: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  8: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  9: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
} as const;
