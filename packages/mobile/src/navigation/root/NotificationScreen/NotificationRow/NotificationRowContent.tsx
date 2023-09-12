import { Entypo } from "@expo/vector-icons";
import { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { isEqual } from "lodash";
import { DateTime } from "luxon";
import { HStack, Heading, Icon, Skeleton, Text, VStack, View, useTheme } from "native-base";
import { memo } from "react";
import { useWindowDimensions } from "react-native";

import DBLogoCondensed from "../../../../../assets/svgs/DBLogoCondensed";
import DanceBlueRibbon from "../../../../../assets/svgs/DBRibbon";
import { useThemeFonts } from "../../../../common/customHooks";

const NonMemoizedNotificationRowContent = ({
  loading, notification, unread
}: { loading: boolean; notification: FirestoreNotification | undefined; unread: boolean }) => {
  const { width: screenWidth } = useWindowDimensions();
  const {
    sizes, fontSizes
  } = useTheme();

  const {
    body, mono
  } = useThemeFonts();

  return (<>
    <HStack alignItems="center" maxWidth="85%">
      <View
        backgroundColor={unread ? "primary.600" : "primary.600"}
        borderRadius="50"
        marginRight="3"
        shadow="3"
        style={{ shadowOpacity: unread ? 0.6 : 0.6 }}>
        {/* TODO: FIX AND CHANGE TO DBLOGO CONDENSED
          <DBLogoCondensed svgProps={{ width: screenWidth*0.5, height: screenWidth*0.5 }} letterColor="#fff"/>
        */}
        <DanceBlueRibbon svgProps={{ width: screenWidth*0.12, height: screenWidth*0.12 }}/>
      </View>
      <VStack>
        <View flexDirection="row" justifyContent="space-between" mb="2">
          <Skeleton.Text
            isLoaded={!loading}
            lines={1}
            width={(screenWidth / 6) * 3}
          >
            <Heading
              size="sm"
              flex={5}
              color="primary.600">{notification?.title}</Heading>
          </Skeleton.Text>
          <Skeleton.Text
            isLoaded={!loading}
            lines={1}
            width={(screenWidth / 6) * 2}
            textAlign="end"
          >
            <Text
              flex={1}
              fontFamily={mono}
              color="primary.600">
              {
                notification && DateTime.fromISO(notification.sendTime).toLocaleString(DateTime.TIME_SIMPLE)
              }
            </Text>
          </Skeleton.Text>
        </View>
        <Skeleton.Text
          isLoaded={!loading}
          width={screenWidth - (sizes[4] * 3)}
        >
          <Text>
            <Text fontFamily={mono} fontSize={fontSizes.lg}>{notification?.body}</Text>
          </Text>
        </Skeleton.Text>
      </VStack>
    </HStack>
  </>);
};

const NotificationRowContent = memo(
  NonMemoizedNotificationRowContent,
  (prevProps, nextProps) => {
    return prevProps.loading === nextProps.loading && isEqual(prevProps.notification, nextProps.notification);
  }
);
NotificationRowContent.displayName = "NotificationRowContent";
export { NotificationRowContent };
