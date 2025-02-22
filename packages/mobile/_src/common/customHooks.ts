import type {
  NetInfoState,
  NetInfoUnknownState,
} from "@react-native-community/netinfo";
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";
import {
  useColorModeValue as useColorModeValueNativeBase,
  useTheme,
} from "native-base";
import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [connectionInfo, setConnectionInfo] = useState<NetInfoState>({
    isConnected: null,
    isInternetReachable: null,
    type: NetInfoStateType.unknown,
    details: null,
  } as NetInfoUnknownState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() =>
    NetInfo.addEventListener((state) => {
      setConnectionInfo(state);
      setIsLoaded(true);
    })
  );

  return [connectionInfo, isLoaded] as const;
}

export const useColorModeValue = <A, B>(lightValue: A, darkValue: B): A | B =>
  useColorModeValueNativeBase(lightValue, darkValue) as A | B;

/**
 * Only use for non-NativeBase components, NativeBase components should just use something like "color.123"
 */
export const useThemeColors = () => {
  return useTheme().colors;
};

/**
 * Only use for non-NativeBase components, NativeBase components should just use the font family name in a string like "body"
 */
export const useThemeFonts = () => {
  return useTheme().fonts;
};
