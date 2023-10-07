import { useQuery } from "@apollo/client";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { App, Table } from "antd";
import { DateTime, Duration, Interval } from "luxon";
import { useEffect, useState } from "react";

import {
  extractServerError,
  handleApiError,
} from "../../tools/apolloErrorHandler";

export const EventsTable = () => {
  const antApp = App.useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: events,
    error,
    loading,
  } = useQuery(
    graphql(/* GraphQL */ `
      query ListEvents($page: Int, $pageSize: Int) {
        listEvents(page: $page, pageSize: $pageSize) {
          ok
          data {
            eventId
            title
            description
            duration
            occurrences
            summary
            images {
              url
              width
              height
              imageId
            }
          }
          page
          pageSize
          total
        }
      }
    `),
    {
      variables: {
        page,
        pageSize,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (error) {
      extractServerError(error).map((err) =>
        handleApiError(err, { message: antApp.message })
      );
    }
  }, [antApp.message, error]);

  return (
    <>
      <Table
        dataSource={events?.listEvents.data}
        rowKey={({ eventId }) => eventId}
        loading={loading}
        pagination={
          events
            ? {
                current: events.listEvents.page,
                pageSize: events.listEvents.pageSize,
                total: events.listEvents.total,
                showSizeChanger: true,
              }
            : false
        }
        onChange={(pagination) => {
          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
        }}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Occurrences",
            dataIndex: "occurrences",
            key: "occurrences",
            render: (
              occurrences: string[],
              {
                duration,
              }: NonNullable<typeof events>["listEvents"]["data"][number]
            ) => {
              const parsedOccurrences = occurrences.map((occurrence) => {
                if (!occurrence) {
                  return null;
                }
                const dateTime = DateTime.fromISO(occurrence);
                if (!dateTime.isValid) {
                  return null;
                }
                if (!duration) {
                  return dateTime;
                }
                const durationObj = Duration.fromISO(duration);
                if (durationObj.as("milliseconds") === 0) {
                  return dateTime;
                }
                return Interval.fromDateTimes(
                  dateTime,
                  dateTime.plus(durationObj)
                );
              });
              return (
                <ul style={{ padding: 0 }}>
                  {parsedOccurrences.map(
                    (occurrence, i) =>
                      occurrence && (
                        <li
                          key={`${i}-${occurrence.toString()}`}
                          style={{ listStyle: "none" }}
                        >
                          {occurrence.toLocaleString(DateTime.DATETIME_SHORT)}
                        </li>
                      )
                  )}
                </ul>
              );
            },
            width: 400,
          },
          {
            title: "Summary",
            dataIndex: "summary",
            key: "summary",
          },
        ]}
      />
    </>
  );
};
