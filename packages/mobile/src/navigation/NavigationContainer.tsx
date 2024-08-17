
import type { NavigationContainerRef } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import {
  addEventListener as addLinkingEventListener,
  canOpenURL,
  createURL as createLinkingURL,
  getInitialURL as getInitialLinkingURL,
  openURL,
} from "expo-linking";
import { addNotificationResponseReceivedListener } from "expo-notifications";
import { useDisclose } from "native-base";
import { useRef, useState } from "react";
import { StatusBar } from "react-native";
import type { WebViewSource } from "react-native-webview/lib/WebViewTypes";

import NotificationInfoModal from "../common/components/NotificationInfoModal";
import WebpageModal from "../common/components/WebpageModal";
import { useColorModeValue } from "../common/customHooks";
import { universalCatch } from "../common/logging";
import RootScreen from "../navigation/root/RootScreen";
import { useReactNavigationTheme } from "../theme";
import type { RootStackParamList } from "../types/navigationTypes";
import type { NotificationInfoPopup } from "../types/NotificationPayload";

const linkingPrefixes = [
  createLinkingURL("/"),
  // "https://*.danceblue.org",
  // "https://danceblue.org"
];

export const FilledNavigationContainer = () => {
  const navigationRef =
    useRef<NavigationContainerRef<RootStackParamList>>(null);

  const {
    isOpen: isNotificationInfoOpen,
    onClose: onNotificationInfoClose,
    onOpen: onNotificationInfoOpen,
  } = useDisclose(false);
  const [notificationInfoPopupContent, setNotificationInfoPopupContent] =
    useState<NotificationInfoPopup | null>(null);

  const {
    isOpen: isNotificationWebviewPopupSourceOpen,
    onClose: onNotificationWebviewPopupSourceClose,
    onOpen: onNotificationWebviewPopupSourceOpen,
  } = useDisclose(false);
  const [notificationWebviewPopupSource, setNotificationWebviewPopupSource] =
    useState<WebViewSource | null>(null);

  return (
    <>
      <StatusBar
        backgroundColor="white"
        barStyle={useColorModeValue("dark-content", "light-content")}
      />
      <NavigationContainer
        theme={useReactNavigationTheme()}
        ref={navigationRef}
        linking={{
          prefixes: linkingPrefixes,
          getInitialURL: getInitialLinkingURL,
          // Filter out URLs used by expo-auth-session
          filter: (url) => !url.includes("+expo-auth-session"),
          subscribe: (listener) => {
            const onReceiveURL = ({ url }: { url: string }) => listener(url);

            // Listen to incoming links from deep linking
            const linkingSubscription = addLinkingEventListener(
              "url",
              onReceiveURL
            );

            // THIS IS THE NOTIFICATION ENTRY POINT
            const notificationSubscription =
              addNotificationResponseReceivedListener((response) => {
                const {
                  url: notificationUrl,
                  textPopup,
                  webviewPopup,
                } = response.notification.request.content.data as {
                  url?: string;
                  textPopup?: NotificationInfoPopup;
                  webviewPopup?: WebViewSource;
                };

                if (textPopup != null) {
                  setNotificationInfoPopupContent(textPopup);
                  onNotificationInfoOpen();
                }

                if (webviewPopup != null) {
                  setNotificationWebviewPopupSource(webviewPopup);
                  onNotificationWebviewPopupSourceOpen();
                }

                if (notificationUrl != null) {
                  const decodedUrl = decodeURI(notificationUrl);
                  if (
                    linkingPrefixes.every(
                      (prefix) => !decodedUrl.includes(prefix)
                    )
                  ) {
                    canOpenURL(decodedUrl)
                      .then(async (canOpen) => {
                        if (canOpen) {
                          await openURL(decodedUrl);
                        }
                      })
                      .catch(universalCatch);
                  }
                  // Let React Navigation handle the URL
                  listener(decodedUrl);
                }
              });

            return () => {
              // Clean up the event listeners
              linkingSubscription.remove();
              notificationSubscription.remove();
            };
          },
          config: {
            initialRouteName: "Tab",
            screens: {
              Tab: {
                path: "/",
                screens: {
                  "Home": { path: "/" },
                  "Explore": { path: "/explore" },
                  "Events": { path: "/events" },
                  "Teams": { path: "/my-team" },
                  "Marathon": { path: "/scoreboard" },
                  "DB Moments": { path: "/dbmoments" },
                  "Info": {
                    path: "/info",
                  },
                },
              },
            },
          },
        }}
      >
        <NotificationInfoModal
          isNotificationInfoOpen={isNotificationInfoOpen}
          onNotificationInfoClose={onNotificationInfoClose}
          notificationInfoPopupContent={notificationInfoPopupContent}
        />
        <WebpageModal
          isOpen={isNotificationWebviewPopupSourceOpen}
          onClose={onNotificationWebviewPopupSourceClose}
          source={notificationWebviewPopupSource}
        />
        <RootScreen />
      </NavigationContainer>
    </>
  );
};
