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

import { useLogin, useLogOut } from "@/common/auth";
import { useColorModeValue } from "@/common/customHooks";
import { universalCatch } from "@/common/logging";
import { useUrqlConfig } from "@/context/urql";
import type { FragmentOf } from "@/graphql/index";
import { readFragment } from "@/graphql/index";

import { ProfileScreenAuthFragment } from "./ProfileScreen";

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

  const [sequence, setSequence] = useState<
    ("report" | "suggest" | "donate" | "logout")[]
  >([]);
  function pushSequence(s: (typeof sequence)[number]) {
    setSequence([...sequence.filter((s) => s !== "report"), s]);
  }
  function checkSequence(s: typeof sequence) {
    return sequence.length === s.length && sequence.every((v, i) => v === s[i]);
  }

  const [loginLoading, logIn] = useLogin();
  const [logOutLoading, logOut] = useLogOut();
  const loading = loginLoading || logOutLoading;

  const { toggleColorMode } = useColorMode();
  const colorModeIcon = useColorModeValue("moon", "md-sunny");

  const isAnonymous = authData?.authSource === AuthSource.Anonymous;

  return (
    <>
      <Modal
        isOpen={
          checkSequence(["report", "suggest"]) ||
          checkSequence(["suggest", "logout"])
        }
        onClose={() => setSequence([])}
      >
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: "white",
          }}
        >
          <Text>Demo Mode</Text>
          <TextInput
            style={{
              borderWidth: 2,
              minWidth: "50%",
            }}
            returnKeyType="go"
            secureTextEntry
            onSubmitEditing={(event) => {
              if (checkSequence(["report", "suggest"])) {
                if (event.nativeEvent.text === "demo-password") {
                  logIn(AuthSource.Demo);
                }
              } else {
                setMasquerade(event.nativeEvent.text || null);
              }
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
