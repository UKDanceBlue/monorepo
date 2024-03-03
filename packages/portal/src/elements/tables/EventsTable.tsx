import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useListQuery } from "@hooks/useListQuery";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useNavigate } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import {
  parseEventOccurrence,
  parsedEventOccurrenceToStrings,
} from "@ukdanceblue/common/client-parsers";
import {
  getFragmentData,
  graphql,
} from "@ukdanceblue/common/graphql-client-admin";
import { Button, Flex, Table } from "antd";
import { useCallback, useState } from "react";
import { useQuery } from "urql";

const EventsTableFragment = graphql(/* GraphQL */ `
  fragment EventsTableFragment on EventResource {
    uuid
    title
    description
    occurrences {
      uuid
      interval
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
  const navigate = useNavigate();

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
    },
    {
      allFields: ["uuid", "title", "description", "occurrenceStart", "summary"],
      dateFields: ["occurrenceStart"],
      isNullFields: [],
      numericFields: [],
      oneOfFields: [],
      stringFields: [],
    }
  );

  const [hidePast, setHidePast] = useState(false);

  const toggleHidePast = useCallback(() => {
    if (hidePast) {
      updateFilter("occurrenceStart", {
        field: "occurrenceStart",
        comparison: "GREATER_THAN_OR_EQUAL_TO",
        value: new Date().toISOString(),
      });
      setHidePast(false);
    } else {
      clearFilter("occurrenceStart");
      setHidePast(true);
    }
  }, [clearFilter, hidePast, updateFilter]);

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
          {hidePast ? "Show Past" : "Hide Past"}
        </Button>
      </div>
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
                | "occurrenceStart"
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
                  {record.occurrences.map((occurrence) => {
                    const [startString, endString] =
                      parsedEventOccurrenceToStrings(
                        parseEventOccurrence(occurrence)
                      );
                    return (
                      <li key={occurrence.uuid} style={{ listStyle: "none" }}>
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
            dataIndex: "uuid",
            render: (uuid: string) => (
              <Flex gap="small" align="center">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/events/$eventId/",
                      params: { eventId: uuid },
                    }).catch(console.error)
                  }
                  icon={<EyeOutlined />}
                />
                <Button
                  onClick={() =>
                    navigate({
                      to: "/events/$eventId/edit",
                      params: { eventId: uuid },
                    }).catch(console.error)
                  }
                  icon={<EditOutlined />}
                />
              </Flex>
            ),
          },
        ]}
      />
    </>
  );
};
