import {
  EyeInvisibleOutlined,
  EyeOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNotification } from "@refinedev/core";
import {
  Button,
  Flex,
  Modal,
  Select,
  Space,
  Table,
  type TableColumnsType,
  Upload,
} from "antd";
import {
  type ComponentProps,
  type Dispatch,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import { type CellObject, read, type WorkSheet } from "xlsx";
import { type z } from "zod";

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

export function UploadButton<V extends Record<string, unknown>>({
  title,
  columns,
  onConfirm,
  confirmText = "Upload",
  buttonProps,
}: {
  title: string;
  columns: CustomSpreadsheetColumnType<V, keyof V>[];
  onConfirm: (val: V[]) => Promise<void> | void;
  confirmText?: string;
  buttonProps?: ComponentProps<typeof Button>;
}) {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [file, setFile] = useState<UploadedFile>();
  const [columnMappings, setColumnMappings] = useState<
    Partial<Record<keyof V, number>>
  >({});
  const [ignoredRows, setIgnoredRows] = useState(new Set<number>());

  const { open } = useNotification();

  const [visible, setVisible] = useState(false);

  function reset() {
    setFile(undefined);
    setColumnMappings({});
    setIgnoredRows(new Set());
  }

  function confirm(val: V[]) {
    const result = onConfirm(val);
    if (result instanceof Promise) {
      setConfirmLoading(true);
      result
        .then(() => {
          setVisible(false);
          reset();
        })
        .catch(
          (error) =>
            open?.({ type: "error", message: String(error) }) ??
            console.error(error)
        )
        .finally(() => {
          setConfirmLoading(false);
        });
    } else {
      reset();
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

    for (const { title: sheetTitle, idx } of header ?? []) {
      const match = columns.find(({ title }) => title === sheetTitle)?.id;
      if (match != null) {
        setColumnMappings((prev) => ({
          ...prev,
          [match]: idx,
        }));
      }
    }

    return { sheet, header };
  }, [columns, file, open]);

  const errors = useMemo(
    () =>
      columns
        .map((col) => {
          const idx = columnMappings[col.id];
          if (idx == null) {
            if (col.validator.safeParse(undefined).success) {
              return null;
            } else {
              return {
                message: "Missing column",
                columnTitle: col.title,
              };
            }
          } else {
            const rows = header?.[idx]?.rows ?? [];
            for (let i = 0; i < rows.length; i++) {
              if (ignoredRows.has(i)) {
                continue;
              }
              const result = col.validator.safeParse(rows[i]);
              if (!result.success) {
                let message = "";
                for (const issue of result.error.issues) {
                  switch (issue.code) {
                    case "invalid_enum_value": {
                      message += `Expected one of ${issue.options
                        .map((val) => JSON.stringify(val))
                        .join(
                          ", "
                        )}, received ${JSON.stringify(issue.received)}; `;
                      break;
                    }
                    case "invalid_type": {
                      message += `Expected type ${issue.expected}, received ${issue.received}; `;
                      break;
                    }
                    case "invalid_literal": {
                      message += `Invalid literal, expected ${JSON.stringify(issue.expected)}, received ${JSON.stringify(
                        issue.received
                      )}; `;
                      break;
                    }
                    case "too_small": {
                      switch (issue.type) {
                        case "set":
                        case "array": {
                          message += `Array must contain at least ${issue.minimum} items; `;

                          break;
                        }
                        case "string": {
                          message += `String must contain at least ${issue.minimum} characters; `;

                          break;
                        }
                        case "bigint":
                        case "number": {
                          message += `Number must be greater than ${
                            issue.inclusive ? "or equal to " : ""
                          }${issue.minimum}; `;

                          break;
                        }
                        case "date": {
                          message += `Date must be after ${
                            issue.inclusive ? "or equal to " : ""
                          }${new Date(Number(issue.minimum)).toISOString()}; `;

                          break;
                        }
                      }
                      break;
                    }
                    case "too_big": {
                      switch (issue.type) {
                        case "set":
                        case "array": {
                          message += `Array must contain at most ${issue.maximum} items; `;

                          break;
                        }
                        case "string": {
                          message += `String must contain at most ${issue.maximum} characters; `;

                          break;
                        }
                        case "bigint":
                        case "number": {
                          message += `Number must be less than ${
                            issue.inclusive ? "or equal to " : ""
                          }${issue.maximum}; `;

                          break;
                        }
                        case "date": {
                          message += `Date must be before ${
                            issue.inclusive ? "or equal to " : ""
                          }${new Date(Number(issue.maximum)).toISOString()}; `;

                          break;
                        }
                      }
                      break;
                    }
                    case "invalid_string": {
                      switch (issue.validation) {
                        case "email": {
                          message += `Invalid email address; `;
                          break;
                        }
                        case "url": {
                          message += `Invalid URL; `;
                          break;
                        }
                        case "uuid": {
                          message += `Invalid UUID; `;
                          break;
                        }
                        case "cuid": {
                          message += `Invalid CUID; `;
                          break;
                        }
                        case "cuid2": {
                          message += `Invalid CUID2; `;
                          break;
                        }
                        case "ulid": {
                          message += `Invalid ULID; `;
                          break;
                        }
                        case "regex": {
                          message += `Invalid string: ${issue.message}; `;
                          break;
                        }
                        case "datetime": {
                          message += `Invalid datetime; `;
                          break;
                        }
                        case "date": {
                          message += `Invalid date; `;
                          break;
                        }
                        case "time": {
                          message += `Invalid time; `;
                          break;
                        }
                        case "duration": {
                          message += `Invalid duration; `;
                          break;
                        }
                        case "ip": {
                          message += `Invalid IP address; `;
                          break;
                        }
                        case "cidr": {
                          message += `Invalid CIDR notation; `;
                          break;
                        }
                        case "base64": {
                          message += `Invalid base64 string; `;
                          break;
                        }
                        case "base64url": {
                          message += `Invalid base64url string; `;
                          break;
                        }
                        case "nanoid": {
                          message += `Invalid nanoid; `;
                          break;
                        }
                        case "emoji": {
                          message += `Invalid emoji; `;
                          break;
                        }
                        default: {
                          if (typeof issue.validation === "string") {
                            message += `Invalid string, must be a valid ${issue.validation}; `;
                          } else if (
                            "includes" in issue.validation &&
                            typeof issue.validation.includes === "string"
                          ) {
                            message += `Invalid string, must include "${issue.validation.includes}"${
                              issue.validation.position != null
                                ? ` at position ${issue.validation.position}`
                                : ""
                            }; `;
                          } else if (
                            "startsWith" in issue.validation &&
                            typeof issue.validation.startsWith === "string"
                          ) {
                            message += `Invalid string, must start with "${issue.validation.startsWith}"; `;
                          } else if (
                            "endsWith" in issue.validation &&
                            typeof issue.validation.endsWith === "string"
                          ) {
                            message += `Invalid string, must end with "${issue.validation.endsWith}"; `;
                          } else {
                            message += `Invalid string; `;
                          }
                          break;
                        }
                      }
                      break;
                    }
                    case "custom":
                    case "unrecognized_keys":
                    case "invalid_union":
                    case "invalid_union_discriminator":
                    case "invalid_arguments":
                    case "invalid_return_type":
                    case "invalid_date":
                    case "invalid_intersection_types":
                    case "not_multiple_of":
                    case "not_finite":
                    default: {
                      message += `${issue.message}; `;
                      break;
                    }
                  }
                }
                return {
                  message: `Error in row ${i + 1}: ${message.slice(0, -2)}`,
                  columnTitle: col.title,
                  row: i + 1,
                };
              }
            }
            return null;
          }
        })
        .filter((val) => val != null),
    [columnMappings, columns, header, ignoredRows]
  );

  const unassignedColumns = columns.filter(({ id }) => !columnMappings[id]);

  return (
    <>
      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false);
          reset();
        }}
        width="100%"
        title={title}
        footer={
          <Flex justify="space-between">
            <div>
              {unassignedColumns.length > 0 && (
                <p>
                  Unassigned columns:{" "}
                  {unassignedColumns
                    .map(({ title, validator }) =>
                      validator.isOptional() ? title : `${title} (required)`
                    )
                    .join(", ")}
                </p>
              )}
            </div>
            <Space>
              <Button
                loading={confirmLoading}
                type="primary"
                danger
                disabled={file === undefined || confirmLoading}
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </Button>
              <Button
                loading={confirmLoading}
                type="primary"
                disabled={
                  errors.length > 0 || file === undefined || confirmLoading
                }
                onClick={() => {
                  // Use validator to parse
                  const data = sheet?.["!data"]
                    ?.slice(1)
                    .filter((_, i) => !ignoredRows.has(i))
                    .map(
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
            </Space>
          </Flex>
        }
      >
        {file ? (
          <SpreadsheetUploaderTable
            sheet={sheet}
            header={header}
            columns={columns}
            columnMappings={columnMappings}
            setColumnMappings={setColumnMappings}
            confirmLoading={confirmLoading}
            errors={errors}
            ignoredRows={ignoredRows}
            setIgnoredRows={setIgnoredRows}
          />
        ) : (
          <SpreadsheetUploaderUploader onUpload={setFile} />
        )}
      </Modal>
      <Button
        children={title}
        icon={<UploadOutlined />}
        {...buttonProps}
        onClick={() => setVisible(true)}
      />
    </>
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
  ignoredRows,
  setIgnoredRows,
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
  errors: { message: string; columnTitle: string; row?: number }[];
  ignoredRows: Set<number>;
  setIgnoredRows: Dispatch<SetStateAction<Set<number>>>;
}) {
  const options = columns.map((val) => ({
    value: val.id,
    label: val.title,
  }));

  return (
    <Table
      scroll={{ x: true }}
      style={{
        width: "100%",
      }}
      // onRow={(_, i) => ({
      //   style: {
      //     background: ignoredRows.has(i!) ? "#f0f0f0" : undefined,
      //     color: ignoredRows.has(i!) ? "#bfbfbf" : undefined,
      //   },
      // })}
      onRow={(_, i) => {
        if (ignoredRows.has(i!)) {
          return {
            style: {
              background: "#f0f0f0",
              color: "#bfbfbf",
            },
          };
        } else if (errors.some((error) => error.row === i! + 1)) {
          return {
            style: {
              background: "#ff00003b",
            },
          };
        } else {
          return {};
        }
      }}
      rowHoverable={false}
      pagination={false}
      rowKey={(_, i) => i!}
      rowSelection={{
        hideSelectAll: true,
        renderCell(_1, _2, i) {
          return (
            <Button
              type="text"
              icon={
                ignoredRows.has(i) ? <EyeInvisibleOutlined /> : <EyeOutlined />
              }
              onClick={() => {
                setIgnoredRows((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(i)) {
                    newSet.delete(i);
                  } else {
                    newSet.add(i);
                  }
                  return newSet;
                });
              }}
            />
          );
        },
      }}
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
                <ColumnHeader
                  sheetHeader={col.title}
                  options={options}
                  columnMappings={columnMappings}
                  setColumnMappings={setColumnMappings}
                  i={i}
                />
              );
            },
            dataIndex: i,
            render(val?: CellObject) {
              return val?.w ?? "";
            },
          })),
        ]
      }
      dataSource={sheet?.["!data"]?.slice(1)}
      loading={confirmLoading}
    />
  );
}

function ColumnHeader<V extends Record<string, unknown>>({
  sheetHeader,
  options,
  setColumnMappings,
  columnMappings,
  i,
}: {
  sheetHeader?: string;
  options: {
    label: string;
    value: string | number | symbol;
  }[];
  columnMappings: Partial<Record<keyof V, number>>;
  setColumnMappings: Dispatch<SetStateAction<Partial<Record<keyof V, number>>>>;
  i: number;
}) {
  return (
    <>
      <p>{sheetHeader}</p>
      <Select
        allowClear
        options={options}
        value={
          Object.entries(columnMappings).find(([_, val]) => val === i)?.[0]
        }
        style={{
          width: "100%",
          minWidth: `${
            options.reduce(
              (prev, { label }) => Math.max(prev, label.length),
              0
            ) + 4
          }ch`,
        }}
        onChange={(val?: string) => {
          setColumnMappings((prev) => {
            return val === undefined
              ? (Object.fromEntries(
                  Object.entries(prev).filter(([_, val]) => val !== i)
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
