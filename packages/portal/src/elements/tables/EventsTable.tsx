import { useQuery } from "@apollo/client";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Table } from "antd";
import { DateTime, Duration, Interval } from "luxon";
import { useEffect } from "react";
import { SortDirection } from "@ukdanceblue/common";
import { useListQuery } from "../../hooks/useListQuery";
import { useApolloStatusWatcher } from "../../hooks/useApolloStatusWatcher";

export const EventsTable = () => {
  const { queryOptions, updatePagination, clearSorting, pushSorting } =
    useListQuery(
      {
        initPage: 1,
        initPageSize: 10,
        initSorting: [],
      },
      {
        allFields: [
          "eventId",
          "title",
          "description",
          "duration",
          "occurrences",
          "summary",
          "images",
        ],
        dateFields: [],
        isNullFields: [],
        numericFields: [],
        oneOfFields: [],
        stringFields: [],
      }
    );

  const {
    data: events,
    error,
    networkStatus,
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
        events(
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
            uuid
            title
            description
            duration
            occurrences
            summary
            images {
              url
              width
              height
              uuid
            }
          }
          page
          pageSize
          total
        }
      }
    `),
    {
      variables: queryOptions,
      notifyOnNetworkStatusChange: true,
    }
  );

  useApolloStatusWatcher({
    error,
    networkStatus,
    loadingMessage: loading ? "Loading events..." : undefined,
  });

  useEffect(() => {
    fetchMore({
      variables: queryOptions,
    }).catch(console.error);
  }, [queryOptions]);

  return (
    <>
      <Table
        dataSource={events?.events.data}
        rowKey={({ uuid }) => uuid}
        loading={loading}
        pagination={
          events
            ? {
                current: events.events.page,
                pageSize: events.events.pageSize,
                total: events.events.total,
                showSizeChanger: true,
              }
            : false
        }
        sortDirections={["ascend", "descend"]}
        onChange={(pagination, _filters, sorter, _extra) => {
          updatePagination({
            page: pagination.current,
            pageSize: pagination.pageSize,
          });
          clearSorting();
          for (const sort of Array.isArray(sorter) ? sorter : [sorter]) {
            if (!sort.order) {
              continue;
            }
            pushSorting({
              field: sort.field as
                | "eventId"
                | "title"
                | "description"
                | "duration"
                | "occurrences"
                | "summary"
                | "images",
              direction:
                sort.order === "ascend"
                  ? SortDirection.ASCENDING
                  : SortDirection.DESCENDING,
            });
          }
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
              { duration }: NonNullable<typeof events>["events"]["data"][number]
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
