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
                return {
                  message: `Error in row ${i + 1}: ${col.validator.description ?? result.error.message}`,
                  columnTitle: col.title,
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
  errors: { message: string; columnTitle: string }[];
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
      onRow={(_, i) => ({
        style: {
          background: ignoredRows.has(i!) ? "#f0f0f0" : undefined,
          color: ignoredRows.has(i!) ? "#bfbfbf" : undefined,
        },
      })}
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
