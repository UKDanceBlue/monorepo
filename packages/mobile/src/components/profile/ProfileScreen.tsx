import {
  AccessLevel,
  AuthSource,
  committeeNames,
  CommitteeRole,
  type EffectiveCommitteeRole,
} from "@ukdanceblue/common";
import { Button, Center, Container, Spinner, Text, VStack } from "native-base";
import React from "react";
import { View } from "react-native";

import { type FragmentOf } from "~/api";
import { useLogin } from "~/lib/hooks/useLogin";
import { useLoginState } from "~/lib/hooks/useLoginState";

import Jumbotron from "../ui/jumbotron";
import { H2 } from "../ui/typography";
import { ProfileFooter } from "./ProfileFooter";
import type {
  ProfileScreenAuthFragment,
  ProfileScreenUserFragment,
} from "./ProfileScreenFragments";

/**
 * Component for "Profile" screen in main navigation
 */

// TODO: Don't expect these fragments to be defined
const ProfileScreen = ({
  profileScreenAuthFragment,
}: {
  profileScreenAuthFragment: FragmentOf<
    typeof ProfileScreenAuthFragment
  > | null;
  profileScreenUserFragment: FragmentOf<
    typeof ProfileScreenUserFragment
  > | null;
}) => {
  const { authorization, me } = useLoginState();

  const [loading, trigger] = useLogin();

  let welcomeString = "Welcome to DanceBlue!";
  if (me?.name) {
    welcomeString = `Hey ${me.name}!`;
  }

  let chosenRole: EffectiveCommitteeRole | undefined =
    authorization?.effectiveCommitteeRoles[0];

  for (const role of authorization?.effectiveCommitteeRoles ?? []) {
    if (role.role === CommitteeRole.Chair) {
      chosenRole = role;
    } else if (
      role.role === CommitteeRole.Coordinator &&
      chosenRole?.role !== CommitteeRole.Chair
    ) {
      chosenRole = role;
    }
  }

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (authorization?.accessLevel !== AccessLevel.None) {
    return (
      <>
        <Jumbotron
          title={welcomeString}
          geometric="lightblue"
          className="h-full flex flex-1"
        >
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
                {me?.name ?? "Anonymous"}
              </Text>
              {chosenRole && (
                <Text
                  width="full"
                  italic
                  textAlign="center"
                  color="primary.600"
                  className="text-lg"
                >
                  {`${committeeNames[chosenRole.identifier]} ${chosenRole.role}`}
                </Text>
              )}
            </Container>
            <View className="flex w-full gap-2 justify-center">
              <ProfileFooter
                profileScreenAuthFragment={profileScreenAuthFragment}
              />
            </View>
          </VStack>
        </Jumbotron>
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
