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
  theme,
  VStack,
} from "native-base";
import { useMemo } from "react";

import { useLogin } from "#common/auth";
import JumbotronGeometric from "#common/components/JumbotronGeometric";
import { useThemeFonts } from "#common/customHooks";
import { universalCatch } from "#common/logging";
import type { FragmentType } from "#graphql/index";
import { getFragmentData, graphql } from "#graphql/index";

import { ProfileFooter } from "./ProfileFooter";

export const ProfileScreenAuthFragment = graphql(/* GraphQL */ `
  fragment ProfileScreenAuthFragment on LoginState {
    dbRole
    authSource
  }
`);

export const ProfileScreenUserFragment = graphql(/* GraphQL */ `
  fragment ProfileScreenUserFragment on PersonNode {
    name
    linkblue
    teams {
      position
      team {
        name
      }
    }
    primaryCommittee {
      identifier
      role
    }
  }
`);

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = ({
  profileScreenAuthFragment,
  profileScreenUserFragment,
}: {
  profileScreenAuthFragment: FragmentType<
    typeof ProfileScreenAuthFragment
  > | null;
  profileScreenUserFragment: FragmentType<
    typeof ProfileScreenUserFragment
  > | null;
}) => {
  const authData = getFragmentData(
    ProfileScreenAuthFragment,
    profileScreenAuthFragment
  );
  const userData = getFragmentData(
    ProfileScreenUserFragment,
    profileScreenUserFragment
  );

  const { body, mono } = useThemeFonts();

  const [loading, trigger] = useLogin();

  function jumboText() {
    let welcomeString = "Welcome to DanceBlue!";
    if (userData?.name) {
      welcomeString = `Hey ${userData.name}!`;
    }

    return welcomeString;
  }

  function nameString() {
    return userData?.name ?? "Anonymous";
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
        <JumbotronGeometric title={jumboText()} />
        <VStack flex={0.95} justifyContent="space-between" display="flex">
          <Container maxWidth="full">
            <Text
              width="full"
              textAlign="center"
              fontSize={theme.fontSizes["2xl"]}
            >
              You&apos;re currently logged in as:
            </Text>
            <Text
              width="full"
              textAlign="center"
              fontSize={theme.fontSizes["2xl"]}
              fontFamily={body}
              color="primary.600"
            >
              {nameString()}
            </Text>
            {committeeString && (
              <Text
                width="full"
                italic
                textAlign="center"
                color="primary.600"
                fontSize={theme.fontSizes.lg}
                fontFamily={mono}
              >
                {committeeString}
              </Text>
            )}
            <Box alignItems="center" width="full">
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
          <Container maxWidth="full" alignItems="center">
            <ProfileFooter
              profileScreenAuthFragment={profileScreenAuthFragment}
            />
          </Container>
        </VStack>
      </>
    );
  } else {
    // This one doesn't really need to look as nice since it SHOULD be impossible to get here without the modal popping up
    return (
      <Center>
        <VStack>
          <Text>You are not logged in.</Text>
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
