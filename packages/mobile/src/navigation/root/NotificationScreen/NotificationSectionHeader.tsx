import { Heading, View } from "native-base";
import type { SectionListProps } from "react-native";

import type { NotificationDeliveryFragment } from "@/common/fragments/NotificationScreenGQL";
import type { FragmentOf } from "@/graphql/index";

type NotificationSectionHeaderType = NonNullable<
  SectionListProps<
    FragmentOf<typeof NotificationDeliveryFragment> | undefined,
    { title: string; data: FragmentOf<typeof NotificationDeliveryFragment>[] }
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
