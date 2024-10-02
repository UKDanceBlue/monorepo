import { DownloadOutlined } from "@ant-design/icons";
import { useMarathon } from "@config/marathonContext";
import { SpreadsheetUploader } from "@elements/components/SpreadsheetUploader";
import { graphql } from "@graphql/index";
import { createFileRoute } from "@tanstack/react-router";
import { routerAuthCheck } from "@tools/routerAuthCheck";
import { AccessLevel, CommitteeIdentifier } from "@ukdanceblue/common";
import { Button, Flex, Table, Typography } from "antd";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { useClient, useQuery } from "urql";
import { utils, writeFile } from "xlsx";

interface FundraisingTeam {
  name: string;
  active: boolean;
  identifier: number;
  total: number;
}

interface FundraisingEntry {
  donatedBy: string | null;
  donatedTo: string | null;
  donatedOn: string;
  amount: number;
}

const getEntryDocument = graphql(/* GraphQL */ `
  query DbFundsEntryViewer($year: String!, $dbNum: Int!) {
    rawFundraisingEntries(marathonYear: $year, identifier: $dbNum)
  }
`);

interface GcFormat {
  "Mil ID": number;
  "Salesforce ID": string;
  "Donor Name": string;
  "Salutation": string;
  "Transaction Type": string;
  "Online Gift?": string;
  "Unit": string;
  "giftproc": string;
  "BegFY": string;
  "CFY": string;
  "giftamount": number;
  "giftacctnm": string;
  "table_val": string;
  "giftacctno": string;
  "giftsolic": string;
  "giftcomm": string;
  "addrline1": string;
  "addrline2": string;
  "addrline3": string;
  "addrcity": string;
  "addrplace": string;
  "addrzipcod": string;
  "intaddress": string;
  "Constituent Type": string;
  "Donor Name 3": string;
  "coretext": string;
  "CFY $": number;
}
const GcFormatKeys = [
  "Mil ID",
  "Salesforce ID",
  "Donor Name",
  "Salutation",
  "Transaction Type",
  "Online Gift?",
  "Unit",
  "giftproc",
  "BegFY",
  "CFY",
  "giftamount",
  "giftacctnm",
  "table_val",
  "giftacctno",
  "giftsolic",
  "giftcomm",
  "addrline1",
  "addrline2",
  "addrline3",
  "addrcity",
  "addrplace",
  "addrzipcod",
  "intaddress",
  "Constituent Type",
  "Donor Name 3",
  "coretext",
  "CFY $",
] as const satisfies (keyof GcFormat)[];
interface NfgFormat {
  "Mil ID": number;
  "Salesforce ID": string;
  "donor_first_name": string;
  "donor_last_name": string;
  "Transaction Type": string;
  "Online Gift?": string;
  "Unit": string;
  "giftproc": string;
  "BegFY": string;
  "CFY": string;
  "giftamount": number;
  "giftacctnm": string;
  "table_val": string;
  "giftacctno": string;
  "giftsolic": string;
  "giftcomm": string;
  "addrline1": string;
  "addrline2": string;
  "addrline3": string;
  "addrcity": string;
  "addrplace": string;
  "addrzipcod": string;
  "intaddress": string;
  "Constituent Type": string;
  "Donor Name 3": string;
  "coretext": string;
  "CFY $": number;
}

function DbFundsViewer() {
  const marathonYear = useMarathon()?.year;

  const [mainData] = useQuery({
    query: graphql(/* GraphQL */ `
      query DbFundsViewer($year: String!) {
        rawFundraisingTotals(marathonYear: $year)
      }
    `),
    pause: !marathonYear,
    variables: {
      year: marathonYear ?? "",
    },
  });

  const parsedMainData = useMemo(() => {
    if (!marathonYear || !mainData.data) {
      return null;
    }

    return JSON.parse(mainData.data.rawFundraisingTotals) as FundraisingTeam[];
  }, [mainData.data, marathonYear]);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const urql = useClient();

  const [teamData] = useQuery({
    query: getEntryDocument,
    pause: !marathonYear || !selectedId,
    variables: {
      year: marathonYear ?? "",
      dbNum: selectedId ?? -1,
    },
  });

  const parsedTeamData = useMemo(() => {
    if (!marathonYear || !selectedId || !teamData.data) {
      return null;
    }

    return JSON.parse(
      teamData.data.rawFundraisingEntries
    ) as FundraisingEntry[];
  }, [marathonYear, selectedId, teamData.data]);

  return (
    <Flex vertical>
      <Flex vertical gap="small">
        <Typography.Title level={2}>Fundraising Teams</Typography.Title>
        <SpreadsheetUploader
          rowMapper={(rowIn: GcFormat): NfgFormat => {
            return {
              ...rowIn,
              donor_first_name: "",
              donor_last_name: rowIn["Donor Name"]
                .replace(/Mr\.|Mrs\.|Ms\./g, "")
                .trim(),
            };
          }}
          onUpload={async (output) => {
            const newData = utils.json_to_sheet(output);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, newData, "");
            const now = DateTime.now().toFormat("yyyy-MM-dd_HH-mm-ss");
            writeFile(workbook, `fundraising_teams_${now}.csv`);
          }}
          rowValidator={(row: unknown): row is GcFormat => {
            if (typeof row !== "object" || row === null) {
              return false;
            }
            return Object.keys(row).every((key) =>
              GcFormatKeys.includes(key as any)
            );
          }}
        />
        <Flex gap="small">
          <Button
            icon={<DownloadOutlined />}
            onClick={() => {
              const sheet = utils.json_to_sheet(parsedMainData ?? []);
              const workbook = utils.book_new();
              utils.book_append_sheet(workbook, sheet, "Teams");

              const now = DateTime.now().toFormat("yyyy-MM-dd_HH-mm-ss");
              writeFile(workbook, `fundraising_teams_${now}.csv`);
            }}
          >
            Download List of Teams
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={async () => {
              const workbook = utils.book_new();

              const sheet = utils.json_to_sheet(parsedMainData ?? []);
              utils.book_append_sheet(workbook, sheet, "Teams");

              const namesById = new Map<number, string>();
              parsedMainData?.forEach((team) => {
                namesById.set(team.identifier, team.name);
              });

              for (const team of parsedMainData ?? []) {
                // eslint-disable-next-line no-await-in-loop
                const data = await urql
                  .query(getEntryDocument, {
                    year: marathonYear,
                    dbNum: team.identifier,
                  })
                  .toPromise();

                if (!data.data) {
                  continue;
                }

                const entries = JSON.parse(
                  data.data.rawFundraisingEntries
                ) as FundraisingEntry[];
                const sheet = utils.json_to_sheet(entries);
                utils.book_append_sheet(
                  workbook,
                  sheet,
                  (namesById.get(team.identifier) ?? "Unknown")
                    .substring(0, 31)
                    .replaceAll(/[^\dA-Za-z]/g, "_")
                );
              }

              const now = DateTime.now().toFormat("yyyy-MM-dd_HH-mm-ss");
              writeFile(workbook, `fundraising_data_${now}.xlsx`);
            }}
          >
            Download All Data
          </Button>
        </Flex>
        <Table
          pagination={false}
          rowKey={(record) => record.identifier}
          columns={[
            Table.EXPAND_COLUMN,
            {
              title: "Name",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "Total",
              dataIndex: "total",
              key: "total",
            },
          ]}
          dataSource={parsedMainData ?? undefined}
          expandable={{
            rowExpandable: () => true,
            expandedRowKeys: selectedId ? [selectedId] : [],
            expandedRowRender: ({ name }) =>
              teamData.fetching ? (
                <Typography.Text>Loading...</Typography.Text>
              ) : (
                <table>
                  <thead>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        const sheet = utils.json_to_sheet(parsedTeamData ?? []);
                        const workbook = utils.book_new();
                        utils.book_append_sheet(workbook, sheet, name);

                        const now = DateTime.now().toFormat(
                          "yyyy-MM-dd_HH-mm-ss"
                        );
                        writeFile(
                          workbook,
                          `fundraising_entries_${selectedId}_${now}.csv`
                        );
                      }}
                    >
                      Download
                    </Button>
                    <tr>
                      <th>Donated By</th>
                      <th>Donated To</th>
                      <th>Donated On</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedTeamData?.map((entry, i) => (
                      <tr
                        key={entry.donatedOn}
                        style={{ background: i % 2 ? "#fff5" : "#0005" }}
                      >
                        <td>{entry.donatedBy}</td>
                        <td>{entry.donatedTo}</td>
                        <td>{entry.donatedOn}</td>
                        <td>{entry.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ),
            onExpand: (expanded, record) => {
              if (expanded) {
                setSelectedId(record.identifier);
              } else {
                setSelectedId(null);
              }
            },
          }}
        />
      </Flex>
    </Flex>
  );
}

export const Route = createFileRoute("/dbfunds/")({
  component: DbFundsViewer,
  beforeLoad({ context }) {
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.Admin,
      },
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
        committeeIdentifier: CommitteeIdentifier.fundraisingCommittee,
      },
    ],
  },
});
