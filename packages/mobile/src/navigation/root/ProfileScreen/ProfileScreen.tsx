import { useLogin } from "@common/auth";
import JumbotronGeometric from "@common/components/JumbotronGeometric";
import { useThemeFonts } from "@common/customHooks";
import {
  AuthSource,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  committeeNames,
} from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/dist/graphql-client-public";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/dist/graphql-client-public";
import {
  Box,
  Button,
  Center,
  Container,
  Spinner,
  Text,
  VStack,
  theme,
} from "native-base";
import { useMemo } from "react";

import { ProfileFooter } from "./ProfileFooter";
import {openURL} from "expo-linking";
import {universalCatch} from "@common/logging";

export const ProfileScreenAuthFragment = graphql(/* GraphQL */ `
  fragment ProfileScreenAuthFragment on LoginState {
    role {
      committeeIdentifier
      committeeRole
      dbRole
    }
    authSource
  }
`);

export const ProfileScreenUserFragment = graphql(/* GraphQL */ `
  fragment ProfileScreenUserFragment on PersonResource {
    name
    linkblue
    teams {
      position
      team {
        name
      }
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
    if (authData?.role.dbRole === DbRole.Committee) {
      if (
        authData.role.committeeIdentifier ===
          CommitteeIdentifier.viceCommittee &&
        authData.role.committeeRole === CommitteeRole.Chair
      ) {
        return "✨ Overall Chair ✨";
      }
      return `Committee: ${
        authData.role.committeeIdentifier
          ? committeeNames[authData.role.committeeIdentifier]
          : "Unknown"
      } ${authData.role.committeeRole}`;
    } else {
      return null;
    }
  }, [authData]);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (authData?.role.dbRole !== DbRole.None) {
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
              <Button onPress={() => openURL("https://drive.google.com/drive/u/1/folders/1m2Gxyjw05aF8yHYuiwa8L9S2modK-8e-").catch(
                universalCatch
              )}>Dancer Resources</Button>
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
              trigger(AuthSource.UkyLinkblue);
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
