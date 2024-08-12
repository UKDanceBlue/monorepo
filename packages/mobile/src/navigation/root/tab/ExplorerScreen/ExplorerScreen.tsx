import { useCombinedFeed } from "./combineFeeds";

import { Text, VStack } from "native-base";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import type { FeedSortingItem } from "./combineFeeds";

export const ExplorerScreen = () => {
  const { feed, loading, refresh } = useCombinedFeed();

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <VStack h="full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      >
        {!loading && feed.length === 0 ? (
          <Text textAlign="center">Sorry, we couldn't find any content</Text>
        ) : null}
        {feed.map((item: FeedSortingItem) => item.jsxElement)}
      </ScrollView>
    </VStack>
  );
};
