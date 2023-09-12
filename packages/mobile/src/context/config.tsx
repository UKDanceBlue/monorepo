import { FirebaseRemoteConfigTypes } from "@react-native-firebase/remote-config";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { log, logError, universalCatch } from "../common/logging";

import { useFirebase } from "./firebase";
import { useLoading } from "./loading";
import { UserLoginType } from "./user";

interface AppConfiguration {
  isConfigLoaded: boolean;
  enabledScreens: string[];
  fancyTab: string | undefined;
  allowedLoginTypes: UserLoginType[];
  scoreboardMode: { pointType:string;showIcons:boolean;showTrophies:boolean };
  demoModeKey: string;
}

const initialState: AppConfiguration = {
  isConfigLoaded: false,
  enabledScreens: [],
  fancyTab: undefined,
  allowedLoginTypes: [],
  scoreboardMode: { pointType: "", showIcons: false, showTrophies: false },
  demoModeKey: Math.random().toString(), // Start the demo key as junk for safety's sake
};

const demoModeState: AppConfiguration = {
  ...initialState,
  isConfigLoaded: true,
  enabledScreens: [
    "Events", "Scoreboard", "Team", "MarathonHours"
  ],
  scoreboardMode: initialState.scoreboardMode,
  allowedLoginTypes: [],
};

const AppConfigContext = createContext<[AppConfiguration, ((key: string) => boolean)]>([ initialState, () => false ]);

const updateState = async (setLoading: (isLoading: boolean) => void, fbRemoteConfig: FirebaseRemoteConfigTypes.Module): Promise<AppConfiguration> => {
  setLoading(true);
  try {
    await fbRemoteConfig.setDefaults({
      "shown_tabs": "[]",
      "rn_scoreboard_mode": "{\"pointType\":\"spirit\",\"showIcons\":false,\"showTrophies\":true}",
      "login_mode": "[\"ms-oath-linkblue\",\"anonymous\"]",
      "countdowns": "[]",
      "demo_mode_key": "Test Key 8748"
    });
    try {
      await fbRemoteConfig.fetch(300);
      const activated = await fbRemoteConfig.activate();
      if (!activated) {
        log(`Remote config not activated, last fetch status was ${fbRemoteConfig.lastFetchStatus}`);
      } else {
        log("Remote config activated");
      }
    } catch (e) {
      logError(e as Error);
    }

    const remoteConfigData = fbRemoteConfig.getAll();
    const parsedRemoteConfig: Partial<AppConfiguration> = {};

    try {
      parsedRemoteConfig.enabledScreens = (JSON.parse(remoteConfigData.shown_tabs.asString()) ?? undefined) as string[] | undefined;
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error parsing 'shown_tabs'");
        logError(e);
        parsedRemoteConfig.enabledScreens = undefined;
      } else {
        throw e;
      }
    }
    try {
      parsedRemoteConfig.fancyTab = remoteConfigData.fancy_tab.asString() as string | undefined;
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error parsing 'fancy_tab'");
        logError(e);
        parsedRemoteConfig.fancyTab = undefined;
      } else {
        throw e;
      }
    }

    try {
      parsedRemoteConfig.allowedLoginTypes = (JSON.parse(remoteConfigData.login_mode.asString()) as (UserLoginType[] | undefined) ?? undefined);
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error while parsing 'login_mode' config");
        logError(e);
        parsedRemoteConfig.allowedLoginTypes = undefined;
      } else {
        throw e;
      }
    }
    parsedRemoteConfig.demoModeKey = remoteConfigData.demo_mode_key.asString() as string | undefined;
    try {
      parsedRemoteConfig.scoreboardMode = (JSON.parse(remoteConfigData.rn_scoreboard_mode.asString()) ?? undefined) as {
      pointType: string;
      showIcons: boolean;
      showTrophies: boolean;
  } | undefined;
    } catch (e) {
      if (e instanceof SyntaxError) {
        log("Error while parsing 'rn_scoreboard_mode' config");
        logError(e);
        parsedRemoteConfig.scoreboardMode = undefined;
      } else {
        throw e;
      }
    }

    return {
      isConfigLoaded: true,
      allowedLoginTypes: parsedRemoteConfig.allowedLoginTypes ?? initialState.allowedLoginTypes,
      enabledScreens: parsedRemoteConfig.enabledScreens ?? initialState.enabledScreens,
      fancyTab: parsedRemoteConfig.fancyTab ?? initialState.fancyTab,
      demoModeKey: parsedRemoteConfig.demoModeKey ?? initialState.demoModeKey,
      scoreboardMode: parsedRemoteConfig.scoreboardMode ?? initialState.scoreboardMode,
    };
  } finally {
    setLoading(false);
  }
};

export const AppConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [ configData, setConfigData ] = useState<AppConfiguration>(initialState);
  const demoModeKey = useMemo(() => configData.demoModeKey, [configData.demoModeKey]);
  const [ , setLoading ] = useLoading();

  const { fbRemoteConfig } = useFirebase();

  useEffect(() => {
    updateState(setLoading, fbRemoteConfig).then(setConfigData).catch(universalCatch);
  }, [ fbRemoteConfig, setLoading ]);

  const tryToSetDemoMode = useCallback((key: string, demoModeKey: string): boolean => {
    log(`Trying to set demo mode with key ${key}`);
    if (key === demoModeKey) {
      setConfigData(demoModeState);
      return true;
    }
    return false;
  }, []);

  return (
    <AppConfigContext.Provider value={[ configData, (key:string) => tryToSetDemoMode(key, demoModeKey) ]}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = () => {
  return useContext(AppConfigContext)[0];
};

export const useEnterDemoMode = () => {
  const enterDemoMode = useContext(AppConfigContext)[1];
  return enterDemoMode;
};
