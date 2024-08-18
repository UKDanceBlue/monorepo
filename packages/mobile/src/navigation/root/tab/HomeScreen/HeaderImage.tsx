import { Image, ZStack } from "native-base";

import marathon from "../../../../../assets/screens/home/marathon.jpg";

// import dbLogo from "../../../../../assets/logo/big-words.png";
// import ribbon from "../../../../../assets/screens/home/2020-ribbon.jpg";

/**
 * A header image container used on the home screen
 */
const HeaderImage = () => (
  <ZStack height="100%" width="full" m={0}>
    <Image
      source={marathon}
      size="full"
      resizeMode="cover"
      // blurRadius={10}
      alt="Picture of DB Marathon"
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
