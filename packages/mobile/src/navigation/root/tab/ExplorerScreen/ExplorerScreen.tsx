import { useNetworkStatus } from "@common/customHooks";
import { ScrollView, VStack } from "native-base";

import { ExplorerItem } from "./ExplorerItem";
import { FeedSortingItem, useCombinedFeed } from "./combineFeeds";

export const ExplorerScreen = () => {
  const [{ isConnected }, isNetStatusLoaded] = useNetworkStatus();

  const { feed } = useCombinedFeed();

  feed.sort((a, b) =>
    b.published.toMillis() - a.published.toMillis()
);

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <VStack h="full">
      <ScrollView flex={1}>
        {
          feed.map((item: FeedSortingItem) =>
            item.jsxElement
          )
        }
      </ScrollView>
    </VStack>
  );
};
