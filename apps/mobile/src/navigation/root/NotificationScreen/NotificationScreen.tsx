import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FirestoreNotification } from "@ukdanceblue/db-app-common";
import { manufacturer as deviceManufacturer } from "expo-device";
import { openSettings } from "expo-linking";
import { setBadgeCountAsync } from "expo-notifications";
import { DateTime } from "luxon";
import { Button, SectionList, Text, View, useTheme } from "native-base";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

import JumbotronGeometric from "../../../common/components/JumbotronGeometric";
import { log, universalCatch } from "../../../common/logging";
import { useDeviceData, useLoading, useUserData } from "../../../context";
import { useRefreshUserData } from "../../../context/user";

import { NotificationRow } from "./NotificationRow";
import { NotificationSectionHeader } from "./NotificationSectionHeader";
import { useFallBackNotificationLoader } from "./fallbackNotificationLoader";
import { refreshNotificationScreen } from "./refresh";

export interface NotificationListDataEntry {
  notification: (FirestoreNotification | undefined);
  reference: FirebaseFirestoreTypes.DocumentReference<FirestoreNotification> | undefined;
  indexWithOpenMenu: Animated.SharedValue<undefined | number>;
}

/**
 * Component for "Profile" screen in main navigation
 */
function NotificationScreen() {
  const { getsNotifications: notificationPermissionsGranted } = useDeviceData();

  const indexWithOpenMenu = useSharedValue<undefined | number>(undefined);

  const { notificationReferences } = useUserData();
  const refreshUserData = useRefreshUserData();

  const [
    , , { UserDataProvider: isUserDataLoading }
  ] = useLoading();

  const [ isLoading, setIsLoading ] = useState(false);
  const isAnyLoading = isLoading || isUserDataLoading;

  const theme = useTheme();
  const userData = useUserData();

  const [ fallbackNotifications, refreshFallbackNotifications ] = useFallBackNotificationLoader(notificationReferences.length === 0, indexWithOpenMenu);
  const [ userNotifications, setNotifications ] = useState<(NotificationListDataEntry | undefined)[]>([]);
  const notifications = userNotifications.concat(fallbackNotifications?? []);

  // Clear badge count when navigating to this screen
  useEffect(() => {
    (async () => {
      const success = await setBadgeCountAsync(0);

      if (!success) {
        log("Failed to clear badge count", "warn");
      }
    })().catch(universalCatch);
  }, []);

  useEffect(() => {
    refreshNotificationScreen(notificationReferences, setNotifications, indexWithOpenMenu).catch(universalCatch);
  }, [ indexWithOpenMenu, notificationReferences ]);

  function jumboText() {
    let welcomeString = "Welcome to DanceBlue!";
    if (userData.firstName != null) {
      welcomeString = `Hey ${ userData.firstName }!`;
    }

    return welcomeString;
  }

  if (!notificationPermissionsGranted) {
    return (
      <View>
        <JumbotronGeometric title={jumboText()}/>
        <Text textAlign="center">
          You have not enabled notifications for this device, enable them in the settings app
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
        <JumbotronGeometric title={jumboText()}/>
        <Text textAlign="center" fontSize={theme.fontSizes["3xl"]}>Notifications</Text>
        <SectionList
          ListFooterComponent={View}
          ListFooterComponentStyle={{ height: 20 }}
          backgroundColor="#fff"
          refreshControl={<RefreshControl
            refreshing={isAnyLoading ?? false}
            onRefresh={() => {
              setIsLoading(true);
              setNotifications(notificationReferences.map(() => undefined));
              refreshUserData()
                .then(() => Promise.all([
                  refreshFallbackNotifications(),
                  refreshNotificationScreen(notificationReferences, setNotifications, indexWithOpenMenu)
                ])
                )
                .then(() => setIsLoading(false))
                .catch(universalCatch);
            }}/>}
          data={notifications}
          sections={
            Object.entries(notifications.reduce<Record<string, NotificationListDataEntry[] | undefined>>((acc, data) => {
              if (data?.notification == null) {
                acc[""] = [
                  ...(acc[""] ?? []), {
                    notification: undefined,
                    reference: undefined,
                    indexWithOpenMenu
                  }
                ];

                return acc;
              } else {
                const date = DateTime.fromISO(data.notification.sendTime).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

                acc[date] = [ ...(acc[date] ?? []), data ];

                return acc;
              }
            }, {})).map(([ date, notifications ]) => ({ title: date, data: notifications ?? [] }))
          }
          keyExtractor={(data, i) => data?.notification == null ? String(i) : `${data.notification.title} : ${data.notification.sendTime}`}
          ListEmptyComponent={() => (
            <View>
              <Text textAlign="center">No Notifications</Text>
            </View>
          )}
          renderSectionHeader={NotificationSectionHeader}
          renderItem={NotificationRow}
        />
      </>
    );
  }
}

export default NotificationScreen;
