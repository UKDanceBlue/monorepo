import { useQuery } from "@apollo/client";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { App, Table } from "antd";
import { DateTime, Duration, Interval } from "luxon";
import { useEffect, useState } from "react";

import {
  extractServerError,
  handleApiError,
} from "../../tools/apolloErrorHandler";
import { SortDirection, StringComparator } from "@ukdanceblue/common";
import {
  EventResolverKeyedDateFilterItem,
  EventResolverKeyedIsNullFilterItem,
  EventResolverKeyedNumericFilterItem,
  EventResolverKeyedOneOfFilterItem,
  EventResolverKeyedStringFilterItem,
} from "@ukdanceblue/common/graphql-client-admin/raw-types";

export const EventsTable = () => {
  const antApp = App.useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOptions, setSortOptions] = useState<
    { field: string; direction: SortDirection }[]
  >([]);
  const [dateFilters, setDateFilters] = useState<
    EventResolverKeyedDateFilterItem[]
  >([]);
  const [isNullFilters, setIsNullFilters] = useState<
    EventResolverKeyedIsNullFilterItem[]
  >([]);
  const [numericFilters, setNumericFilters] = useState<
    EventResolverKeyedNumericFilterItem[]
  >([]);
  const [oneOfFilters, setOneOfFilters] = useState<
    EventResolverKeyedOneOfFilterItem[]
  >([]);
  const [stringFilters, setStringFilters] = useState<
    EventResolverKeyedStringFilterItem[]
  >([]);

  const {
    data: events,
    error,
    loading,
    fetchMore,
  } = useQuery(
    graphql(/* GraphQL */ `
      query ListEvents(
        $page: Int
        $pageSize: Int
        $sortBy: [String!]
        $sortDirection: [SortDirection!]
        $dateFilters: [EventResolverKeyedDateFilterItem!]
        $isNullFilters: [EventResolverKeyedIsNullFilterItem!]
        $numericFilters: [EventResolverKeyedNumericFilterItem!]
        $oneOfFilters: [EventResolverKeyedOneOfFilterItem!]
        $stringFilters: [EventResolverKeyedStringFilterItem!]
      ) {
        listEvents(
          page: $page
          pageSize: $pageSize
          sortBy: $sortBy
          sortDirection: $sortDirection
          dateFilters: $dateFilters
          isNullFilters: $isNullFilters
          numericFilters: $numericFilters
          oneOfFilters: $oneOfFilters
          stringFilters: $stringFilters
        ) {
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
        sortBy: sortOptions.map(({ field }) => field),
        sortDirection: sortOptions.map(({ direction }) => direction),
        dateFilters,
        isNullFilters,
        numericFilters,
        oneOfFilters,
        stringFilters,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (error) {
      extractServerError(error).forEach((err) =>
        handleApiError(err, { message: antApp.message })
      );
    }
  }, [antApp.message, error]);

  useEffect(() => {
    fetchMore({
      variables: {
        page,
        pageSize,
        sortBy: sortOptions.map(({ field }) => field),
        sortDirection: sortOptions.map(({ direction }) => direction),
        dateFilters,
        isNullFilters,
        numericFilters,
        oneOfFilters,
        stringFilters,
      },
    });
  }, [page, pageSize, sortOptions]);

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
        sortDirections={["ascend", "descend"]}
        onChange={(pagination, filters, sorter, extra) => {
          setPage(pagination.current || 1);
          setPageSize(pagination.pageSize || 10);
          const sortOptions: { field: string; direction: SortDirection }[] = [];
          for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
            if (sort.order && typeof sort.columnKey == "string") {
              sortOptions.push({
                field: sort.columnKey,
                direction:
                  sort.order === "ascend"
                    ? SortDirection.ASCENDING
                    : SortDirection.DESCENDING,
              });
            }
          }
          setSortOptions(sortOptions);
        }}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
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
