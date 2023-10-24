import { Heading, View } from "native-base";
import type { SectionListProps } from "react-native";

import type { NotificationListDataEntry } from "./NotificationScreen";

type NotificationSectionHeaderType = NonNullable<
  SectionListProps<
    NotificationListDataEntry | undefined,
    { title: string; data: (NotificationListDataEntry | undefined)[] }
  >["renderSectionHeader"]
>;
export const NotificationSectionHeader: NotificationSectionHeaderType = ({
  section: { title },
}: Parameters<NotificationSectionHeaderType>[0]) => {
  return (
    <View backgroundColor="#fff">
      <Heading size="md" p={2}>
        {title}
      </Heading>
    </View>
  );
};
