import { startCase } from "lodash";
import { Button, Center, Container, Spinner, Text, VStack, theme } from "native-base";

import { useLinkBlueLogin } from "../../../common/auth";
import JumbotronGeometric from "../../../common/components/JumbotronGeometric";
import { useThemeFonts } from "../../../common/customHooks";
import { showMessage } from "../../../common/util/alertUtils";
import { useAuthData, useFirebase, useUserData } from "../../../context";

import { ProfileFooter } from "./ProfileFooter";

/**
 * Component for "Profile" screen in main navigation
 */
const ProfileScreen = () => {
  const authData = useAuthData();
  const userData = useUserData();
  const {
    fbAuth, fbFunctions
  } = useFirebase();

  const {
    headingBold, body, mono
  } = useThemeFonts();

  const [ loading, trigger ] = useLinkBlueLogin(fbAuth, fbFunctions);

  function jumboText() {
    let welcomeString = "Welcome to DanceBlue!";
    if (userData.firstName != null && !authData.isAnonymous) {
      welcomeString = `Hey ${userData.firstName}!`;
    }

    return welcomeString;
  }

  function nameString() {
    let userName = "Anonymous :)";
    if (userData.firstName != null && userData.lastName != null && !authData.isAnonymous) {
      userName = `${ userData.firstName } ${ userData.lastName }`;
    }

    return userName;
  }

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (authData.isLoggedIn) {
    return (
      <>
        <JumbotronGeometric title={jumboText()}/>
        <VStack flex={0.95} justifyContent="space-between" display="flex">
          <Container maxWidth="full">
            <Text width="full" textAlign="center" fontSize={theme.fontSizes["2xl"]}>You&apos;re currently logged in as:</Text>
            <Text
              width="full"
              textAlign="center"
              fontSize={theme.fontSizes["2xl"]}
              fontFamily={body}
              color="primary.600">{nameString()}</Text>
            {authData.authClaims?.dbRole === "committee" && (
              <Text
                width="full"
                italic
                textAlign="center"
                color="primary.600"
                fontSize={theme.fontSizes.lg}
                fontFamily={mono}>
                {[
                  typeof authData.authClaims.committee === "string" ? startCase(authData.authClaims.committee) : undefined,
                  typeof authData.authClaims.committeeRank === "string" ? startCase(authData.authClaims.committeeRank) : undefined
                ].filter((s) => s != null).join(" - ")}
              </Text>
            )}
          </Container>
          {
            userData.team && userData.linkblue && userData.team.individualTotals &&
          (
            <Container maxWidth="full">
              <Text width="full" textAlign="center" fontSize={theme.fontSizes["2xl"]}>Spirit Point Count:</Text>
              <Text
                width="full"
                textAlign="center"
                fontFamily={headingBold}
                color="primary.600"
                fontSize={theme.fontSizes["2xl"]}>{userData.team.individualTotals[userData.linkblue]} points</Text>
            </Container>
          )
          }
          <Container maxWidth="full" alignItems="center">
            <ProfileFooter/>
          </Container>
        </VStack>
      </>
    );
  } else {
    // This one doesn't really need to look as nice since it SHOULD be impossible to get here without the modal popping up
    return (
      <Center>
        <VStack>
          <Text>
          You are not logged in.
          </Text>
          <Button
            onPress={() => {
              trigger();
            }}
            style={{ marginTop: 10 }}
          >
          Login with linkblue
          </Button>
          <Button
            onPress={() => {
              fbAuth.signInAnonymously().catch((error) => {
                showMessage(error);
              });
            }}>
          Login anonymously
          </Button>
        </VStack>
      </Center>
    );
  }
};

export default ProfileScreen;
