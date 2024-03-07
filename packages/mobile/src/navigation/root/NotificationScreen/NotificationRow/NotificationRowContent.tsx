import { useThemeFonts } from "@common/customHooks";
import {
  NotificationDeliveryFragment,
  NotificationFragment,
} from "@common/fragments/NotificationScreenGQL";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import { getFragmentData } from "@ukdanceblue/common/dist/graphql-client-public";
import { isEqual } from "lodash";
import { DateTime } from "luxon";
import {
  HStack,
  Heading,
  Skeleton,
  Text,
  VStack,
  View,
  useTheme,
} from "native-base";
import { memo } from "react";
import { useWindowDimensions } from "react-native";

import DanceBlueRibbon from "../../../../../assets/svgs/DBRibbon";

const NonMemoizedNotificationRowContent = ({
  loading,
  notification,
  unread,
}: {
  loading: boolean;
  notification?:
    | FragmentType<typeof NotificationDeliveryFragment>
    | undefined
    | null;
  unread: boolean;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { sizes, fontSizes } = useTheme();

  const { mono } = useThemeFonts();

  const deliveryFragmentData = getFragmentData(
    NotificationDeliveryFragment,
    notification
  );
  const notificationFragmentData = getFragmentData(
    NotificationFragment,
    deliveryFragmentData?.notification
  );

  const notificationTime =
    deliveryFragmentData?.sentAt == null
      ? null
      : typeof deliveryFragmentData.sentAt === "string"
      ? DateTime.fromISO(deliveryFragmentData.sentAt)
      : DateTime.fromJSDate(deliveryFragmentData.sentAt);

  return (
    <>
      <HStack alignItems="center" flex={1}>
        <View
          backgroundColor={unread ? "primary.600" : "primary.600"}
          borderRadius="50"
          marginRight="3"
          shadow="3"
          style={{ shadowOpacity: unread ? 0.6 : 0.6 }}
          flex={0}
        >
          {/* TODO: FIX AND CHANGE TO DBLOGO CONDENSED
          <DBLogoCondensed svgProps={{ width: screenWidth*0.5, height: screenWidth*0.5 }} letterColor="#fff"/>
        */}
          <DanceBlueRibbon
            svgProps={{ width: screenWidth * 0.12, height: screenWidth * 0.12 }}
          />
        </View>
        <VStack flex={1}>
          <View
            flexDirection="row"
            justifyContent="space-between"
            mb="2"
            flex={1}
          >
            <Skeleton.Text
              isLoaded={!loading}
              lines={1}
              width={(screenWidth / 6) * 3}
            >
              <Heading size="sm" flex={5} color="primary.600">
                {notificationFragmentData?.title}
              </Heading>
            </Skeleton.Text>
            <Skeleton.Text
              isLoaded={!loading}
              lines={1}
              width={(screenWidth / 6) * 2}
              textAlign="end"
            >
              <Text flex={1} fontFamily={mono} color="primary.600">
                {notificationTime?.toLocaleString(DateTime.TIME_SIMPLE)}
              </Text>
            </Skeleton.Text>
          </View>
          <Skeleton.Text
            isLoaded={!loading}
            width={screenWidth - sizes[4] * 3}
            flex={1}
          >
            <Text>
              <Text fontFamily={mono} fontSize={fontSizes.lg}>
                {notificationFragmentData?.body}
              </Text>
            </Text>
          </Skeleton.Text>
        </VStack>
      </HStack>
    </>
  );
};

const NotificationRowContent = memo(
  NonMemoizedNotificationRowContent,
  (prevProps, nextProps) => {
    return (
      prevProps.loading === nextProps.loading &&
      isEqual(prevProps.notification, nextProps.notification)
    );
  }
);
NotificationRowContent.displayName = "NotificationRowContent";
export { NotificationRowContent };
