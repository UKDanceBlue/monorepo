import type { FeedItem } from "@prisma/client";
import { FeedNode } from "@ukdanceblue/common";
import { DateTime } from "luxon";

export function feedItemModelToResource(feedItem: FeedItem): FeedNode {
  return FeedNode.init({
    id: feedItem.uuid,
    title: feedItem.title,
    textContent: feedItem.textContent,
    createdAt: DateTime.fromJSDate(feedItem.createdAt),
    updatedAt: DateTime.fromJSDate(feedItem.updatedAt),
  });
}
