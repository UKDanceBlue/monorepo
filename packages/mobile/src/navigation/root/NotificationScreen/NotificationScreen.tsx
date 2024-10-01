import JumbotronGeometric from "@common/components/JumbotronGeometric";
import { NotificationDeliveryFragment } from "@common/fragments/NotificationScreenGQL";
import { Logger } from "@common/logger/Logger";
import { universalCatch } from "@common/logging";
import type { FragmentType } from "@graphql/index.js";
import { getFragmentData } from "@graphql/index.js";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Button, SectionList, Text, useTheme, View } from "native-base";
import { useEffect, useMemo } from "react";
import { RefreshControl } from "react-native";

import { useDeviceData, useLoading } from "../../../context";
import { NotificationRow } from "./NotificationRow";
import { NotificationSectionHeader } from "./NotificationSectionHeader";
import { useLoadNotifications } from "./refresh";

/**
 * Component for "Profile" screen in main navigation
 */
function NotificationScreen() {
  const { getsNotifications: notificationPermissionsGranted } = useDeviceData();

  const [, , { UserDataProvider: isUserDataLoading }] = useLoading();

  const theme = useTheme();

  const {
    notifications,
    refreshNotifications,
    loadMoreNotifications,
    loading: notificationsLoading,
  } = useLoadNotifications();
  const isAnyLoading = notificationsLoading || isUserDataLoading;

  const sections = useMemo(() => {
    const sections: Partial<
      Record<string, FragmentType<typeof NotificationDeliveryFragment>[]>
    > = {};

    for (const notification of notifications ?? []) {
      const delivery = getFragmentData(
        NotificationDeliveryFragment,
        notification
      );
      let dateString = "";
      if (delivery.sentAt != null) {
        const date = dateTimeFromSomething(delivery.sentAt);
        dateString = date.toLocaleString(DateTime.DATE_MED);
      }

      if (sections[dateString] == null) {
        sections[dateString] = [];
      }

      sections[dateString]?.push(notification);
    }

    const sectionsArray: {
      title: string;
      data: FragmentType<typeof NotificationDeliveryFragment>[];
    }[] = [];

    for (const [title, data] of Object.entries(sections)) {
      if (data != null) {
        sectionsArray.push({ title, data });
      }
    }

    return sectionsArray;
  }, [notifications]);

  // Clear badge count when navigating to this screen
  useEffect(() => {
    setBadgeCountAsync(0).catch((error: unknown) => {
      Logger.error("Failed to clear badge count", { error });
    });
  }, []);

  if (!notificationPermissionsGranted) {
    return (
      <View>
        <JumbotronGeometric title="Welcome to DanceBlue!" />
        <Text textAlign="center">
          You have not enabled notifications for this device, enable them in the
          settings app
        </Text>
        {deviceManufacturer === "Apple" && (
          <Button onPress={() => openSettings().catch(universalCatch)}>
            Open Settings
          </Button>
        )}
      </View>
    );
  } else {
    return (
      <>
        <JumbotronGeometric title={"Welcome to DanceBlue!"} />
        <Text textAlign="center" fontSize={theme.fontSizes["3xl"]}>
          Notifications
        </Text>
        <SectionList
          ListFooterComponent={View}
          ListFooterComponentStyle={{ height: 20 }}
          backgroundColor="#fff"
          refreshControl={
            <RefreshControl
              refreshing={isAnyLoading ?? false}
              onRefresh={() => {
                refreshNotifications(true);
              }}
            />
          }
          refreshing={isAnyLoading ?? false}
          data={notifications}
          sections={sections}
          keyExtractor={(data, i) =>
            getFragmentData(NotificationDeliveryFragment, data)?.id ??
            `notification-${i}`
          }
          ListEmptyComponent={() => (
            <View>
              <Text textAlign="center">No Notifications</Text>
            </View>
          )}
          renderSectionHeader={NotificationSectionHeader}
          renderItem={NotificationRow}
          onEndReached={loadMoreNotifications}
          onEndReachedThreshold={0.5}
        />
      </>
    );
  }
}

export default NotificationScreen;
