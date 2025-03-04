import { FlatList } from "react-native-gesture-handler";

import { FeedItem } from "~/components/feed/FeedItem";
import { useFeed } from "~/lib/feed/useFeed";

export default function Explore() {
  const { feed, loading, refresh } = useFeed();

  return (
    <FlatList
      onRefresh={refresh}
      refreshing={loading}
      data={feed}
      renderItem={({ item }) => <FeedItem data={item} key={item.key} />}
    />
  );
}
