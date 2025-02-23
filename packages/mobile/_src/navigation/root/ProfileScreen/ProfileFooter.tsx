import { Ionicons } from "@expo/vector-icons";
import { AuthSource } from "@ukdanceblue/common";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { openURL } from "expo-linking";
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Modal,
  Text,
  useColorMode,
  View,
} from "native-base";
import { useState } from "react";
import React from "react";
import { TextInput } from "react-native";

import { overrideApiBaseUrl } from "@/common/apiUrl";
import { useLogin, useLogOut } from "@/common/auth";
import { useColorModeValue } from "@/common/customHooks";
import { universalCatch } from "@/common/logging";
import { useUrqlConfig } from "@/context/urql";
import type { FragmentOf } from "@/graphql/index";
import { readFragment } from "@/graphql/index";

import { ProfileScreenAuthFragment } from "./ProfileScreen";

type SequenceMember = "report" | "suggest" | "donate" | "logout";

export const ProfileFooter = ({
  profileScreenAuthFragment,
}: {
  profileScreenAuthFragment: FragmentOf<
    typeof ProfileScreenAuthFragment
  > | null;
}) => {
  const { setMasquerade } = useUrqlConfig();
  const authData = readFragment(
    ProfileScreenAuthFragment,
    profileScreenAuthFragment
  );

  const [sequence, setSequence] = useState<SequenceMember[]>([]);
  function pushSequence(s: SequenceMember) {
    setSequence([...sequence.filter((s) => s !== "report"), s]);
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

  const { toggleColorMode } = useColorMode();
  const colorModeIcon = useColorModeValue("moon", "md-sunny");

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
    },
    {
      sequence: ["suggest", "logout"] as const,
      action: (str: string) => {
        setMasquerade(str || null);
      },
      text: "Enter the ID of the user to masquerade as",
    },
    {
      sequence: ["donate", "logout"] as const,
      action: (str: string) => {
        overrideApiBaseUrl(str);
      },
      text: "Enter the URL to override the API base URL",
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
        </View>
      </Modal>

      <HStack justifyContent="center">
        <Button
          onPress={() => {
            openURL("https://donate.danceblue.org").catch(universalCatch);
          }}
          onLongPress={() => pushSequence("donate")}
          width="2/5"
          backgroundColor="primary.600"
          _text={{ color: "secondary.400" }}
          _pressed={{ opacity: 0.6 }}
        >
          Donate #FTK!
        </Button>
        <Button
          onPress={logOut}
          onLongPress={() => pushSequence("logout")}
          isLoading={loading}
          width="2/5"
          backgroundColor={isAnonymous ? "secondary.400" : "danger.600"}
          _text={{ color: isAnonymous ? "primary.600" : "white" }}
          _pressed={{ opacity: 0.6 }}
        >
          {isAnonymous ? "Sign in" : "Sign out"}
        </Button>
      </HStack>

      <HStack alignItems="center" justifyItems="space-evenly">
        <Button
          variant="outline"
          width="30%"
          onPress={() => {
            openURL(
              "mailto:app@danceblue.org?subject=DanceBlue%20App%20Issue%20Report&body=What%20happened%3A%0A%3Ctype%20here%3E%0A%0AWhat%20I%20was%20doing%3A%0A%3Ctype%20here%3E%0A%0AOther%20information%3A%0A%3Ctype%20here%3E"
            ).catch(universalCatch);
          }}
          onLongPress={() => pushSequence("report")}
        >
          Report issue
        </Button>

        <View width="10%" />

        <Button
          variant="outline"
          width="30%"
          onPress={() => {
            openURL(
              "mailto:app@danceblue.org?subject=DanceBlue%20App%20Suggestion&body=%3Ctype%20here%3E"
            ).catch(universalCatch);
          }}
          onLongPress={() => pushSequence("suggest")}
        >
          Suggest change
        </Button>
      </HStack>

      <HStack marginTop="2" alignItems="center">
        {__DEV__ && (
          <>
            <IconButton
              icon={
                <Icon
                  size="6"
                  as={Ionicons}
                  name={colorModeIcon}
                  onPress={toggleColorMode}
                />
              }
            />
            {/* <Switch onToggle={toggleColorMode}/> */}
            <View width="3%" />
          </>
        )}
        <Text style={{ textAlign: "center" }}>{`Version: ${
          nativeApplicationVersion ?? ""
        } (${nativeBuildVersion ?? ""})`}</Text>
      </HStack>
    </>
  );
};
