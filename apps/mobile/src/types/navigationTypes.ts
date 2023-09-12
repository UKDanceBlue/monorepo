/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FirestoreEvent } from "@ukdanceblue/db-app-common";

import { FirestoreHour } from "./firebaseTypes";

export type SpiritStackParamList = {
  MyTeam: undefined;
  Scoreboard: undefined;
};

export type SpiritStackScreenProps<T extends keyof SpiritStackParamList> = NativeStackScreenProps<SpiritStackParamList, T>;

export type TabNavigatorParamList = {
  Home: undefined;
  Events: undefined;
  Teams: NavigatorScreenParams<SpiritStackParamList>;
  Marathon: undefined;
  "Scavenger Hunt": undefined;
  "Morale Cup": undefined;
};

export type TabNavigatorProps<T extends keyof TabNavigatorParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RootStackParamList = {
  Main: undefined;
  SplashLogin: undefined;
  Tab: NavigatorScreenParams<TabNavigatorParamList>;
  Notifications: undefined;
  Profile: undefined;
  Event: {
    event: FirestoreEvent;
  };
  "Hour Details": { firestoreHour: FirestoreHour };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
NativeStackScreenProps<RootStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }
}
