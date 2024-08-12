import { ExplorerItem } from "./ExplorerItem";
import { useExplorerFeed } from "./useExplorerFeed";

import { Logger } from "@common/logger/Logger";
import { DateTime } from "luxon";
import { Text } from "native-base";
import { useMemo, useState } from "react";
import { View } from "react-native";

import type { FeedItem } from "react-native-rss-parser";


export interface FeedSortingItem {
  jsxElement: JSX.Element;
  published: DateTime;
}

export function useCombinedFeed(): {
  feed: FeedSortingItem[];
  loading: boolean;
  refresh: () => void;
} {
  const {
    blogPosts,
    podcasts,
    youtubeVideos,
    parsedServerFeed,
    loading,
    refresh,
  } = useExplorerFeed();

  const [blockedResources, setBlockedResources] = useState<string[]>([]);

  const feed = useMemo(() => {
    if (!loading) {
      const postComponents: FeedSortingItem[] =
        blogPosts
          ?.map((post: FeedItem) => {
            const link = post.id
              .replace("new.danceblue.org", "danceblue.org")
              .replace("preview.danceblue.org", "danceblue.org");
            if (blockedResources.includes(link)) {
              return null;
            }
            const published = DateTime.fromRFC2822(post.published);

            const jsxElement = (
              <View key={post.id}>
                <ExplorerItem
                  resourceLink={link}
                  blockResource={(resource) =>
                    setBlockedResources((prev) => [...prev, resource])
                  }
                  title={post.title}
                  textContent={post.content}
                />
                <Text paddingRight={3} width="100%" textAlign="right">
                  {published.toLocaleString()}
                </Text>
              </View>
            );

            return { jsxElement, published };
          })
          .filter(
            (component): component is Exclude<typeof component, null> =>
              component !== null
          ) ?? [];

      const podcastComponents: FeedSortingItem[] =
        podcasts
          ?.map((podcast: FeedItem) => {
            const podcastUrl = podcast.enclosures.find(
              (enclosure) => enclosure.mimeType === "audio/mpeg"
            )?.url;

            if (blockedResources.includes(podcastUrl ?? "")) {
              return null;
            }

            const published = DateTime.fromRFC2822(podcast.published);

            const jsxElement = (
              <View key={podcast.id}>
                <ExplorerItem
                  hasAudio={true}
                  resourceLink={podcastUrl}
                  blockResource={(resource) =>
                    setBlockedResources((prev) => [...prev, resource])
                  }
                  title={podcast.title}
                />
                <Text paddingRight={3} width="100%" textAlign="right">
                  {published.toLocaleString()}
                </Text>
              </View>
            );

            return { jsxElement, published };
          })
          .filter(
            (component): component is Exclude<typeof component, null> =>
              component !== null
          ) ?? [];

      const youtubeComponents: FeedSortingItem[] =
        youtubeVideos
          ?.map((video: FeedItem) => {
            let videoUrl: string | undefined;
            for (const link of video.links) {
              const videoId = new URL(link.url).searchParams.get("v");
              if (videoId) {
                videoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
                break;
              }
            }

            if (blockedResources.includes(videoUrl ?? "")) {
              return null;
            }
            const published = DateTime.fromISO(video.published);

            const jsxElement = (
              <View key={video.id}>
                <ExplorerItem
                  hasYouTubeVideo={true}
                  resourceLink={videoUrl}
                  blockResource={(resource) =>
                    setBlockedResources((prev) => [...prev, resource])
                  }
                  title={video.title}
                />
                <Text paddingRight={3} width="100%" textAlign="right">
                  {published.toLocaleString()}
                </Text>
              </View>
            );

            return { jsxElement, published };
          })
          .filter(
            (component): component is Exclude<typeof component, null> =>
              component !== null
          ) ?? [];

      const feedComponents: FeedSortingItem[] = parsedServerFeed.map((item) => {
        const jsxElement = (
          <View key={item.uuid}>
            <ExplorerItem
              title={item.title}
              textContent={item.textContent}
              image={item.image}
            />
            <Text paddingRight={3} width="100%" textAlign="right">
              {item.sortByDate.toLocaleString()}
            </Text>
          </View>
        );

        return { jsxElement, published: item.sortByDate };
      });

      return [
        ...postComponents,
        ...podcastComponents,
        ...youtubeComponents,
        ...feedComponents,
      ].sort((a, b) => b.published.toMillis() - a.published.toMillis());
    } else {
      return [];
    }
  }, [
    blockedResources,
    blogPosts,
    loading,
    parsedServerFeed,
    podcasts,
    youtubeVideos,
  ]);

  return {
    feed,
    loading,
    refresh: () => {
      refresh().catch((error: unknown) =>
        Logger.error("Error refreshing explorer feed", {
          error,
          source: "useCombinedFeed",
        })
      );
    },
  };
}
