import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { FragmentType } from "@/graphql/index";

import type { EventScreenFragment } from "../navigation/root/EventScreen/EventScreenFragment";

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type SpiritStackParamList = {
  MyTeam: Record<string, never>;
  Scoreboard: Record<string, never>;
};

export type SpiritStackScreenProps<T extends keyof SpiritStackParamList> =
  NativeStackScreenProps<SpiritStackParamList, T>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TabNavigatorParamList = {
  "Home": Record<string, never>;
  "Events": Record<string, never>;
  "Explore": Record<string, never>;
  "Teams": NavigatorScreenParams<SpiritStackParamList>;
  "Marathon": Record<string, never>;
  "DB Moments": Record<string, never>;
  "DB Funds": Record<string, never>;
  "Info": Record<string, never>;
};

export type TabNavigatorProps<T extends keyof TabNavigatorParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabNavigatorParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  "Main": Record<string, never>;
  "SplashLogin": Record<string, never>;
  "Tab": NavigatorScreenParams<TabNavigatorParamList>;
  "Notifications": Record<string, never>;
  "Profile": Record<string, never>;
  "Event": {
    event: FragmentType<typeof EventScreenFragment>;
    occurrenceId: string;
  };
  "Explorer": Record<string, never>;
  "Hour Details": Record<string, never>; // { firestoreHour: FirestoreHour };
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
