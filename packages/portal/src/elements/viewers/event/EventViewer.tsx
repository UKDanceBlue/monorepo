import { base64StringToArray } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Descriptions, Empty, Flex, Image, List, Typography } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import { thumbHashToDataURL } from "thumbhash";

export const EventViewerFragment = graphql(/* GraphQL */ `
  fragment EventViewerFragment on EventResource {
    uuid
    title
    summary
    description
    location
    occurrences {
      occurrence
      fullDay
    }
    images {
      url
      imageData
      width
      height
      thumbHash
      alt
    }
  }
`);

export function EventViewer({
  eventFragment,
}: {
  eventFragment?: FragmentType<typeof EventViewerFragment> | undefined;
}) {
  const eventData = getFragmentData(EventViewerFragment, eventFragment);

  const occurrences = useMemo<
    { occurrence: Interval; fullDay: boolean }[] | undefined
  >(
    () =>
      eventData?.occurrences
        ? eventData.occurrences.map((occurrence) => {
            const interval = Interval.fromISO(occurrence.occurrence);
            return {
              occurrence: interval,
              fullDay: occurrence.fullDay,
            };
          })
        : undefined,
    [eventData?.occurrences]
  );

  if (!eventData) {
    return <Empty description="Event not found" style={{ marginTop: "1em" }} />;
  }

  return (
    <Flex vertical gap="middle" align="center">
      <Typography.Title level={2}>{eventData.title}</Typography.Title>
      {eventData.images.length > 0 && (
        <Flex
          gap="middle"
          align="center"
          style={{ maxHeight: "50vh", overflow: "auto" }}
        >
          <Image.PreviewGroup>
            {eventData.images.map((image) => {
              const thumbHash =
                image.thumbHash &&
                thumbHashToDataURL(base64StringToArray(image.thumbHash));

              return (
                <Image
                  src={
                    image.url?.toString() ?? image.imageData ?? "about:blank"
                  }
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
          </Image.PreviewGroup>
        </Flex>
      )}
      <Descriptions column={1} layout="vertical">
        {eventData.summary && (
          <DescriptionsItem label="Summary">
            <Typography.Paragraph>{eventData.summary}</Typography.Paragraph>
          </DescriptionsItem>
        )}
        {eventData.description && (
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
                    ? occurrence.occurrence.start?.toLocaleString(
                        DateTime.DATE_FULL
                      )
                    : occurrence.occurrence.start?.toLocaleString(
                        DateTime.DATETIME_SHORT
                      )}
                </List.Item>
              ))}
            </List>
          </Descriptions.Item>
        )}
        {eventData.description && (
          <Descriptions.Item label="Description">
            <Typography.Paragraph>{eventData.description}</Typography.Paragraph>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Flex>
  );
}
