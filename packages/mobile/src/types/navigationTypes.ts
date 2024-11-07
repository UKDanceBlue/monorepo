import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { FragmentType } from "#graphql/index";

import type { EventScreenFragment } from "../navigation/root/EventScreen/EventScreenFragment";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SpiritStackParamList = {
  MyTeam: undefined;
  Scoreboard: undefined;
};

export type SpiritStackScreenProps<T extends keyof SpiritStackParamList> =
  NativeStackScreenProps<SpiritStackParamList, T>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TabNavigatorParamList = {
  "Home": undefined;
  "Events": undefined;
  "Explore": undefined;
  "Teams": NavigatorScreenParams<SpiritStackParamList>;
  "Marathon": undefined;
  "DB Moments": undefined;
  "DB Funds": undefined;
  "Info": undefined;
};

export type TabNavigatorProps<T extends keyof TabNavigatorParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  "Main": undefined;
  "SplashLogin": undefined;
  "Tab": NavigatorScreenParams<TabNavigatorParamList>;
  "Notifications": undefined;
  "Profile": undefined;
  "Event": {
    event: FragmentType<typeof EventScreenFragment>;
    occurrenceId: string;
  };
  "Explorer": undefined;
  "Hour Details": undefined; // { firestoreHour: FirestoreHour };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
