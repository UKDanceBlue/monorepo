import { Box, Button, Row, useTheme } from "native-base";
import type { SectionListRenderItem } from "react-native";
import { useWindowDimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import type { NotificationDeliveryFragment } from "@/common/fragments/NotificationScreenGQL";
import { showMessage } from "@/common/util/alertUtils";
import type { FragmentOf } from "@/graphql/index";

import { NotificationRowContent } from "./NotificationRowContent";

export const AnimatedNotificationRow: SectionListRenderItem<
  FragmentOf<typeof NotificationDeliveryFragment> | undefined,
  {
    title: string;
    data: (FragmentOf<typeof NotificationDeliveryFragment> | undefined)[];
  }
> = ({
  item: notification,
}: {
  item: FragmentOf<typeof NotificationDeliveryFragment> | undefined;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const { sizes } = useTheme();

  const sideMenuWidth = screenWidth * 0.2;
  const x = useSharedValue(0);
  const flung = useSharedValue(false);

  // A gesture handler that allows swiping the view left only, right will just bounce
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = x.value;
    },
    onActive: (event, ctx) => {
      const desiredTransition = ctx.startX + event.translationX;
      x.value =
        desiredTransition < 0
          ? desiredTransition
          : // Try to move the view right
            desiredTransition * 0.1;
    },
    onEnd: () => {
      x.value =
        x.value < -sideMenuWidth
          ? withSpring(-sideMenuWidth * 1.25)
          : withSpring(0);
    },
  });

  const animatedViewStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: x.value }] };
  });

  const buttonRowHeight = useSharedValue<number>(0);
  const animatedButtonRowStyle = useAnimatedStyle(() => {
    let width = sideMenuWidth;

    if (x.value < -(sideMenuWidth + sizes["4"])) {
      width -= x.value + sideMenuWidth + sizes["4"];
    }

    return { width, height: buttonRowHeight.value };
  }, [x, buttonRowHeight, flung]);

  const loading = notification == null;

  // TODO: When Backend for Read/Unread Notifications are done, pls add compatibility
  const unread = true as boolean;

  const canDelete = false as boolean;

  return (
    <PanGestureHandler
      onGestureEvent={canDelete ? panGestureHandler : () => undefined}
      minDist={15}
      enabled={canDelete}
    >
      <Animated.View style={animatedViewStyle}>
        <Row width={screenWidth + sideMenuWidth} collapsable={false} my="2">
          <Box
            mx="4"
            p="1.5"
            background={unread ? "primary.100" : undefined}
            rounded="md"
            shadow="2"
            style={{ shadowOpacity: 0.18 }}
            width={screenWidth - sizes[4] * 2}
            borderStyle="solid"
            borderWidth="1"
            borderColor="primary.600"
            onLayout={(event) => {
              buttonRowHeight.value = event.nativeEvent.layout.height;
            }}
          >
            <NotificationRowContent
              loading={loading}
              notification={notification}
              unread={unread}
            />
          </Box>
          <Animated.View style={animatedButtonRowStyle}>
            <Button
              disabled={!canDelete}
              onPress={() => {
                showMessage(
                  "Deleting notifications is currently disabled, sorry!"
                );
                // Alert.alert(
                //   "Delete Notification",
                //   "Are you sure you want to delete this notification?",
                //   [
                //     {
                //       style: "cancel",
                //       text: "Cancel",
                //     },
                //     {
                //       style: "destructive",
                //       text: "Delete",
                //       onPress: () => {
                //         if (item != null) {
                //           if (uid) {
                //             fbFirestore
                //               .collection("users")
                //               .doc(uid)
                //               .update({
                //                 notificationReferences:
                //                   firestore.FieldValue.arrayRemove(
                //                     item.reference
                //                   ),
                //               })
                //               .then(refreshUserData)
                //               .catch(universalCatch);
                //             if (
                //               item.reference?.parent.isEqual(
                //                 fbFirestore.collection(
                //                   `users/${uid}/past-notifications`
                //                 )
                //               )
                //             ) {
                //               item.reference.delete().catch(universalCatch);
                //             }
                //           }
                //         }
                //       },
                //     },
                //   ]
                // );
              }}
              width="100%"
              variant="solid"
              colorScheme="red"
            >
              Delete
            </Button>
          </Animated.View>
        </Row>
      </Animated.View>
    </PanGestureHandler>
  );
};
