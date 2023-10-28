import { base64StringToArray } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import {
  Descriptions,
  Empty,
  Flex,
  Image,
  Input,
  List,
  Tooltip,
  Typography,
} from "antd";
import DescriptionsItem from "antd/es/descriptions/Item";
import { DateTime, Interval } from "luxon";
import { useMemo } from "react";
import { thumbHashToDataURL } from "thumbhash";
import type { UseQueryExecute } from "urql";

import { EventEditorFragment } from "./EventEditorGQL";
import { useEventEditorForm } from "./useEventEditorForm";

export function EventEditor({
  eventFragment,
  refetchEvent,
}: {
  eventFragment?: FragmentType<typeof EventEditorFragment> | undefined;
  refetchEvent?: UseQueryExecute | undefined;
}) {
  const { formApi } = useEventEditorForm(eventFragment, refetchEvent);

  const eventData = getFragmentData(EventEditorFragment, eventFragment);

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

  if (!eventFragment || !eventData) {
    return <Empty description="Event not found" style={{ marginTop: "1em" }} />;
  }

  return (
    <Flex vertical gap="middle" align="center">
      <formApi.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            formApi.handleSubmit().catch(console.error);
          }}
        >
          <formApi.Field
            name="title"
            onChange={(value) => (!value ? "Title is required" : undefined)}
            children={(field) => (
              <Tooltip
                title={field.state.meta.errors.join("\n")}
                color="volcano"
                open={field.state.meta.errors.length > 0}
              >
                <Input
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Tooltip>
            )}
          />
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
                        image.url?.toString() ??
                        image.imageData ??
                        "about:blank"
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
                <Typography.Paragraph>
                  {eventData.description}
                </Typography.Paragraph>
              </Descriptions.Item>
            )}
          </Descriptions>
        </form>
      </formApi.Provider>
    </Flex>
  );
}
