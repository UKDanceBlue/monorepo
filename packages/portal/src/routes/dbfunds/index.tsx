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
import { utils, write, writeFile } from "xlsx";

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
  "Mil ID": string;
  "Salesforce ID": string;
  "donor_first_name": string;
  "donor_last_name": string;
  "Transaction Type": string;
  "Online Gift?": string;
  "Unit": string;
  "giftproc": string;
  "BegFY": string;
  "CFY": string;
  "giftamount": string;
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
  "CFY $": string;
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
          noPreview
          text="Click or drag a file to convert a GiveCampus CSV to a Network for Good CSV"
          showIcon={false}
          rowMapper={(rowIn: GcFormat): NfgFormat => {
            const entries: [keyof NfgFormat, string][] = [];
            for (const [key, value] of Object.entries(rowIn)) {
              if (["Salutation"].includes(key)) {
                continue;
              } else if (key === "Donor Name") {
                const name = String(value)
                  .replaceAll(/Mr\.|Mrs\.|Ms\./g, "")
                  .trim()
                  .split(" ");
                let firstName = "N/A";
                let lastName = "N/A";
                const middleInitialIdx = name.findIndex((part) =>
                  part.endsWith(".")
                );
                if (middleInitialIdx !== -1) {
                  firstName = name.slice(0, middleInitialIdx + 1).join(" ");
                  lastName = name.slice(middleInitialIdx + 1).join(" ");
                } else {
                  firstName = name[0]!;
                  lastName = name.slice(1).join(" ");
                }
                entries.push(
                  ["donor_first_name", firstName],
                  ["donor_last_name", lastName]
                );
              } else {
                entries.push([key as keyof NfgFormat, String(value)]);
              }
            }
            const base = Object.fromEntries(entries) as Record<
              | keyof Omit<GcFormat, "Donor Name">
              | "donor_first_name"
              | "donor_last_name",
              string
            >;
            return {
              ...base,
              addrline2: "",
              addrline3: "",
            };
          }}
          onUpload={(output) => {
            const newData = utils.json_to_sheet(
              output.map(
                (row): NfgFormat => ({
                  "Mil ID": row["Mil ID"],
                  "Salesforce ID": row["Salesforce ID"],
                  "donor_first_name": row.donor_first_name,
                  "donor_last_name": row.donor_last_name,
                  "Transaction Type": row["Transaction Type"],
                  "Online Gift?": row["Online Gift?"],
                  "Unit": row.Unit,
                  "giftproc": row.giftproc,
                  "BegFY": row.BegFY,
                  "CFY": row.CFY,
                  "giftamount": row.giftamount,
                  "giftacctnm": row.giftacctnm,
                  "table_val": row.table_val,
                  "giftacctno": row.giftacctno,
                  "giftsolic": row.giftsolic,
                  "giftcomm": "",
                  "addrline1": row.addrline1,
                  "addrline2": row.addrline2,
                  "addrline3": row.addrline3,
                  "addrcity": row.addrcity,
                  "addrplace": row.addrplace,
                  "addrzipcod": row.addrzipcod,
                  "intaddress": row.intaddress,
                  "Constituent Type": row["Constituent Type"],
                  "Donor Name 3": row["Donor Name 3"],
                  "coretext": row.coretext,
                  "CFY $": `$${Number.parseFloat(row["CFY $"]).toFixed(2)}`,
                })
              )
            );

            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, newData, "");

            const data = write(workbook, {
              type: "array",
              bookType: "csv",
            }) as Uint8Array;
            const blob = new Blob([data], {
              type: "text/csv",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `fundraising_teams_${DateTime.now().toFormat("yyyy-MM-dd_HH-mm")}.csv`;
            a.click();
          }}
          rowValidator={(row: unknown): row is GcFormat => {
            if (typeof row !== "object" || row === null) {
              return false;
            }
            return Object.keys(row).every((key) =>
              GcFormatKeys.includes(key as keyof GcFormat)
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
              if (!marathonYear) {
                return;
              }

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
