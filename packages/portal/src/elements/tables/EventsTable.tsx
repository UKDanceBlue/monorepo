import { EditOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useTable } from "@refinedev/antd";
import type { LogicalFilter } from "@refinedev/core";
import { Link } from "@tanstack/react-router";
import {
  parsedEventOccurrenceToStrings,
  parseEventOccurrence,
} from "@ukdanceblue/common/client-parsers";
import { Button, Flex, Form, Input, List, Space, Table } from "antd";

import { graphql, type ResultOf } from "#graphql/index.js";

const EventsTableFragment = graphql(/* GraphQL */ `
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
  }
`);

export const EventsTable = () => {
  const { searchFormProps, tableProps } = useTable<
    ResultOf<typeof EventsTableFragment>
  >({
    meta: {
      gqlFragment: EventsTableFragment,
      fieldTypes: {
        occurrences: "date",
      },
    },
    syncWithLocation: true,
    sorters: {
      initial: [
        {
          field: "occurrences",
          order: "desc",
        },
      ],
    },
    onSearch(data) {
      if (typeof data !== "object" || data === null) {
        return [];
      }

      const filters: LogicalFilter[] = [];

      if ("title" in data && data.title) {
        filters.push({
          field: "title",
          operator: "contains",
          value: data.title,
        });
      }

      return filters;
    },
  });

  return (
    <>
      <List>
        <Form {...searchFormProps}>
          <Space.Compact>
            <Form.Item name="title">
              <Input placeholder="Search by title" />
            </Form.Item>
            <Button
              icon={<SearchOutlined />}
              htmlType="submit"
              type="primary"
            />
          </Space.Compact>
        </Form>
        <Table
          {...tableProps}
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
    </>
  );
};
