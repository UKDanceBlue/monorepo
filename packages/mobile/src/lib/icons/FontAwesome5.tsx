import type { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import { iconWithClassName } from "./iconWithClassName";

iconWithClassName(FontAwesome5 as typeof FontAwesome);

const FA5 = FontAwesome5 as typeof FontAwesome;

export { FA5 as FontAwesome5 };
