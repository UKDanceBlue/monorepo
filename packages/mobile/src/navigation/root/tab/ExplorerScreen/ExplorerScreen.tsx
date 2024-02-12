import { ScrollView, VStack } from "native-base";

import type { FeedSortingItem } from "./combineFeeds";
import { useCombinedFeed } from "./combineFeeds";

export const ExplorerScreen = () => {
  const { feed } = useCombinedFeed();

  feed.sort((a, b) => b.published.toMillis() - a.published.toMillis());

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <VStack h="full">
      <ScrollView flex={1}>
        {feed.map((item: FeedSortingItem) => item.jsxElement)}
      </ScrollView>
    </VStack>
  );
};
