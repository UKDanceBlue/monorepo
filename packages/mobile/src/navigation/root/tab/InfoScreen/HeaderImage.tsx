import CutsForTheClinic from "../../../../../assets/screens/info/Cutsfortheclinic.jpg";

import { Image, ZStack } from "native-base";

// import dbLogo from "../../../../../assets/logo/big-words.png";
// import ribbon from "../../../../../assets/screens/home/2020-ribbon.jpg";
/**
 * A header image container used on the home screen
 */
const HeaderImage = () => (
  <ZStack height="100%" width="full" m={0}>
    <Image
      source={CutsForTheClinic}
      size="full"
      resizeMode="cover"
      // blurRadius={10}
      alt="Picture of Cuts for the Clinic"
    />
    {/* <Box
      style={{ backgroundColor: "#ffffff55" }}
      width="full"
      height="full" />
    <Image
      source={dbLogo}
      size="full"
      resizeMode="contain"
      alt="DanceBlue Logo" />
*/}
  </ZStack>
);

export default HeaderImage;
