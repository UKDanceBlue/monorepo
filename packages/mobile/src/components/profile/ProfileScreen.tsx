import {
  AuthSource,
  CommitteeIdentifier,
  committeeNames,
  CommitteeRole,
  DbRole,
} from "@ukdanceblue/common";
import { openURL } from "expo-linking";
import {
  Box,
  Button,
  Center,
  Container,
  Spinner,
  Text,
  VStack,
} from "native-base";
import { useMemo } from "react";
import React from "react";
import { View } from "react-native";

import { type FragmentOf, readFragment } from "~/api";
import { useLogin } from "~/lib/hooks/useLogin";
import { universalCatch } from "~/lib/logger/Logger";

import { H2 } from "../ui/typography";
import { ProfileFooter } from "./ProfileFooter";
import {
  ProfileScreenAuthFragment,
  ProfileScreenUserFragment,
} from "./ProfileScreenFragments";

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = ({
  profileScreenAuthFragment,
  profileScreenUserFragment,
}: {
  profileScreenAuthFragment: FragmentOf<
    typeof ProfileScreenAuthFragment
  > | null;
  profileScreenUserFragment: FragmentOf<
    typeof ProfileScreenUserFragment
  > | null;
}) => {
  const authData = readFragment(
    ProfileScreenAuthFragment,
    profileScreenAuthFragment
  );
  const userData = readFragment(
    ProfileScreenUserFragment,
    profileScreenUserFragment
  );

  const [loading, trigger] = useLogin();

  let welcomeString = "Welcome to DanceBlue!";
  if (userData?.name) {
    welcomeString = `Hey ${userData.name}!`;
  }

  const committeeString = useMemo(() => {
    if (userData?.primaryCommittee) {
      if (
        // TODO: Add a way to query committee info
        userData.primaryCommittee.identifier ===
          CommitteeIdentifier.overallCommittee &&
        userData.primaryCommittee.role === CommitteeRole.Chair
      ) {
        return "✨ Overall Chair ✨";
      }
      return `Committee: ${
        committeeNames[userData.primaryCommittee.identifier]
      } ${userData.primaryCommittee.role}`;
    } else {
      return null;
    }
  }, [userData?.primaryCommittee]);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (authData?.dbRole !== DbRole.None) {
    return (
      <>
        {/* <JumbotronGeometric title={jumboText()} /> */}
        <H2 className="border-none text-center">{welcomeString}</H2>
        <VStack flex={0.95} justifyContent="space-between" display="flex">
          <Container maxWidth="full">
            <Text width="full" textAlign="center" className="text-2xl">
              You&apos;re currently logged in as:
            </Text>
            <Text
              width="full"
              textAlign="center"
              className="text-2xl"
              color="primary.600"
            >
              {userData?.name ?? "Anonymous"}
            </Text>
            {committeeString && (
              <Text
                width="full"
                italic
                textAlign="center"
                color="primary.600"
                className="text-lg"
              >
                {committeeString}
              </Text>
            )}
            <Box alignItems="center" width="full" className="mt-4">
              <Button
                onPress={() =>
                  openURL(
                    "https://drive.google.com/drive/u/1/folders/1m2Gxyjw05aF8yHYuiwa8L9S2modK-8e-"
                  ).catch(universalCatch)
                }
              >
                Dancer Resources
              </Button>
            </Box>
          </Container>
          {/* TODO: Implement server-side support for individual totals */}
          {/* {userData.teams.length > 0 &&
            userData.linkblue &&
            firstCommittee.individualTotals && (
              <Container maxWidth="full">
                <Text
                  width="full"
                  textAlign="center"
                  fontSize={theme.fontSizes["2xl"]}
                >
                  Spirit Point Count:
                </Text>
                <Text
                  width="full"
                  textAlign="center"
                  fontFamily={headingBold}
                  color="primary.600"
                  fontSize={theme.fontSizes["2xl"]}
                >
                  {userData.team.individualTotals[userData.linkblue]} points
                </Text>
              </Container>
            )} */}
          <View className="flex w-full gap-2 justify-center">
            <ProfileFooter
              profileScreenAuthFragment={profileScreenAuthFragment}
            />
          </View>
        </VStack>
      </>
    );
  } else {
    // This one doesn't really need to look as nice since it SHOULD be impossible to get here without the modal popping up
    return (
      <Center>
        <VStack>
          <H2>You are not logged in.</H2>
          <Button
            onPress={() => {
              trigger(AuthSource.LinkBlue);
            }}
            style={{ marginTop: 10 }}
          >
            Login with linkblue
          </Button>
          <Button
            onPress={() => {
              trigger(AuthSource.Anonymous);
            }}
          >
            Login anonymously
          </Button>
        </VStack>
      </Center>
    );
  }
};

export default ProfileScreen;
