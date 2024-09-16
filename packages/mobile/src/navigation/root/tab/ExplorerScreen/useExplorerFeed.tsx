import { API_BASE_URL } from "@common/apiUrl";
import { useNetworkStatus } from "@common/customHooks";
import { Logger } from "@common/logger/Logger";
import { dateTimeFromSomething } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-mobile";
import type { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FeedItem } from "react-native-rss-parser";
import { parse } from "react-native-rss-parser";
import { useQuery } from "urql";

const serverFeedDocument = graphql(/* GraphQL */ `
  query ServerFeed {
    feed(limit: 20) {
      id
      title
      createdAt
      textContent
      image {
        url
        alt
        width
        height
        thumbHash
      }
    }
  }
`);

export interface ParsedServerFeedItem {
  uuid: string;
  title: string;
  textContent?: string | undefined;
  sortByDate: DateTime;
  image?:
    | {
        url: string;
        width: number;
        height: number;
        alt?: string | undefined;
        thumbHash?: string | undefined;
      }
    | undefined;
}

export function useExplorerFeed(): {
  blogPosts: FeedItem[] | undefined;
  podcasts: FeedItem[] | undefined;
  youtubeVideos: FeedItem[] | undefined;
  parsedServerFeed: ParsedServerFeedItem[];
  loading: boolean;
  refresh: () => Promise<void>;
} {
  const [{ isInternetReachable }] = useNetworkStatus();
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<FeedItem[] | undefined>();
  const [podcasts, setPodcasts] = useState<FeedItem[] | undefined>();
  // const [instagramPosts, setInstagramPosts] = useState();
  // const [tiktokPosts, setTikTokPosts] = useState();
  const [youtubeVideos, setYoutubeVideos] = useState<FeedItem[] | undefined>();

  const [serverFeedResult, refreshServerFeed] = useQuery({
    query: serverFeedDocument,
  });

  const parsedServerFeed = useMemo(() => {
    const parsedFeed: ParsedServerFeedItem[] = [];

    if (serverFeedResult.data) {
      for (const {
        id,
        title,
        textContent,
        createdAt,
        image,
      } of serverFeedResult.data.feed) {
        if (!createdAt) {
          continue;
        }

        let imageUrl: URL | null | undefined =
          typeof image?.url === "string" ? new URL(image.url) : image?.url;
        // Special case for localhost server
        if (imageUrl?.hostname === "localhost") {
          imageUrl = new URL(imageUrl.pathname, API_BASE_URL);
        }
        if (image) {
          if (!imageUrl) {
            continue;
          } else if (!imageUrl.protocol.startsWith("http")) {
            continue;
          }
        }

        parsedFeed.push({
          uuid: id,
          title,
          textContent: textContent ?? undefined,
          sortByDate: dateTimeFromSomething(createdAt),
          image:
            imageUrl && image
              ? {
                  url: imageUrl.href,
                  width: image.width,
                  height: image.height,
                  alt: image.alt ?? undefined,
                  thumbHash: image.thumbHash ?? undefined,
                }
              : undefined,
        });
      }
    }

    return parsedFeed;
  }, [serverFeedResult.data]);

  const loadFeed = useCallback(async () => {
    if (isInternetReachable === false) {
      setLoading(false);
    } else if (isInternetReachable === true) {
      setLoading(true);
      try {
        const dbWebsiteRSS = await fetch("https://danceblue.org/feed");
        const dbWebsiteXML = await dbWebsiteRSS.text();
        const dbWebsiteParsed = await parse(dbWebsiteXML);

        const blogPosts = dbWebsiteParsed.items.filter((item) =>
          item.categories.some((category) => category?.name !== "Podcast")
        );

        setBlogPosts(blogPosts);
        // console.log(JSON.stringify(blogPosts, null, 2));

        const podcastPosts = dbWebsiteParsed.items
          .filter((item) =>
            item.categories.some((category) => category?.name === "Podcast")
          )
          .filter((item) =>
            item.enclosures.some(
              (enclosure) => enclosure.mimeType === "audio/mpeg"
            )
          );

        setPodcasts(podcastPosts);
        // console.log(JSON.stringify(podcastPosts, null, 2));

        const youtubeRSS = await fetch(
          "https://www.youtube.com/feeds/videos.xml?channel_id=UCcF8V41xkzYkZ0B1IOXntjg"
        );
        const youtubeXML = await youtubeRSS.text();
        const youtubeParsed = await parse(youtubeXML);
        const youtubePosts = youtubeParsed.items;

        // console.log(JSON.stringify(youtubePosts, null, 2));

        setYoutubeVideos(youtubePosts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

      // TODO: Implement Instagram and TikTok RSS if possible
    }
  }, [isInternetReachable]);

  useEffect(() => {
    loadFeed().catch((error: unknown) => {
      Logger.error("Failed to load explore feed", { error });
    });
  }, [loadFeed, setLoading]);

  return {
    blogPosts,
    podcasts,
    youtubeVideos,
    loading,
    parsedServerFeed,
    refresh: async () => {
      try {
        refreshServerFeed({ requestPolicy: "network-only" });
        await loadFeed();
      } catch (error) {
        Logger.error("Failed to refresh explore feed", { error });
      }
    },
  };
}
