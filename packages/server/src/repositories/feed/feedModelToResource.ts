import { FeedNode } from "@ukdanceblue/common";

import type { FeedItem } from "@prisma/client";

export function feedItemModelToResource(feedItem: FeedItem): FeedNode {
  return FeedNode.init({
    id: feedItem.uuid,
    title: feedItem.title,
    textContent: feedItem.textContent,
    createdAt: feedItem.createdAt,
    updatedAt: feedItem.updatedAt,
  });
}
