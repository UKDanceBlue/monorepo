import random from "lodash/random";
import type { ImageSourcePropType } from "react-native";

const DBLetters5k =
  require("../../../../assets/screens/login-modal/review/5k2023-299.jpg") as ImageSourcePropType;
const CutsForTheClinic =
  require("../../../../assets/screens/login-modal/review/Cutsfortheclinic-94.jpg") as ImageSourcePropType;
const Stickers =
  require("../../../../assets/screens/login-modal/review/DBCatapalooza-55.jpg") as ImageSourcePropType;
const Running5k =
  require("../../../../assets/screens/login-modal/review/DSC_0324.jpg") as ImageSourcePropType;
const DBUCornHole =
  require("../../../../assets/screens/login-modal/review/LDBU-19.jpg") as ImageSourcePropType;
const DBUChalkBoard =
  require("../../../../assets/screens/login-modal/review/LDBU-23.jpg") as ImageSourcePropType;
  const DanceBlueU13 =
  require("../../../../assets/screens/login-modal/DanceBlueU-13.jpg") as ImageSourcePropType;
const DanceBlueU16 =
  require("../../../../assets/screens/login-modal/DanceBlueU-16.jpg") as ImageSourcePropType;
const DanceBlueU17 =
  require("../../../../assets/screens/login-modal/DanceBlueU-17.jpg") as ImageSourcePropType;
const DanceBlueU3 =
  require("../../../../assets/screens/login-modal/DanceBlueU-3.jpg") as ImageSourcePropType;
const DanceBlueU7 =
  require("../../../../assets/screens/login-modal/DanceBlueU-7.jpg") as ImageSourcePropType;
const DanceBlueU8 =
  require("../../../../assets/screens/login-modal/DanceBlueU-8.jpg") as ImageSourcePropType;
const Blu =
  require("../../../../assets/screens/login-modal/blu.jpg") as ImageSourcePropType;
const DBUMerch =
  require("../../../../assets/screens/login-modal/review/LDBU.jpg") as ImageSourcePropType;

const SplashLoginBackgrounds: ImageSourcePropType[] = [
  Stickers,
  CutsForTheClinic,
  DBLetters5k,
  Blu,
  DanceBlueU3,
  DanceBlueU7,
  DanceBlueU8,
  DanceBlueU13,
  DanceBlueU16,
  DanceBlueU17,
  Running5k,
  DBUMerch,
  DBUChalkBoard,
  DBUCornHole,
];

export function getRandomSplashLoginBackground(): ImageSourcePropType {
  const index = random(0, SplashLoginBackgrounds.length - 1);
  return SplashLoginBackgrounds[index];
}

export default SplashLoginBackgrounds;
