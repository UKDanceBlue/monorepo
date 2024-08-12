import { ProfileScreenAuthFragment } from ".";

import { useLogOut, useLogin } from "@common/auth";
import { useColorModeValue } from "@common/customHooks";
import { universalCatch } from "@common/logging";
import { Ionicons } from "@expo/vector-icons";
import { AuthSource } from "@ukdanceblue/common";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-mobile";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { openURL } from "expo-linking";
import {
  Button,
  HStack,
  Icon,
  IconButton,
  Text,
  View,
  useColorMode,
} from "native-base";
import { useState } from "react";
import { TextInput } from "react-native";

import type { FragmentType } from "@ukdanceblue/common/graphql-client-mobile";


export const ProfileFooter = ({
  profileScreenAuthFragment,
}: {
  profileScreenAuthFragment: FragmentType<
    typeof ProfileScreenAuthFragment
  > | null;
}) => {
  const authData = getFragmentData(
    ProfileScreenAuthFragment,
    profileScreenAuthFragment
  );

  const [reportLongPressed, setReportLongPressed] = useState(false);
  const [suggestLongPressed, setSuggestLongPressed] = useState(false);

  const [loginLoading, logIn] = useLogin();
  const [logOutLoading, logOut] = useLogOut();
  const loading = loginLoading || logOutLoading;

  const { toggleColorMode } = useColorMode();
  const colorModeIcon = useColorModeValue("moon", "md-sunny");

  const isAnonymous = authData?.authSource === AuthSource.Anonymous;

  return (
    <>
      {reportLongPressed && suggestLongPressed && (
        <TextInput
          style={{ borderWidth: 2, minWidth: "30%" }}
          returnKeyType="go"
          secureTextEntry
          onSubmitEditing={(event) => {
            console.log(event.nativeEvent.text);
            if (event.nativeEvent.text === "demo-password") {
              logIn(AuthSource.Demo);
            }
          }}
        />
      )}

      <HStack justifyContent="center">
        <Button
          onPress={() => {
            openURL("https://danceblue.networkforgood.com").catch(
              universalCatch
            );
          }}
          width="2/5"
          backgroundColor="primary.600"
          _text={{ color: "secondary.400" }}
          _pressed={{ opacity: 0.6 }}
        >
          Donate #FTK!
        </Button>
        <Button
          onPress={logOut}
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
          onLongPress={() => {
            setReportLongPressed(true);
          }}
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
          onLongPress={() => {
            setSuggestLongPressed(!!reportLongPressed);
          }}
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
