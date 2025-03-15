import { Ionicons } from "@expo/vector-icons";
import { AuthSource } from "@ukdanceblue/common";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { openURL } from "expo-linking";
import { type FragmentOf, readFragment } from "gql.tada";
import { Modal } from "native-base";
import { useState } from "react";
import React from "react";
import { TextInput, View } from "react-native";

import { overrideApiBaseUrl } from "~/api/apiUrl";
import { useAuthContext } from "~/auth/context/AuthContext";
import { useLogin, useLogOut } from "~/lib/hooks/useLogin";
import { universalCatch } from "~/lib/logger/Logger";
import { useColorScheme, useColorSchemeValues } from "~/lib/useColorScheme";

import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { LogView } from "./LogView";
import { ProfileScreenAuthFragment } from "./ProfileScreenFragments";

type SequenceMember = "report" | "suggest" | "donate" | "logout";

export const ProfileFooter = ({
  profileScreenAuthFragment,
}: {
  profileScreenAuthFragment: FragmentOf<
    typeof ProfileScreenAuthFragment
  > | null;
}) => {
  const { setMasquerade } = useAuthContext();
  const authData = readFragment(
    ProfileScreenAuthFragment,
    profileScreenAuthFragment
  );

  const [sequence, setSequence] = useState<SequenceMember[]>([]);
  function pushSequence(n: SequenceMember) {
    setSequence([...sequence.filter((s) => s !== n), n]);
  }
  function checkSequence(s: readonly SequenceMember[]) {
    const sequenceSlice = sequence.slice(-s.length);
    return (
      sequenceSlice.length === s.length &&
      sequenceSlice.every((v, i) => v === s[i])
    );
  }

  const [loginLoading, logIn] = useLogin();
  const [logOutLoading, logOut] = useLogOut();
  const loading = loginLoading || logOutLoading;

  const { toggleColorScheme } = useColorScheme();
  const colorModeIcon = useColorSchemeValues("moon", "sunny");

  const isAnonymous = authData?.authSource === AuthSource.Anonymous;

  const sequenceActions = [
    {
      sequence: ["report", "suggest"] as const,
      action: (str: string) => {
        if (str === "demo-password") {
          logIn(AuthSource.Demo);
        }
      },
      text: "Enter the password to log in as a demo user",
      Component: null,
    },
    {
      sequence: ["suggest", "logout"] as const,
      action: (str: string) => {
        setMasquerade(str || null);
      },
      text: "Enter the ID of the user to masquerade as",
      Component: null,
    },
    {
      sequence: ["donate", "logout"] as const,
      action: (str: string) => {
        overrideApiBaseUrl(str);
      },
      text: "Enter the URL to override the API base URL",
      Component: null,
    },
    {
      sequence: ["logout", "donate"] as const,
      action: (str: string) => {
        openURL(str).catch(universalCatch);
      },
      text: "Enter the URL to open when logging out",
      Component: () => <LogView />,
    },
  ];

  const activeSequence = sequenceActions.find((a) => checkSequence(a.sequence));

  return (
    <>
      <Modal isOpen={activeSequence != null} onClose={() => setSequence([])}>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: "white",
          }}
        >
          {activeSequence?.Component ? (
            <activeSequence.Component />
          ) : (
            <>
              <Text
                style={{
                  textAlign: "center",
                  width: "100%",
                }}
              >
                {activeSequence?.text}
              </Text>
              <TextInput
                style={{
                  borderWidth: 2,
                  minWidth: "50%",
                }}
                onSubmitEditing={(event) => {
                  activeSequence?.action(event.nativeEvent.text);
                }}
              />
            </>
          )}
        </View>
      </Modal>

      <View className="flex flex-row justify-center gap-8 w-full">
        <Button
          onPress={() => {
            openURL("https://donate.danceblue.org").catch(universalCatch);
          }}
          onLongPress={() => pushSequence("donate")}
          // width="2/5"
          // backgroundColor="primary.600"
          // _text={{ color: "secondary.400" }}
          // _pressed={{ opacity: 0.6 }}
          className="w-2/5 max-w-32"
          variant="default"
        >
          Donate #FTK!
        </Button>
        <Button
          onPress={logOut}
          onLongPress={() => pushSequence("logout")}
          loading={loading}
          // width="2/5"
          // backgroundColor={isAnonymous ? "secondary.400" : "danger.600"}
          // _text={{ color: isAnonymous ? "primary.600" : "white" }}
          // _pressed={{ opacity: 0.6 }}
          className="w-2/5 max-w-32"
          variant={isAnonymous ? "default" : "destructive"}
        >
          {isAnonymous ? "Sign in" : "Sign out"}
        </Button>
      </View>

      <View className="flex flex-row justify-center gap-8 w-full">
        <Button
          variant="outline"
          className="w-2/5 max-w-32"
          onPress={() => {
            openURL(
              "mailto:app@danceblue.org?subject=DanceBlue%20App%20Issue%20Report&body=What%20happened%3A%0A%3Ctype%20here%3E%0A%0AWhat%20I%20was%20doing%3A%0A%3Ctype%20here%3E%0A%0AOther%20information%3A%0A%3Ctype%20here%3E"
            ).catch(universalCatch);
          }}
          onLongPress={() => pushSequence("report")}
        >
          Report issue
        </Button>

        <Button
          variant="outline"
          className="w-2/5 max-w-32"
          onPress={() => {
            openURL(
              "mailto:app@danceblue.org?subject=DanceBlue%20App%20Suggestion&body=%3Ctype%20here%3E"
            ).catch(universalCatch);
          }}
          onLongPress={() => pushSequence("suggest")}
        >
          Suggest change
        </Button>
      </View>

      <View className="flex flex-row justify-center items-center gap-8 w-full">
        {__DEV__ && (
          <>
            <Button onPress={toggleColorScheme} variant="ghost">
              <Ionicons name={colorModeIcon} size={24} />
            </Button>
          </>
        )}
        <Text style={{ textAlign: "center" }}>{`Version: ${
          nativeApplicationVersion ?? ""
        } (${nativeBuildVersion ?? ""})`}</Text>
      </View>
    </>
  );
};
