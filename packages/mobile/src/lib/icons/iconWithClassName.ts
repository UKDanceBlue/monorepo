import type { Icon } from "@expo/vector-icons/build/createIconSet";
import { cssInterop } from "nativewind";

export function iconWithClassName<G extends string, FN extends string>(
  icon: Icon<FN, G>
) {
  cssInterop(icon, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        width: "size",
        height: "size",
      },
    },
  });
}
