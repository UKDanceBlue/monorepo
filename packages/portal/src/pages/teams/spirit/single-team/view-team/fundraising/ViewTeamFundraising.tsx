import { FilterFilled } from "@ant-design/icons";
import { useListQuery } from "@hooks/useListQuery";
import { useMakeStringSearchFilterProps } from "@hooks/useMakeSearchFilterProps";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { SortDirection } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { AutoComplete, Empty, Flex, Form, InputNumber, Table } from "antd";
import { DateTime } from "luxon";
import { useState } from "react";
import { useMutation, useQuery } from "urql";

const ViewTeamFundraisingDocument = graphql(/* GraphQL */ `
  query ViewTeamFundraisingDocument(
    $teamUuid: GlobalId!
    $page: Int
    $pageSize: Int
    $sortBy: [String!]
    $sortDirection: [SortDirection!]
    $dateFilters: [FundraisingEntryResolverKeyedDateFilterItem!]
    $oneOfFilters: [FundraisingEntryResolverKeyedOneOfFilterItem!]
    $stringFilters: [FundraisingEntryResolverKeyedStringFilterItem!]
    $numericFilters: [FundraisingEntryResolverKeyedNumericFilterItem!]
  ) {
    team(uuid: $teamUuid) {
      data {
        dbFundsTeam {
          dbNum
          name
        }
        fundraisingEntries(
          page: $page
          pageSize: $pageSize
          sortBy: $sortBy
          sortDirection: $sortDirection
          dateFilters: $dateFilters
          oneOfFilters: $oneOfFilters
          stringFilters: $stringFilters
          numericFilters: $numericFilters
        ) {
          data {
            id
            amount
            amountUnassigned
            donatedByText
            donatedToText
            donatedOn
            assignments {
              id
              amount
              person {
                name
              }
            }
          }
          page
          pageSize
          total
        }
      }
    }
  }
`);

const SearchFundraisingTeamDocument = graphql(/* GraphQL */ `
  query SearchFundraisingTeam($fundraisingTeamSearch: String!) {
    dbFundsTeams(search: $fundraisingTeamSearch) {
      dbNum
      name
    }
  }
`);

const SetDbFundsTeamDocument = graphql(/* GraphQL */ `
  mutation SetDbFundsTeam($teamUuid: GlobalId!, $dbFundsTeamDbNum: Int!) {
    assignTeamToDbFundsTeam(
      dbFundsTeamDbNum: $dbFundsTeamDbNum
      teamId: $teamUuid
    )
  }
`);

const AddFundraisingAssignmentDocument = graphql(/* GraphQL */ `
  mutation AddFundraisingAssignment(
    $entryId: GlobalId!
    $personId: GlobalId!
    $amount: Float!
  ) {
    assignEntryToPerson(
      entryId: $entryId
      personId: $personId
      input: { amount: $amount }
    ) {
      id
    }
  }
`);

const UpdateFundraisingAssignmentDocument = graphql(/* GraphQL */ `
  mutation UpdateFundraisingAssignment($id: GlobalId!, $amount: Float!) {
    updateFundraisingAssignment(id: $id, input: { amount: $amount }) {
      id
      amount
      person {
        name
      }
    }
  }
`);

export function ViewTeamFundraising({
  members,
}: {
  members: { name: string; id: string }[];
}) {
  const { teamId: teamUuid } = useParams({ from: "/teams/$teamId/" });
  const [fundraisingTeamSearch, setFundraisingTeamSearch] = useState("");

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
      allFields: [
        "donatedOn",
        "createdAt",
        "updatedAt",
        "amount",
        "amountUnassigned",
        "teamId",
        "donatedTo",
        "donatedBy",
      ],
      dateFields: ["donatedOn", "createdAt", "updatedAt"],
      numericFields: ["amount", "amountUnassigned"],
      oneOfFields: ["teamId"],
      stringFields: ["donatedTo", "donatedBy"],
      booleanFields: [],
      isNullFields: [],
    }
  );

  const [{ data, fetching, error }, refreshFundraisingEntries] = useQuery({
    query: ViewTeamFundraisingDocument,
    variables: { ...queryOptions, teamUuid },
  });
  useQueryStatusWatcher({ fetching, error });

  const [{ data: dbFundsTeamData, ...dbFundsTeamState }] = useQuery({
    query: SearchFundraisingTeamDocument,
    variables: { fundraisingTeamSearch },
    pause: fundraisingTeamSearch.length < 3,
  });
  useQueryStatusWatcher(dbFundsTeamState);

  const [setDbFundsTeamState, setDbFundsTeam] = useMutation(
    SetDbFundsTeamDocument
  );
  useQueryStatusWatcher(setDbFundsTeamState);

  const [addFundraisingAssignmentState, addFundraisingAssignment] = useMutation(
    AddFundraisingAssignmentDocument
  );
  useQueryStatusWatcher(addFundraisingAssignmentState);
  const [updateFundraisingAssignmentState, updateFundraisingAssignment] =
    useMutation(UpdateFundraisingAssignmentDocument);
  useQueryStatusWatcher(updateFundraisingAssignmentState);

  return (
    <Flex vertical>
      {!data?.team.data.dbFundsTeam?.dbNum ? (
        <AutoComplete
          options={dbFundsTeamData?.dbFundsTeams.map(
            ({ dbNum, name }: { dbNum: number; name: string }) => ({
              value: dbNum,
              label: name,
            })
          )}
          onSearch={setFundraisingTeamSearch}
          onSelect={(value: number) => {
            if (
              confirm(
                "Are you sure you want to assign this team to the selected fundraising team? This can only be undone by the Tech Committee."
              )
            ) {
              setDbFundsTeam({ teamUuid, dbFundsTeamDbNum: value })
                .catch(() => {
                  alert(
                    "An error occurred while assigning the team to the fundraising team."
                  );
                })
                .finally(() => {
                  refreshFundraisingEntries();
                });
            }
          }}
          defaultValue={data?.team.data.dbFundsTeam?.dbNum}
          disabled={data?.team.data.dbFundsTeam?.dbNum != null}
        />
      ) : (
        <p>
          This team is linked to <i>{data.team.data.dbFundsTeam.name}</i> (#
          {data.team.data.dbFundsTeam.dbNum}) in DBFunds
        </p>
      )}
      <Table
        style={{ width: "100%" }}
        dataSource={data?.team.data.fundraisingEntries.data ?? undefined}
        rowKey={({ id }) => id}
        loading={fetching}
        pagination={
          data
            ? {
                current: data.team.data.fundraisingEntries.page,
                pageSize: data.team.data.fundraisingEntries.pageSize,
                total: data.team.data.fundraisingEntries.total,
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
            let { field } = sort;
            const { order } = sort;

            if (!order) {
              continue;
            }

            if (field === "donatedToText") {
              field = "donatedTo";
            } else if (field === "donatedByText") {
              field = "donatedBy";
            }
            pushSorting({
              field: field as
                | "teamId"
                | "donatedOn"
                | "amount"
                | "donatedTo"
                | "donatedBy"
                | "createdAt"
                | "updatedAt",
              direction:
                order === "ascend" ? SortDirection.asc : SortDirection.desc,
            });
          }
        }}
        columns={[
          {
            title: "Donated By",
            dataIndex: "donatedByText",
            key: "donatedByText",
            sorter: true,
            ...useMakeStringSearchFilterProps(
              "donatedBy",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Donated To",
            dataIndex: "donatedToText",
            key: "donatedToText",
            sorter: true,
            ...useMakeStringSearchFilterProps(
              "donatedTo",
              updateFilter,
              clearFilter
            ),
          },
          {
            title: "Donated On",
            dataIndex: "donatedOn",
            key: "donatedOn",
            sorter: true,
            render: (date: string) => DateTime.fromISO(date).toLocaleString(),
          },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            sorter: true,
            filterIcon() {
              return (
                <FilterFilled
                  style={{
                    color:
                      queryOptions.numericFilters.find(
                        ({ field }) => field === "amount"
                      )?.value != null
                        ? "#1890ff"
                        : undefined,
                  }}
                />
              );
            },
            filterDropdown: () => (
              <div
                style={{ padding: 8, display: "flex", flexDirection: "column" }}
              >
                <InputNumber
                  addonBefore=">"
                  onChange={(value) => {
                    if (value == null) {
                      clearFilter("amount");
                    } else {
                      const numericValue = Number.parseFloat(value.toString());
                      if (Number.isNaN(numericValue)) {
                        return;
                      }
                      updateFilter("amount", {
                        field: "amount",
                        value: numericValue,
                        comparison: "GREATER_THAN",
                      });
                    }
                  }}
                />
                <InputNumber
                  addonBefore="≤"
                  onChange={(value) => {
                    if (value == null) {
                      clearFilter("amount");
                    } else {
                      const numericValue = Number.parseFloat(value.toString());
                      if (Number.isNaN(numericValue)) {
                        return;
                      }
                      updateFilter("amount", {
                        field: "amount",
                        value: numericValue,
                        comparison: "LESS_THAN_OR_EQUAL_TO",
                      });
                    }
                  }}
                />
              </div>
            ),
          },
          Table.EXPAND_COLUMN,
          {
            title: "Amount Unassigned",
            dataIndex: "amountUnassigned",
            key: "amountUnassigned",
            sorter: true,
            filterIcon() {
              return (
                <FilterFilled
                  style={{
                    color:
                      queryOptions.numericFilters.find(
                        ({ field }) => field === "amountUnassigned"
                      )?.value != null
                        ? "#1890ff"
                        : undefined,
                  }}
                />
              );
            },
            filterDropdown: () => (
              <div
                style={{ padding: 8, display: "flex", flexDirection: "column" }}
              >
                <InputNumber
                  addonBefore=">"
                  onChange={(value) => {
                    if (value == null) {
                      clearFilter("amountUnassigned");
                    } else {
                      const numericValue = Number.parseFloat(value.toString());
                      if (Number.isNaN(numericValue)) {
                        return;
                      }
                      updateFilter("amountUnassigned", {
                        field: "amountUnassigned",
                        value: numericValue,
                        comparison: "GREATER_THAN",
                      });
                    }
                  }}
                />
                <InputNumber
                  addonBefore="≤"
                  onChange={(value) => {
                    if (value == null) {
                      clearFilter("amountUnassigned");
                    } else {
                      const numericValue = Number.parseFloat(value.toString());
                      if (Number.isNaN(numericValue)) {
                        return;
                      }
                      updateFilter("amountUnassigned", {
                        field: "amountUnassigned",
                        value: numericValue,
                        comparison: "LESS_THAN_OR_EQUAL_TO",
                      });
                    }
                  }}
                />
              </div>
            ),
          },
        ]}
        expandable={{
          rowExpandable: () => true,
          expandedRowRender: ({ assignments }) => (
            <Table
              dataSource={assignments}
              rowKey={({ id }) => id}
              locale={{
                emptyText: (
                  <Empty
                    description="No Assignments"
                    image={null}
                    imageStyle={{ height: 0, margin: 0 }}
                  />
                ),
              }}
              footer={() => (
                <Form
                  layout="inline"
                  onFinish={(v) => {}}
                  initialValues={{ amount: 0 }}
                >
                  <Form.Item
                    label="Person"
                    name="personId"
                    rules={[{ required: true, message: "Person is required" }]}
                  >
                    <AutoComplete
                      options={[]}
                      onSearch={() => {}}
                      onSelect={() => {}}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: "Amount is required" }]}
                  >
                    <InputNumber />
                  </Form.Item>
                </Form>
              )}
              columns={[
                {
                  title: "Person",
                  dataIndex: ["person", "name"],
                  key: "person",
                },
                {
                  title: "Amount",
                  dataIndex: "amount",
                  key: "amount",
                },
              ]}
            />
          ),
        }}
      />
    </Flex>
  );
}
