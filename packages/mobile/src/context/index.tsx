import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthStateProvider } from "./auth";
import { DeviceDataProvider } from "./device";
import { FirebaseProvider } from "./firebase";
import { LoadingWrapper } from "./loading";

export { useAuthData } from "./auth.old";
export { useDeviceData } from "./device";
export { useFirebase } from "./firebase";
export { useLoading } from "./loading";
export { useUserData } from "./user";

export const CombinedContext = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <LoadingWrapper>
    <FirebaseProvider>
      <AuthStateProvider>
        <DeviceDataProvider>
          <GestureHandlerRootView>
            <View style={{ minHeight: "100%", minWidth: "100%" }}>
              {children}
            </View>
          </GestureHandlerRootView>
        </DeviceDataProvider>
      </AuthStateProvider>
    </FirebaseProvider>
  </LoadingWrapper>
);
