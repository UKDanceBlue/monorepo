import { Button, Text, VStack } from "native-base";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import type { FeedSortingItem } from "./combineFeeds";
import { useCombinedFeed } from "./combineFeeds";

// TODO: Lazy load the actual feed JSON as well as the content

export const ExplorerScreen = () => {
  const { feed, loading, refresh } = useCombinedFeed();
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    setLimit(5);
  }, [loading]);

  /*
   * Called by React Native when rendering the screen
   */
  return (
    <VStack h="full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        onEnded={() => {
          console.log("onEnded");
        }}
      >
        {!loading && feed.length === 0 ? (
          <Text textAlign="center">Sorry, we couldn't find any content</Text>
        ) : (
          <>
            {feed
              .slice(0, limit)
              .map((item: FeedSortingItem) => item.jsxElement)}
            {/* TODO: Come up with a better solution than this button, would be nice to have infinite scroll */}
            <Button onPress={() => setLimit((limit) => limit + 5)}>
              Load more
            </Button>
          </>
        )}
      </ScrollView>
    </VStack>
  );
};
