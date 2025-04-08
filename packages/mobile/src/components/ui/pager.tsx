import type { ComponentProps } from "react";
import PagerView from "react-native-pager-view";

export function Pager(props: ComponentProps<typeof PagerView>) {
  return <PagerView {...props} orientation="horizontal" />;
}
