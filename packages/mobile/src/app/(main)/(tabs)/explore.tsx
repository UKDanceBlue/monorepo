import { ActivityIndicator, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { FeedItem } from "~/components/feed/FeedItem";
import { useFeed } from "~/lib/feed/useFeed";

export default function Explore() {
  const { feed, loading, refresh } = useFeed();

  if (loading) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={refresh}
      refreshing={loading}
      data={feed}
      renderItem={({ item }) => <FeedItem data={item} key={item.key} />}
    />
  );
}
