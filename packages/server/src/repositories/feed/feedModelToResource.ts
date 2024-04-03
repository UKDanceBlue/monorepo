import type { FeedItem } from "@prisma/client";
import { FeedResource } from "@ukdanceblue/common";

export function feedItemModelToResource(feedItem: FeedItem): FeedResource {
  return FeedResource.init({
    uuid: feedItem.uuid,
    title: feedItem.title,
    textContent: feedItem.textContent,
  });
}
