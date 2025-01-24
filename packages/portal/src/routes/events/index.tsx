import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import { getDefaultSortOrder, List, MarkdownField } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  parsedEventOccurrenceToStrings,
  parseEventOccurrence,
} from "@ukdanceblue/common/client-parsers";
import { Button, Flex, Table } from "antd";

import { RefineSearchForm } from "#elements/components/RefineSearchForm.tsx";
import { graphql } from "#gql/index.js";
import { useTypedTable } from "#hooks/useTypedRefine.ts";

export const EventsTableFragment = graphql(/* GraphQL */ `
  fragment EventsTableFragment on EventNode {
    id
    title
    occurrences {
      id
      interval {
        start
        end
      }
      fullDay
    }
    summary
    description
  }
`);

function Events() {
  const { searchFormProps, tableProps, sorters } = useTypedTable({
    fragment: EventsTableFragment,
    props: {
      resource: "event",
      sorters: {
        initial: [
          {
            field: "occurrences",
            order: "desc",
          },
        ],
      },
    },
    fieldTypes: {
      occurrences: "date",
    },
  });

  return (
    <List>
      <RefineSearchForm searchFormProps={searchFormProps} />
      <Table
        {...tableProps}
        expandable={{
          rowExpandable: (record) => record.description !== null,
          expandedRowRender: (record) => (
            <MarkdownField value={record.description ?? "N/A"} />
          ),
        }}
        rowKey="id"
        columns={[
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: true,
          },
          {
            title: "Occurrences",
            dataIndex: "occurrences",
            key: "occurrences",
            sorter: true,
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
            defaultSortOrder: getDefaultSortOrder("occurrences", sorters),
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
    </List>
  );
}

export const Route = createFileRoute("/events/")({
  component: Events,
});
