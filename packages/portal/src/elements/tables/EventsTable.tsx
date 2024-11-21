import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import {
  parsedEventOccurrenceToStrings,
  parseEventOccurrence,
} from "@ukdanceblue/common/client-parsers";
import { Button, Flex, Table } from "antd";
import { useCallback, useMemo } from "react";
import { useQuery } from "urql";

import { getFragmentData, graphql } from "@/graphql/index.js";
import { useListQuery } from "@/hooks/useListQuery.js";
import { useQueryStatusWatcher } from "@/hooks/useQueryStatusWatcher.js";

const EventsTableFragment = graphql(/* GraphQL */ `
  fragment EventsTableFragment on EventNode {
    id
    title
    description
    occurrences {
      id
      interval {
        start
        end
      }
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
  const {
    queryOptions,
    updatePagination,
    clearSorting,
    pushSorting,
    updateFilter,
    clearFilter,
  } = useListQuery(
    {
      initPage: 1,
      initPageSize: 10,
      initSorting: [],
      initialStateOverride: {
        dateFilters: [
          {
            field: "occurrenceStart",
            comparison: "GREATER_THAN_OR_EQUAL_TO",
            value: new Date().toISOString(),
          },
        ],
      },
    },
    {
      allFields: ["uuid", "title", "description", "occurrenceStart", "summary"],
      dateFields: ["occurrenceStart"],
      booleanFields: [],
      isNullFields: [],
      numericFields: [],
      oneOfFields: [],
      stringFields: [],
    }
  );

  const hasOccurrenceStartGTE = useMemo(() => {
    return queryOptions.dateFilters.some(
      (filter) =>
        (filter.field as string) === "occurrenceStart" &&
        filter.comparison === "GREATER_THAN_OR_EQUAL_TO"
    );
  }, [queryOptions.dateFilters]);
  const toggleHidePast = useCallback(() => {
    if (hasOccurrenceStartGTE) {
      // If we are already filtering for events that occur in the future, remove the filter
      clearFilter("occurrenceStart");
    } else {
      // If we are not already filtering for events that occur in the future, add the filter
      clearFilter("occurrenceStart");
      updateFilter("occurrenceStart", {
        field: "occurrenceStart",
        comparison: "GREATER_THAN_OR_EQUAL_TO",
        value: new Date().toISOString(),
      });
    }
  }, [clearFilter, hasOccurrenceStartGTE, updateFilter]);

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
      <div style={{ marginBottom: "1rem" }}>
        <Button onClick={() => toggleHidePast()}>
          {hasOccurrenceStartGTE ? "Show Past" : "Hide Past"}
        </Button>
      </div>
      <Table
        dataSource={listEventsData ?? undefined}
        rowKey={({ id }) => id}
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
                | "occurrenceStart"
                | "summary",
              direction:
                sort.order === "ascend"
                  ? SortDirection.asc
                  : SortDirection.desc,
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
                  {record.occurrences.map((occurrence) => {
                    const [startString, endString] =
                      parsedEventOccurrenceToStrings(
                        parseEventOccurrence(occurrence)
                      );
                    return (
                      <li key={occurrence.id} style={{ listStyle: "none" }}>
                        <i>{startString}</i> to <i>{endString}</i>
                      </li>
                    );
                  })}
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
            title: "Actions",
            dataIndex: "id",
            render: (uuid: string) => (
              <Flex gap="small" align="center">
                <Link from="/events" to="$eventId" params={{ eventId: uuid }}>
                  <Button icon={<EyeOutlined />} />
                </Link>
                <Link
                  from="/events"
                  to="$eventId/edit"
                  params={{ eventId: uuid }}
                >
                  <Button icon={<EditOutlined />} />
                </Link>
              </Flex>
            ),
          },
        ]}
      />
    </>
  );
};
