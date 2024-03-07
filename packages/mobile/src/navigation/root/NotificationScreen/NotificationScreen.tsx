import JumbotronGeometric from "@common/components/JumbotronGeometric";
import { NotificationDeliveryFragment } from "@common/fragments/NotificationScreenGQL";
import { Logger } from "@common/logger/Logger";
import { universalCatch } from "@common/logging";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import type {
  FragmentType} from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
} from "@ukdanceblue/common/dist/graphql-client-public";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Button, SectionList, Text, View, useTheme } from "native-base";
import { useEffect, useMemo } from "react";
import { RefreshControl } from "react-native";

import { useDeviceData, useLoading, useUserData } from "../../../context";


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
  const userData = useUserData();

  const { notifications, refreshNotifications, loadMoreNotifications } =
    useLoadNotifications();
  const isAnyLoading = notifications == null || isUserDataLoading;

  const sections = useMemo(() => {
    const sections: {
      title: string;
      data: FragmentType<typeof NotificationDeliveryFragment>[];
    }[] = [];
    let lastDate: [DateTime | null, string] = [null, ""];

    for (const notification of notifications ?? []) {
      const delivery = getFragmentData(
        NotificationDeliveryFragment,
        notification
      );
      if (delivery.sentAt == null) {
        sections.push({ title: "", data: [notification] });
      } else {
        const date = dateTimeFromSomething(delivery.sentAt) as DateTime;

        if (date !== lastDate[0]) {
          const title = date.toLocaleString(DateTime.DATE_MED) ?? "";
          sections.push({ title, data: [notification] });
          lastDate = [date, title];
        } else {
          sections[sections.length - 1].data.push(notification);
        }
      }
    }

    return sections;
  }, [notifications]);

  // Clear badge count when navigating to this screen
  useEffect(() => {
    (async () => {
      const success = await setBadgeCountAsync(0);

      if (!success) {
        Logger.warn("Failed to clear badge count", {
          error: "setBadgeCountAsync returned false",
        });
      }
    })().catch((error) => {
      Logger.error("Failed to clear badge count", error);
    });
  }, []);

  function jumboText() {
    let welcomeString = "Welcome to DanceBlue!";
    if (userData.firstName != null) {
      welcomeString = `Hey ${userData.firstName}!`;
    }

    return welcomeString;
  }

  if (!notificationPermissionsGranted) {
    return (
      <View>
        <JumbotronGeometric title={jumboText()} />
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
        <JumbotronGeometric title={jumboText()} />
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
                refreshNotifications();
              }}
            />
          }
          data={notifications}
          sections={sections}
          keyExtractor={(data, i) =>
            getFragmentData(NotificationDeliveryFragment, data)?.uuid ??
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
