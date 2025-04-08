import type { ComponentProps } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native";
import type PagerView from "react-native-pager-view";

export function Pager(props: ComponentProps<typeof PagerView>) {
  if (props.orientation === "vertical") {
    return <View {...props} />;
  }
  return (
    <ScrollView
      {...props}
      contentContainerStyle={{ width: "100%" }}
      horizontal
      pagingEnabled
      keyboardDismissMode={props.keyboardDismissMode ?? undefined}
      scrollEnabled={props.scrollEnabled ?? undefined}
      overScrollMode={props.overScrollMode ?? undefined}
    />
  );
}
