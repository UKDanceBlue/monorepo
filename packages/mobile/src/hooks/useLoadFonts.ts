import { useFonts } from "expo-font";

import BoldoniFlfBoldFont from "@/assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold.ttf";
import BoldoniFlfBoldItalicFont from "@/assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold-Italic.ttf";
import BoldoniFlfItalicFont from "@/assets/fonts/bodoni-flf-font/Bodoni-FLF-Italic.ttf";
import BoldoniFlfRomanFont from "@/assets/fonts/bodoni-flf-font/Bodoni-FLF-Roman.ttf";
import OpenSansCondensedBoldFont from "@/assets/fonts/opensans-condensed/OpenSans-Condensed-Bold.ttf";
import OpenSansCondensedLightFont from "@/assets/fonts/opensans-condensed/OpenSans-Condensed-Light.ttf";
import OpenSansCondensedLightItalicFont from "@/assets/fonts/opensans-condensed/OpenSans-Condensed-Light-Italic.ttf";

export default function useLoadFonts() {
  return useFonts({
    "bodoni-flf-bold": BoldoniFlfBoldFont,
    "bodoni-flf-bold-italic": BoldoniFlfBoldItalicFont,
    "bodoni-flf-italic": BoldoniFlfItalicFont,
    "bodoni-flf-roman": BoldoniFlfRomanFont,
    "opensans-condensed-bold": OpenSansCondensedBoldFont,
    "opensans-condensed-light": OpenSansCondensedLightFont,
    "opensans-condensed-light-italic": OpenSansCondensedLightItalicFont,
  });
}
