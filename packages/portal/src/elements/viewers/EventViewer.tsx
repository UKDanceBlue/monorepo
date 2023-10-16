import { useQuery } from "@apollo/client";
import { base64StringToArray } from "@ukdanceblue/common";
import { Image, List, Typography } from "antd";
import { DateTime, Duration, Interval } from "luxon";
import { useMemo } from "react";
import { thumbHashToDataURL } from "thumbhash";

import { useApolloStatusWatcher } from "../../hooks/useApolloStatusWatcher";
import { GET_EVENT } from "../../queries/eventQueries";

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

  return (
    <div>
      <Typography.Title level={2}>{event?.title}</Typography.Title>
      <Image.PreviewGroup>
        {event?.images.map((image) => {
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
      <Typography.Paragraph type="secondary">
        {event?.summary}
      </Typography.Paragraph>
      <Typography.Text>{event?.location}</Typography.Text>
      <List>
        {occurrences.map((occurrence) => (
          <List.Item>
            {occurrence.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
          </List.Item>
        ))}
      </List>
      <Typography.Paragraph>{event?.description}</Typography.Paragraph>
    </div>
  );
}
