import random from "lodash/random";
import type { ImageSourcePropType } from "react-native";

import Blu from "@/assets/screens/login-modal/blu.jpg";
import DanceBlueU3 from "@/assets/screens/login-modal/DanceBlueU-3.jpg";
import DanceBlueU7 from "@/assets/screens/login-modal/DanceBlueU-7.jpg";
import DanceBlueU8 from "@/assets/screens/login-modal/DanceBlueU-8.jpg";
import DanceBlueU13 from "@/assets/screens/login-modal/DanceBlueU-13.jpg";
import DanceBlueU16 from "@/assets/screens/login-modal/DanceBlueU-16.jpg";
import DanceBlueU17 from "@/assets/screens/login-modal/DanceBlueU-17.jpg";
import DBLetters5k from "@/assets/screens/login-modal/review/5k2023-299.jpg";
import CutsForTheClinic from "@/assets/screens/login-modal/review/Cutsfortheclinic-94.jpg";
import Stickers from "@/assets/screens/login-modal/review/DBCatapalooza-55.jpg";
import Running5k from "@/assets/screens/login-modal/review/DSC_0324.jpg";
import DBUMerch from "@/assets/screens/login-modal/review/LDBU.jpg";
import DBUCornHole from "@/assets/screens/login-modal/review/LDBU-19.jpg";
import DBUChalkBoard from "@/assets/screens/login-modal/review/LDBU-23.jpg";

const splashLoginBackgrounds = [
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

export function getLoginBackground(): ImageSourcePropType {
  const index = random(0, splashLoginBackgrounds.length - 1);
  return splashLoginBackgrounds[index];
}
