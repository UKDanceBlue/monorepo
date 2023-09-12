/* eslint-disable no-console */
import AsyncStorage from "@react-native-async-storage/async-storage"
import { registerRootComponent } from 'expo';
import { DevMenu, isDevelopmentBuild } from "expo-dev-client";
import { setNotificationHandler } from "expo-notifications";
import { preventAutoHideAsync } from "expo-splash-screen";
import { LogBox } from "react-native";

import App from './App';

preventAutoHideAsync().catch(console.error);

LogBox.ignoreLogs(["'SplashScreen.show' has already been called for given view controller."]);
LogBox.ignoreLogs(["Constants.platform.ios.model has been deprecated in favor of expo-device's Device.modelName property. This API will be removed in SDK 45."]);

if (isDevelopmentBuild()) {
  DevMenu.registerDevMenuItems([
    {
      name: "Clear AsyncStorage",
      action: async () => {
        await AsyncStorage.clear().catch(console.error);
        alert("AsyncStorage cleared successfully");
      }
    },
    {
      name: "Print AsyncStorage",
      action: async () => {
        const keys = await AsyncStorage.getAllKeys().catch(console.error);
        const values = await AsyncStorage.multiGet(keys).catch(console.error);
        if (console.table) {
          console.table(values);
        } else {
          console.log(values);
        }
      }
    }
  ]);
}

// Configure the notifications handler to decide what to do when a notification is received if the app is open
setNotificationHandler({
  handleNotification: () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


registerRootComponent(App);
