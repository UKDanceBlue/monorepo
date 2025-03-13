import {
  getFiscalYear,
  SolicitationCodeTag,
  solicitationCodeTagColors,
  sortSolicitationCodeTags,
  stringifySolicitationCodeTag,
} from "@ukdanceblue/common";
import { Divider, Flex, Form, Select, Switch, Tag } from "antd";
import { DateTime, Interval } from "luxon";
import { useEffect, useMemo } from "react";
import type { ColInfo, WorkBook, WorkSheet } from "xlsx";
import { utils } from "xlsx";

import { graphql } from "#gql/index.js";
import { useQuery } from "#hooks/refine/custom.tsx";
import { useTypedSelect } from "#hooks/refine/select.tsx";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

import { LuxonDatePicker } from "../antLuxonComponents";

type DateRangeType =
  | "all"
  | "this-month"
  | "last-month"
  | "this-year"
  | "last-year"
  | "custom";

export type ReportType =
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
  | "totals-by-solicitation"
  /**
   * One sheet
   * Each row is a person/donated-to
   * Columns are donated to and total
   */
  | "totals-by-donated-to";

function autoFitColumns(worksheet: WorkSheet): void {
  const objectMaxLength: ColInfo[] = [];

  // Loop on columns
  for (const row of worksheet["!data"] ?? []) {
    let maxCellLength = 0;

    // Loop on rows
    for (const col of row) {
      const cellLength = String(col.v).length + 1;
      if (cellLength > maxCellLength) maxCellLength = cellLength;
    }

    objectMaxLength.push({ width: Math.max(10, maxCellLength) });
  }

  worksheet["!cols"] = objectMaxLength;
}

export type ReportConfigFormat = "csv" | "xlsx" | "numbers" | "html";

interface ReportConfig {
  format: ReportConfigFormat;
  dateRange: DateRangeType;
  solicitationCodeSelection?:
    | {
        tags: SolicitationCodeTag[];
        all: boolean;
      }
    | {
        ids: string[];
      };
  customDateRange?: [DateTime, DateTime];
  reportType: ReportType;
}

// KY Fiscal year is July 1 - June 30

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
    $from: LuxonDateTime
    $to: LuxonDateTime
    $solicitationCodeIds: [GlobalId!]
    $solicitationCodeTags: [SolicitationCodeTag!]
    $requireAllTags: Boolean
  ) {
    report(
      report: $report
      from: $from
      to: $to
      solicitationCodeIds: $solicitationCodeIds
      solicitationCodeTags: $solicitationCodeTags
      requireAllTags: $requireAllTags
    ) {
      pages {
        title
        header
        rows
      }
    }
  }
`);

const SolicitationCodeSelectFragment = graphql(/* GraphQL */ `
  fragment SolicitationCodeSelectFragment on SolicitationCodeNode {
    id
    text
  }
`);

export function FundraisingReportSelection({
  setData,
  setFormat,
  setReportType,
}: {
  setData: (data: WorkBook) => void;
  setFormat: (format: ReportConfig["format"]) => void;
  setReportType: (reportType: ReportType) => void;
}) {
  const [form] = Form.useForm<ReportConfig>();
  const format = Form.useWatch("format", form);
  const reportType = Form.useWatch("reportType", form);
  const dateRange = Form.useWatch("dateRange", form);
  const customDate = Form.useWatch("customDateRange", form);
  const solicitationCodes = Form.useWatch("solicitationCodeSelection", form);

  const [range, now, dates] = useMemo(() => {
    const now = DateTime.now();
    const dates = getDates(now);
    const range =
      dateRange === "all"
        ? now
        : dateRange === "custom"
          ? dateRange
          : dates[dateRange];

    return [range, now, dates];
  }, [dateRange]);

  const [result] = useQuery({
    query: fundraisingReportDialogDocument,
    variables: {
      report: reportType,
      from:
        dateRange === "custom"
          ? customDate?.[0].toISO()
          : Interval.isInterval(range)
            ? range.start?.toISO()
            : undefined,
      to:
        dateRange === "custom"
          ? customDate?.[1].toISO()
          : Interval.isInterval(range)
            ? range.end?.toISO()
            : undefined,

      solicitationCodeIds:
        solicitationCodes && "ids" in solicitationCodes
          ? solicitationCodes.ids
          : undefined,

      solicitationCodeTags:
        solicitationCodes && "tags" in solicitationCodes
          ? solicitationCodes.tags
          : undefined,
      requireAllTags:
        solicitationCodes && "tags" in solicitationCodes
          ? solicitationCodes.all
          : undefined,
    },
    pause: dateRange === "custom" && !customDate,
  });

  useQueryStatusWatcher(result);

  useEffect(() => {
    if (result.data) {
      const wb = utils.book_new();

      if (!result.data.report) {
        throw new Error("No data returned from report");
      }

      if (result.data.report.pages.length > 1 && format === "csv") {
        throw new Error("Cannot generate CSV for reports with multiple sheets");
      }

      for (const page of result.data.report.pages) {
        const sheet = utils.json_to_sheet([page.header, ...page.rows], {
          skipHeader: true,
          dense: true,
        });
        autoFitColumns(sheet);
        utils.book_append_sheet(wb, sheet, page.title);
      }

      const rangeString =
        range === "custom"
          ? Interval.fromDateTimes(...customDate!).toFormat("yyyy-MM-dd")
          : DateTime.isDateTime(range)
            ? `all records through ${range.toFormat("yyyy-MM-dd")}`
            : range.toFormat("yyyy-MM-dd");

      const title = `Fundraising ${reportType} ${rangeString}`;

      wb.Custprops = {
        title,
      };

      setData(wb);
    }
  }, [customDate, format, range, reportType, result.data, setData]);

  useEffect(() => {
    setFormat(format);
  }, [format, setFormat]);

  useEffect(() => {
    setReportType(reportType);
  }, [reportType, setReportType]);

  return (
    <Form
      form={form}
      initialValues={{
        format: "xlsx",
        dateRange: "this-month",
        reportType: "summary",
        customDateRange: [now.startOf("month"), now.endOf("month")],
      }}
      layout="horizontal"
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
      {customDate && dateRange === "custom" && (
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
          <Select.Option value="totals-by-donated-to">
            Totals by Donated To
          </Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Solicitation Codes" name="solicitationCodeSelection">
        <SolicitationCodeSelect />
      </Form.Item>
    </Form>
  );
}

function SolicitationCodeSelect({
  value,
  onChange,
  id,
}: {
  value?: ReportConfig["solicitationCodeSelection"];
  onChange?: (value: ReportConfig["solicitationCodeSelection"]) => void;
  id?: string;
}) {
  const { selectProps } = useTypedSelect({
    fragment: SolicitationCodeSelectFragment,
    props: {
      sorters: [
        {
          field: "text",
          order: "asc",
        },
      ],
      resource: "solicitationCode",
      optionLabel(item) {
        return item.text;
      },
      optionValue(item) {
        return item.id;
      },
      onSearch(value) {
        return [
          {
            field: "text",
            operator: "contains",
            value,
          },
        ];
      },
    },
  });

  return (
    <Flex id={id} vertical>
      <p>
        Select particular solicitation codes, or select tags to include all
        solicitation codes with those tags. If you select multiple tags, you can
        choose whether to include all or any of them.
      </p>

      <p>Select by tag</p>
      <Flex align="center" gap="small">
        <Switch
          checkedChildren="All"
          unCheckedChildren="Any"
          onChange={(all) => {
            onChange?.({
              tags: value && "tags" in value ? value.tags : [],
              all,
            });
          }}
        />
        <Select
          mode="tags"
          showSearch={false}
          options={sortSolicitationCodeTags(
            Object.values(SolicitationCodeTag)
          ).map((tag) => ({
            label: stringifySolicitationCodeTag(tag),
            value: tag,
          }))}
          value={value && "tags" in value ? value.tags : undefined}
          onChange={(tags) => {
            onChange?.({
              tags: sortSolicitationCodeTags(tags),
              all: false,
            });
          }}
          tagRender={({ label, value, closable, onClose }) => (
            <Tag
              color={solicitationCodeTagColors[value as SolicitationCodeTag]}
              closable={closable}
              onClose={onClose}
            >
              {label}
            </Tag>
          )}
        />
      </Flex>
      <Divider />
      <p>Select by individual Solicitation Code</p>
      {/* @ts-expect-error - It's fine, I'll fix it later (famous last words) */}
      <Select
        mode="multiple"
        {...selectProps}
        defaultValue={value && "ids" in value ? value.ids : undefined}
        value={value && "ids" in value ? value.ids : undefined}
        onChange={(ids) => {
          onChange?.({
            ids,
          });
        }}
      />
    </Flex>
  );
}
