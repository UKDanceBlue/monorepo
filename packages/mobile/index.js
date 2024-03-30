// @ts-check
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerRootComponent } from "expo";
import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync } from "expo-splash-screen";
import { LogBox } from "react-native";
import "react-native-url-polyfill/auto";

import App from "./App";
import { Logger } from "./src/common/logger/Logger";

Logger.debug("Starting app");

void preventAutoHideAsync();

LogBox.ignoreLogs([
  "'SplashScreen.show' has already been called for given view controller.",
]);
LogBox.ignoreLogs([
  "Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45.",
]);

if (isDevelopmentBuild()) {
  DevMenu.registerDevMenuItems([
    {
      name: "Clear AsyncStorage",
      callback: async () => {
        Logger.log("Clearing AsyncStorage");
        await AsyncStorage.clear();
        alert("AsyncStorage cleared successfully");
      },
    },
    {
      name: "Print AsyncStorage",
      callback: async () => {
        Logger.log("Printing AsyncStorage");
        const keys = await AsyncStorage.getAllKeys();
        const values = await AsyncStorage.multiGet(keys);
        console.log(values);
      },
    },
  ]).catch((error) => console.error(error));
}

// Configure the notifications handler to decide what to do when a notification is received if the app is open
setNotificationHandler({
  handleNotification: () =>
    Promise.resolve({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

try {
  registerRootComponent(App);
} catch (error) {
  Logger.error("Error registering root component", { error });
  throw error;
}
