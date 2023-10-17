import { useQuery } from "@apollo/client";
import { base64StringToArray } from "@ukdanceblue/common";
import { Descriptions, Empty, Flex, Image, List, Typography } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { DateTime, Duration, Interval } from "luxon";
import { useMemo } from "react";
import { thumbHashToDataURL } from "thumbhash";

import { useApolloStatusWatcher } from "../../../hooks/useApolloStatusWatcher";
import { GET_EVENT } from "../../../queries/eventQueries";

export function EventViewer({ uuid }: { uuid: string }) {
  const { data, loading, error, networkStatus } = useQuery(GET_EVENT, {
    variables: { uuid },
  });

  const { data: event } = data?.event ?? {};

  useApolloStatusWatcher({
    error,
    loadingMessage: loading ? "Loading event..." : undefined,
    networkStatus,
  });

  const occurrences = useMemo(
    () =>
      (event?.occurrences ?? []).map((occurrence) => {
        const dateTime = DateTime.fromISO(occurrence);
        if (event?.duration) {
          return Interval.after(dateTime, Duration.fromISO(event.duration));
        }
        return dateTime;
      }),
    [event]
  );

  if (!event) {
    return <Empty description="Event not found" style={{ marginTop: "1em" }} />;
  }

  return (
    <Flex vertical gap="middle" align="center">
      <Typography.Title level={2}>{event.title}</Typography.Title>
      {event.images.length > 0 && (
        <Flex
          gap="middle"
          align="center"
          style={{ maxHeight: "50vh", overflow: "auto" }}
        >
          <Image.PreviewGroup>
            {event.images.map((image) => {
              const thumbHash =
                image.thumbHash &&
                thumbHashToDataURL(base64StringToArray(image.thumbHash));

              return (
                <Image
                  src={image.url ?? image.imageData ?? "about:blank"}
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
        {event.summary && (
          <DescriptionsItem label="Summary">
            <Typography.Paragraph>{event.summary}</Typography.Paragraph>
          </DescriptionsItem>
        )}
        {event.description && (
          <Descriptions.Item label="Location">
            <Typography.Text>{event.location}</Typography.Text>
          </Descriptions.Item>
        )}
        {occurrences.length > 0 && (
          <Descriptions.Item label="Occurrences">
            <List>
              {occurrences.map((occurrence) => (
                <List.Item>
                  {occurrence.toLocaleString(
                    DateTime.DATETIME_MED_WITH_WEEKDAY
                  )}
                </List.Item>
              ))}
            </List>
          </Descriptions.Item>
        )}
        {event.description && (
          <Descriptions.Item label="Description">
            <Typography.Paragraph>{event.description}</Typography.Paragraph>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Flex>
  );
}
