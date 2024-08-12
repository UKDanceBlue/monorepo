import { Heading, View } from "native-base";

import type { NotificationDeliveryFragment } from "@common/fragments/NotificationScreenGQL";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-mobile";
import type { SectionListProps } from "react-native";

type NotificationSectionHeaderType = NonNullable<
  SectionListProps<
    FragmentType<typeof NotificationDeliveryFragment> | undefined,
    { title: string; data: FragmentType<typeof NotificationDeliveryFragment>[] }
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
