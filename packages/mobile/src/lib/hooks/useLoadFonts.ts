import { useFonts } from "expo-font";

import BodoniFlfBoldFont from "~/assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold.ttf";
import BodoniFlfBoldItalicFont from "~/assets/fonts/bodoni-flf-font/Bodoni-FLF-Bold-Italic.ttf";
import BodoniFlfItalicFont from "~/assets/fonts/bodoni-flf-font/Bodoni-FLF-Italic.ttf";
import BodoniFlfRomanFont from "~/assets/fonts/bodoni-flf-font/Bodoni-FLF-Roman.ttf";
import OpenSansCondensedBoldFont from "~/assets/fonts/opensans-condensed/OpenSans-Condensed-Bold.ttf";
import OpenSansCondensedLightFont from "~/assets/fonts/opensans-condensed/OpenSans-Condensed-Light.ttf";
import OpenSansCondensedLightItalicFont from "~/assets/fonts/opensans-condensed/OpenSans-Condensed-Light-Italic.ttf";

export default function useLoadFonts() {
  return useFonts({
    "bodoni-flf-bold": BodoniFlfBoldFont,
    "bodoni-flf-bold-italic": BodoniFlfBoldItalicFont,
    "bodoni-flf-italic": BodoniFlfItalicFont,
    "bodoni-flf-roman": BodoniFlfRomanFont,
    "opensans-condensed-bold": OpenSansCondensedBoldFont,
    "opensans-condensed-light": OpenSansCondensedLightFont,
    "opensans-condensed-light-italic": OpenSansCondensedLightItalicFont,
  });
}
