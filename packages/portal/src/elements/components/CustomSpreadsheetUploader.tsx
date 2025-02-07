import { InboxOutlined } from "@ant-design/icons";
import { Show } from "@refinedev/antd";
import { useNotification } from "@refinedev/core";
import {
  Button,
  Flex,
  Select,
  Table,
  type TableColumnsType,
  Upload,
} from "antd";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { type CellObject, read, type WorkSheet } from "xlsx";
import type { z } from "zod";

type UploadedFile = string | ArrayBuffer;

export interface CustomSpreadsheetColumnType<
  V extends Record<string, unknown>,
  K extends keyof V,
> {
  title: string;
  id: K;
  validator: z.ZodType<V[K]>;
}

function getCellData(cell: CellObject | undefined) {
  switch (cell?.t) {
    case "b":
    case "n":
    case "s":
    case "d": {
      return cell.v;
    }
    case "e":
    case undefined:
    case "z": {
      return undefined;
    }
  }
}

export function CustomSpreadsheetUploader<V extends Record<string, unknown>>({
  title,
  columns,
  onConfirm,
  confirmText = "Upload",
}: {
  title: string;
  columns: CustomSpreadsheetColumnType<V, keyof V>[];
  onConfirm: (val: V[]) => Promise<void> | void;
  confirmText?: string;
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [file, setFile] = useState<UploadedFile>();
  const [columnMappings, setColumnMappings] = useState<
    Partial<Record<keyof V, number>>
  >({});
  const { open } = useNotification();

  function confirm(val: V[]) {
    const result = onConfirm(val);
    if (result != null) {
      setConfirmLoading(true);
      result
        .catch(
          (error) =>
            open?.({ type: "error", message: String(error) }) ??
            console.error(error)
        )
        .finally(() => setConfirmLoading(false));
    }
  }

  const { sheet, header } = useMemo(() => {
    if (!file) {
      return {};
    }
    const wb = read(file, {
      UTC: false,
      type: typeof file === "string" ? "string" : "file",
      dense: true,
    });
    if (!wb.SheetNames[0]) {
      open?.({ type: "error", message: "Workbook is empty" });
      return {};
    }
    const sheet = wb.Sheets[wb.SheetNames[0]];

    const header = sheet?.["!data"]?.[0]?.map(({ w }, i) => ({
      idx: i,
      title: w,
      rows: sheet["!data"]?.slice(1).map((row) => getCellData(row[i])),
    }));

    return { sheet, header };
  }, [file, open]);

  const errors = columns
    .map((col) => {
      const idx = columnMappings[col.id];
      if (idx == null) {
        return {
          message: "Missing column",
          columnTitle: col.title,
        };
      }

      const rows = header?.[idx]?.rows ?? [];
      for (let i = 0; i < rows.length; i++) {
        const result = col.validator.safeParse(rows[i]);
        if (!result.success) {
          return {
            message: `Error in row ${i + 1}: ${col.validator.description ?? result.error.message}`,
            columnTitle: col.title,
          };
        }
      }
      return null;
    })
    .filter((val) => val != null);

  console.log(columnMappings);

  return (
    <Show
      headerButtons={null}
      title={title}
      footerButtons={
        <>
          <Button
            loading={confirmLoading}
            type="primary"
            danger
            disabled={file === undefined || confirmLoading}
            onClick={() => setFile(undefined)}
          >
            Reset
          </Button>
          <Button
            loading={confirmLoading}
            type="primary"
            disabled={errors.length > 0 || file === undefined || confirmLoading}
            onClick={() => {
              // Use validator to parse
              const data = sheet?.["!data"]?.slice(1).map(
                (row) =>
                  Object.fromEntries(
                    columns.map((col) => {
                      const idx = columnMappings[col.id]!;
                      return [col.id, col.validator.parse(row[idx]?.w)];
                    })
                  ) as V
              );
              if (data) {
                confirm(data);
              }
            }}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <Flex vertical gap="large" align="center" style={{ width: "100%" }}>
        {file ? (
          <SpreadsheetUploaderTable
            sheet={sheet}
            header={header}
            columns={columns}
            columnMappings={columnMappings}
            setColumnMappings={setColumnMappings}
            confirmLoading={confirmLoading}
            errors={errors}
          />
        ) : (
          <SpreadsheetUploaderUploader onUpload={setFile} />
        )}
      </Flex>
    </Show>
  );
}

function SpreadsheetUploaderTable<V extends Record<string, unknown>>({
  sheet,
  header,
  columns,
  columnMappings,
  setColumnMappings,
  confirmLoading,
  errors,
}: {
  sheet?: WorkSheet;
  header?:
    | {
        idx: number;
        title: string | undefined;
        rows: (string | number | boolean | Date | undefined)[] | undefined;
      }[]
    | undefined;
  columns: CustomSpreadsheetColumnType<V, keyof V>[];
  columnMappings: Partial<Record<keyof V, number>>;
  setColumnMappings: Dispatch<SetStateAction<Partial<Record<keyof V, number>>>>;
  confirmLoading: boolean;
  errors: { message: string; columnTitle: string }[];
}) {
  return (
    <Table
      scroll={{ x: true }}
      title={() =>
        errors.length > 0 && (
          <ul>
            {errors.map((error, i) => (
              <li key={i}>
                {error.columnTitle}: {error.message}
              </li>
            ))}
          </ul>
        )
      }
      columns={
        header && [
          {
            title: "#",
            render(_, __, i) {
              return i + 1;
            },
          },
          ...header.map((col, i): TableColumnsType[number] => ({
            title() {
              return (
                <>
                  <p>{col.title}</p>
                  <Select
                    allowClear
                    options={columns.map((val) => ({
                      value: val.id,
                      label: val.title,
                    }))}
                    value={
                      Object.entries(columnMappings).find(
                        ([_, val]) => val === i
                      )?.[0]
                    }
                    onChange={(val?: string) => {
                      setColumnMappings((prev) => {
                        return val === undefined
                          ? (Object.fromEntries(
                              Object.entries(prev).filter(
                                ([_, val]) => val !== i
                              )
                            ) as typeof prev)
                          : {
                              ...prev,
                              [val]: i,
                            };
                      });
                    }}
                  />
                </>
              );
            },
            dataIndex: i,
            render(val?: CellObject) {
              return val?.w;
            },
          })),
        ]
      }
      dataSource={sheet?.["!data"]?.slice(1)}
      loading={confirmLoading}
    />
  );
}

function SpreadsheetUploaderUploader({
  onUpload,
}: {
  onUpload: (file: UploadedFile) => void;
}) {
  const { open } = useNotification();

  return (
    <Upload.Dragger
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,.tsv,.dif,.txt,.numbers,.ods"
      customRequest={({ file }) => {
        if (typeof file === "string") {
          onUpload(file);
        } else {
          file
            .arrayBuffer()
            .then((buf) => onUpload(buf))
            .catch((error) =>
              open?.({ message: String(error), type: "error" })
            );
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Upload.Dragger>
  );
}
