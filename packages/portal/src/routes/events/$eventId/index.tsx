import { Breadcrumb, Show } from "@refinedev/antd";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  base64StringToArray,
  intervalFromSomething,
} from "@ukdanceblue/common";
import {
  Carousel,
  Descriptions,
  Empty,
  Flex,
  Image,
  List,
  Typography,
} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item.js";
import type { Interval } from "luxon";
import { DateTime } from "luxon";
import { useMemo } from "react";
import Markdown from "react-markdown";
import { thumbHashToDataURL } from "thumbhash";

import { graphql } from "#gql/index.js";
import { useTypedOne } from "#hooks/useTypedRefine.js";

export const EventViewerFragment = graphql(/* GraphQL */ `
  fragment EventViewerFragment on EventNode {
    id
    title
    summary
    description
    location
    occurrences {
      id
      interval {
        start
        end
      }
      fullDay
    }
    images {
      id
      url
      width
      height
      thumbHash
      alt
    }
    createdAt
    updatedAt
  }
`);

export function ViewEvent() {
  const { eventId } = useParams({ from: "/events/$eventId/" });
  const { data, isLoading } = useTypedOne({
    fragment: EventViewerFragment,
    props: {
      resource: "event",
      id: eventId,
    },
  });

  const eventData = data?.data;

  const occurrences = useMemo<
    { interval: Interval; fullDay: boolean }[] | undefined
  >(
    () =>
      eventData?.occurrences
        ? eventData.occurrences.map((occurrence) => {
            const interval = intervalFromSomething(occurrence.interval);
            return {
              interval,
              fullDay: occurrence.fullDay,
            };
          })
        : undefined,
    [eventData?.occurrences]
  );

  return (
    <Show
      breadcrumb={<Breadcrumb />}
      title={eventData?.title}
      recordItemId={eventId}
      isLoading={isLoading}
    >
      <Flex vertical gap="middle" align="center">
        {!eventData ? (
          <Empty />
        ) : (
          <>
            {eventData.images.length > 0 && (
              <Flex
                gap="middle"
                align="center"
                style={{ maxHeight: "50vh", overflow: "auto" }}
              >
                <Image.PreviewGroup>
                  <Carousel>
                    {eventData.images.map((image) => {
                      const thumbHash =
                        image.thumbHash &&
                        thumbHashToDataURL(
                          base64StringToArray(image.thumbHash)
                        );

                      return (
                        <Image
                          key={image.id}
                          src={image.url?.toString() ?? "about:blank"}
                          fallback={thumbHash ?? "about:blank"}
                          loading="lazy"
                          placeholder={
                            thumbHash == null ? (
                              false
                            ) : (
                              <Image
                                src={thumbHash}
                                width={image.width}
                                height={image.height}
                              />
                            )
                          }
                          width={image.width}
                          height={image.height}
                          alt={image.alt ?? undefined}
                        />
                      );
                    })}
                  </Carousel>
                </Image.PreviewGroup>
              </Flex>
            )}
            <Descriptions column={1} layout="vertical">
              {eventData.summary && (
                <DescriptionsItem label="Summary">
                  <Typography.Paragraph>
                    {eventData.summary}
                  </Typography.Paragraph>
                </DescriptionsItem>
              )}
              {eventData.location && (
                <Descriptions.Item label="Location">
                  <Typography.Text>{eventData.location}</Typography.Text>
                </Descriptions.Item>
              )}
              {occurrences && occurrences.length > 0 && (
                <Descriptions.Item label="Occurrences">
                  <List>
                    {occurrences.map((occurrence) => (
                      <List.Item>
                        {occurrence.fullDay
                          ? occurrence.interval.start?.toLocaleString(
                              DateTime.DATE_FULL
                            )
                          : occurrence.interval.start?.toLocaleString(
                              DateTime.DATETIME_SHORT
                            )}
                      </List.Item>
                    ))}
                  </List>
                </Descriptions.Item>
              )}
              {eventData.description && (
                <Descriptions.Item label="Description">
                  <div style={{ display: "block" }}>
                    <Markdown>{eventData.description}</Markdown>
                  </div>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Created">
                {eventData.createdAt
                  ? DateTime.fromJSDate(
                      new Date(eventData.createdAt)
                    ).toLocaleString(DateTime.DATETIME_SHORT)
                  : "Unknown"}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {eventData.updatedAt
                  ? DateTime.fromJSDate(
                      new Date(eventData.updatedAt)
                    ).toLocaleString(DateTime.DATETIME_SHORT)
                  : "Unknown"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Flex>
    </Show>
  );
}

export const Route = createFileRoute("/events/$eventId/")({
  component: ViewEvent,
});
