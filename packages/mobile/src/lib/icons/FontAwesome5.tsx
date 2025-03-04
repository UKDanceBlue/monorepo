import type { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import type { Icon } from "@expo/vector-icons/build/createIconSet";

import { iconWithClassName } from "./iconWithClassName";

iconWithClassName(FontAwesome5 as typeof FontAwesome);

const FA5 = FontAwesome5 as Icon<string, string>;

export { FA5 as FontAwesome5 };
