import { DateTime } from "luxon";
import { Text } from "native-base";
import { useMemo } from "react";
import type { FeedItem } from "react-native-rss-parser";

import { ExplorerItem } from "./ExplorerItem";
import { useExplorerFeed } from "./useExplorerFeed";

export interface FeedSortingItem {
  jsxElement: JSX.Element;
  published: DateTime;
}

export function useCombinedFeed(): {
  feed: FeedSortingItem[];
} {
  const { blogPosts, podcasts, youtubeVideos, loading } = useExplorerFeed();

  const feed = useMemo(() => {
    if (!loading) {
      const postComponents: FeedSortingItem[] =
        blogPosts?.map((post: FeedItem) => {
          const published = DateTime.fromRFC2822(post.published);

          const jsxElement = (
            <>
              <ExplorerItem
                resourceLink={post.id
                  .replace("new.danceblue.org", "danceblue.org")
                  .replace("preview.danceblue.org", "danceblue.org")}
                title={post.title}
                textContent={`${post.content.substring(0, 350)} [...]`}
              />
              <Text paddingRight={3} width="100%" textAlign="right">
                {published.toLocaleString()}
              </Text>
            </>
          );

          return { jsxElement, published };
        }) ?? [];

      const podcastComponents: FeedSortingItem[] =
        podcasts?.map((podcast: FeedItem) => {
          const podcastUrl = podcast.enclosures.find(
            (enclosure) => enclosure.mimeType === "audio/mpeg"
          )?.url;
          const published = DateTime.fromRFC2822(podcast.published);

          const jsxElement = (
            <>
              <ExplorerItem
                hasAudio={true}
                resourceLink={podcastUrl}
                title={podcast.title}
              />
              <Text paddingRight={3} width="100%" textAlign="right">
                {published.toLocaleString()}
              </Text>
            </>
          );

          return { jsxElement, published };
        }) ?? [];

      const youtubeComponents: FeedSortingItem[] =
        youtubeVideos?.map((video: FeedItem) => {
          console.log(video);
          let videoUrl: string | undefined;
          for (const link of video.links) {
            const videoId = new URL(link.url).searchParams.get("v");
            if (videoId) {
              videoUrl = `https://www.youtube.com/embed/${videoId}`;
              break;
            }
          }
          const published = DateTime.fromISO(video.published);

          const jsxElement = (
            <>
              <ExplorerItem hasYouTubeVideo={true} resourceLink={videoUrl} />
              <Text paddingRight={3} width="100%" textAlign="right">
                {published.toLocaleString()}
              </Text>
            </>
          );

          return { jsxElement, published };
        }) ?? [];

      return [
        ...postComponents,
        ...podcastComponents,
        ...youtubeComponents,
      ].sort((a, b) => b.published.toMillis() - a.published.toMillis());
    } else {
      return [];
    }
  }, [blogPosts, loading, podcasts, youtubeVideos]);

  return { feed };
}
