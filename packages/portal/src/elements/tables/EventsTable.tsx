import { useApolloStatusWatcher } from "@hooks/useApolloStatusWatcher";
import { useListQuery } from "@hooks/useListQuery";
import { LIST_EVENTS } from "@queries/eventQueries";
import { Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import { Table } from "antd";
import { DateTime, Duration, Interval } from "luxon";
import { useQuery } from "urql";

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

  const [{ data: events, error, fetching }, fetchMore] = useQuery({
    query: LIST_EVENTS,
    variables: queryOptions,
  });

  useApolloStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading events...",
  });

  return (
    <>
      <Table
        dataSource={events?.events.data}
        rowKey={({ uuid }) => uuid}
        loading={fetching}
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
          {
            title: "Open",
            dataIndex: "uuid",
            key: "uuid",
            render: (uuid: string) => (
              <Link to="/events/$eventId" params={{ eventId: uuid }}>
                View
              </Link>
            ),
          },
        ]}
      />
    </>
  );
};
