import { Button, Flex, Form, Modal, Select } from "antd";
import { DateTime, Interval } from "luxon";
import { type Client, useClient } from "urql";
import type { CellObject, ColInfo, WorkSheet } from "xlsx";
import { utils, writeFile } from "xlsx";

import { graphql } from "#graphql/gql.ts";
import { useLoginState } from "#hooks/useLoginState.ts";

import { LuxonDatePicker } from "../antLuxonComponents";

type DateRangeType =
  | "all"
  | "this-month"
  | "last-month"
  | "this-year"
  | "last-year"
  | "custom";

type ReportType =
  /**
   * One Sheet
   * Each row is an entry
   * Columns are just values of the entry
   */
  | "summary"
  /**
   * One Sheet
   * Each row is a day
   * Columns are totals by type and then a full total
   */
  | "totals-by-day"
  /**
   * Each sheet is a day
   * Each row is a team
   * Columns are totals by type and then a full total
   */
  | "type-by-team-per-day"
  /**
   * One sheet
   * Each row is a solicitation code
   * Columns are totals by type and then a full total
   */
  | "totals-by-solicitation";

function autoFitColumns(worksheet: WorkSheet): void {
  const [firstCol, lastCol] = worksheet["!ref"]!.replace(/\d/, "").split(":");

  const numRegexp = new RegExp(/\d+$/g);

  const firstColIndex = firstCol!.codePointAt(0),
    lastColIndex = lastCol!.codePointAt(0),
    rows = Number(numRegexp.exec(lastCol!)![0]);

  const objectMaxLength: ColInfo[] = [];

  // Loop on columns
  for (let colIndex = firstColIndex!; colIndex <= lastColIndex!; colIndex++) {
    const col = String.fromCodePoint(colIndex);
    let maxCellLength = 0;

    // Loop on rows
    for (let row = 1; row <= rows; row++) {
      const cellLength =
        String((worksheet[`${col}${row}`] as CellObject).v).length + 1;
      if (cellLength > maxCellLength) maxCellLength = cellLength;
    }

    objectMaxLength.push({ width: Math.max(10, maxCellLength) });
  }
  worksheet["!cols"] = objectMaxLength;
}

interface ReportConfig {
  format: "csv" | "xlsx" | "numbers" | "html";
  dateRange: DateRangeType;
  customDateRange?: [DateTime, DateTime];
  reportType: ReportType;
}

const defaultValues: ReportConfig = {
  format: "xlsx",
  dateRange: "this-year",
  reportType: "summary",
};

// KY Fiscal year is July 1 - June 30

function getFiscalYear(date: DateTime): Interval {
  const year = date.month >= 7 ? date.year : date.year - 1;
  return Interval.fromDateTimes(
    DateTime.fromObject({ month: 7, day: 1, year }).startOf("day"),
    DateTime.fromObject({ month: 6, day: 30, year: year + 1 }).endOf("day")
  );
}

function getDates(
  now: DateTime
): Record<Exclude<DateRangeType, "custom" | "all">, Interval> {
  return {
    "this-month": Interval.fromDateTimes(
      now.startOf("month"),
      now.endOf("month")
    ),
    "last-month": Interval.fromDateTimes(
      now.minus({ months: 1 }).startOf("month"),
      now.minus({ months: 1 }).endOf("month")
    ),
    "this-year": getFiscalYear(now),
    "last-year": getFiscalYear(now.minus({ year: 1 })),
  };
}

const fundraisingReportDialogDocument = graphql(/* GraphQL */ `
  query FundraisingReportDialog(
    $report: NonEmptyString!
    $from: DateTimeISO
    $to: DateTimeISO
  ) {
    report(report: $report, from: $from, to: $to) {
      pages {
        title
        header
        rows
      }
    }
  }
`);

async function createReport(
  urql: Client,
  config: ReportConfig,
  meta: {
    author: string;
    createdDate: DateTime;
    range: Interval | DateTime | "custom";
  }
) {
  console.log({
    report: config.reportType,
    from:
      meta.range === "custom"
        ? config.customDateRange![0].startOf("day").toISO()
        : Interval.isInterval(meta.range)
          ? meta.range.start?.startOf("day").toISO()
          : undefined,
    to:
      meta.range === "custom"
        ? config.customDateRange![1].endOf("day").toISO()
        : Interval.isInterval(meta.range)
          ? meta.range.end?.endOf("day").toISO()
          : undefined,
  });
  const result = await urql.query(
    fundraisingReportDialogDocument,
    {
      report: config.reportType,
      from:
        meta.range === "custom"
          ? config.customDateRange![0].toISO()
          : Interval.isInterval(meta.range)
            ? meta.range.start?.toISO()
            : undefined,
      to:
        meta.range === "custom"
          ? config.customDateRange![1].toISO()
          : Interval.isInterval(meta.range)
            ? meta.range.end?.toISO()
            : undefined,
    },
    {
      requestPolicy: "network-only",
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (!result.data) {
    throw new Error("No data returned");
  }

  const wb = utils.book_new();

  if (result.data.report.pages.length > 1 && config.format === "csv") {
    throw new Error("Cannot generate CSV for reports with multiple sheets");
  }

  for (const page of result.data.report.pages) {
    const sheet = utils.json_to_sheet([page.header, ...page.rows], {
      skipHeader: true,
    });
    autoFitColumns(sheet);
    utils.book_append_sheet(wb, sheet, page.title);
  }

  const rangeString =
    meta.range === "custom"
      ? Interval.fromDateTimes(...config.customDateRange!).toFormat(
          "yyyy-MM-dd"
        )
      : DateTime.isDateTime(meta.range)
        ? `all records through ${meta.range.toFormat("yyyy-MM-dd")}`
        : meta.range.toFormat("yyyy-MM-dd");

  const title = `Fundraising ${config.reportType} ${rangeString}`;

  writeFile(wb, `${title}.${config.format}`, {
    bookType: config.format,
    bookSST: true,
    compression: true,
    Props: {
      Author: meta.author,
      Comments: "Generated by UK DanceBlue Web Portal",
      CreatedDate: meta.createdDate.toJSDate(),
      Company: "University of Kentucky DanceBlue",
      Title: title,
    },
  });
}

export function FundraisingReportDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const now = DateTime.now();

  const [form] = Form.useForm<ReportConfig>();
  const dateRange = Form.useWatch("dateRange", form);
  const customDate = Form.useWatch("customDateRange", form);

  const { me } = useLoginState();

  const dates = getDates(now);

  const urql = useClient();

  return (
    <Modal
      title="Fundraising Report"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <Form
        form={form}
        initialValues={defaultValues}
        onFinish={(data) => {
          console.log(data);
          createReport(urql, data, {
            author: me?.name ?? me?.email ?? "Unknown",
            createdDate: now,
            range:
              data.dateRange === "all"
                ? now
                : data.dateRange === "custom"
                  ? data.dateRange
                  : dates[data.dateRange],
          }).catch((error) => {
            console.error(error);
            alert("An error occurred while generating the report.");
          });
        }}
        layout="vertical"
      >
        <Form.Item label="Format" name="format">
          <Select>
            <Select.Option value="xlsx">Excel</Select.Option>
            <Select.Option value="csv">CSV</Select.Option>
            <Select.Option value="numbers">Numbers</Select.Option>
            <Select.Option value="html">HTML</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Date Range" name="dateRange">
          <Select>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="this-month">
              This Month ({now.monthLong})
            </Select.Option>
            <Select.Option value="last-month">
              Last Month ({now.minus({ months: 1 }).monthLong})
            </Select.Option>
            <Select.Option value="this-year">
              This Fiscal Year ({dates["this-year"].toFormat("MMM yyyy")})
            </Select.Option>
            <Select.Option value="last-year">
              Last Fiscal Year ({dates["last-year"].toFormat("MMM yyyy")})
            </Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Custom Date Range"
          name="customDateRange"
          hidden={dateRange !== "custom"}
        >
          <LuxonDatePicker.RangePicker />
        </Form.Item>
        {customDate && (
          <p>
            {customDate[0].equals(customDate[1])
              ? "WARNING: This report will be empty."
              : `Data after ${customDate[0].toFormat("yyyy-MM-dd")} and until ${customDate[1].toFormat("yyyy-MM-dd")} will be included.`}
          </p>
        )}
        <Form.Item label="Report Type" name="reportType">
          <Select>
            <Select.Option value="summary">Summary</Select.Option>
            <Select.Option value="totals-by-day">Totals by Day</Select.Option>
            <Select.Option value="type-by-team-per-day">
              Type by Team per Day
            </Select.Option>
            <Select.Option value="totals-by-solicitation">
              Totals by Solicitation
            </Select.Option>
          </Select>
        </Form.Item>
        <Flex justify="end">
          <Button type="primary" htmlType="submit">
            Generate Report
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
}
