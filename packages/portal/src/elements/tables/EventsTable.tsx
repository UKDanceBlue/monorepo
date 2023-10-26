import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import {
  parseEventOccurrence,
  parsedEventOccurrenceToString,
} from "@ukdanceblue/common/client-parsers";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Table } from "antd";
import { useQuery } from "urql";

const EventsTableFragment = graphql(/* GraphQL */ `
  fragment EventsTableFragment on EventResource {
    uuid
    title
    description
    occurrences {
      uuid
      occurrence
      fullDay
    }
    summary
  }
`);

const eventsTableQueryDocument = graphql(/* GraphQL */ `
  query EventsTable(
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
      page
      pageSize
      total
      data {
        ...EventsTableFragment
      }
    }
  }
`);

export const EventsTable = () => {
  const { queryOptions, updatePagination, clearSorting, pushSorting } =
    useListQuery(
      {
        initPage: 1,
        initPageSize: 10,
        initSorting: [],
      },
      {
        allFields: ["uuid", "title", "description", "occurrences", "summary"],
        dateFields: [],
        isNullFields: [],
        numericFields: [],
        oneOfFields: [],
        stringFields: [],
      }
    );

  const [{ fetching, error, data: eventsDocument }] = useQuery({
    query: eventsTableQueryDocument,
    variables: queryOptions,
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading events...",
  });

  const listEventsData = getFragmentData(
    EventsTableFragment,
    eventsDocument?.events.data
  );

  return (
    <>
      <Table
        dataSource={listEventsData ?? undefined}
        rowKey={({ uuid }) => uuid}
        loading={fetching}
        pagination={
          eventsDocument
            ? {
                current: eventsDocument.events.page,
                pageSize: eventsDocument.events.pageSize,
                total: eventsDocument.events.total,
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
                | "uuid"
                | "title"
                | "description"
                | "occurrences"
                | "summary",
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
            render: (_, record) => {
              return (
                <ul style={{ padding: 0 }}>
                  {record.occurrences.map((occurrence) => (
                    <li key={occurrence.uuid} style={{ listStyle: "none" }}>
                      {parsedEventOccurrenceToString(
                        parseEventOccurrence(occurrence)
                      )}
                    </li>
                  ))}
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
