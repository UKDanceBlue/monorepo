import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  base64StringToArray,
  intervalFromSomething,
} from "@ukdanceblue/common";
import { Button, Descriptions, Flex, Image, List, Typography } from "antd";
import DescriptionsItem from "antd/es/descriptions/Item.js";
import type { Interval } from "luxon";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { thumbHashToDataURL } from "thumbhash";

import type { FragmentOf } from "#graphql/index.js";
import { graphql,readFragment } from "#graphql/index.js";

import { useEventDeletePopup } from "../../components/event/EventDeletePopup";

export const EventViewerFragment = graphql(/* GraphQL */ `
  fragment EventViewerFragment on EventNode {
    id
    title
    summary
    description
    location
    occurrences {
      interval {
        start
        end
      }
      fullDay
    }
    images {
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

export function EventViewer({
  eventFragment,
}: {
  eventFragment?: FragmentOf<typeof EventViewerFragment> | undefined;
}) {
  const eventData = readFragment(EventViewerFragment, eventFragment);

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

  const navigate = useNavigate();
  const { EventDeletePopup, showModal } = useEventDeletePopup({
    uuid: eventData?.id ?? "",
    onDelete: () => {
      navigate({ to: "/events" }).catch((error: unknown) =>
        console.error(error)
      );
    },
  });

  if (!eventData) {
    return (
      <>
        <Typography.Title level={2}>
          <Button
            style={{ display: "inline", marginLeft: "1em" }}
            onClick={showModal}
            icon={<DeleteOutlined />}
            danger
            shape="circle"
          />
        </Typography.Title>
        {EventDeletePopup}
      </>
    );
  }

  return (
    <Flex vertical gap="middle" align="center">
      <Typography.Title level={2}>
        {eventData.title}
        <Link
          from="/events/$eventId"
          to="edit"
          params={{ eventId: eventData.id }}
          color="#efefef"
        >
          <EditOutlined style={{ marginLeft: "1em" }} />
        </Link>
        <Button
          style={{ display: "inline", marginLeft: "1em" }}
          onClick={showModal}
          icon={<DeleteOutlined />}
          danger
          shape="circle"
        />
      </Typography.Title>
      {EventDeletePopup}
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
            <Typography.Paragraph>{eventData.description}</Typography.Paragraph>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Created">
          {eventData.createdAt
            ? DateTime.fromJSDate(new Date(eventData.createdAt)).toLocaleString(
                DateTime.DATETIME_SHORT
              )
            : "Unknown"}
        </Descriptions.Item>
        <Descriptions.Item label="Updated">
          {eventData.updatedAt
            ? DateTime.fromJSDate(new Date(eventData.updatedAt)).toLocaleString(
                DateTime.DATETIME_SHORT
              )
            : "Unknown"}
        </Descriptions.Item>
      </Descriptions>
    </Flex>
  );
}
