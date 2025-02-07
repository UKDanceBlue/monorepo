import { InboxOutlined } from "@ant-design/icons";
import { Button, Flex, Table, Upload } from "antd";
import type { ColumnType } from "antd/es/table";
import { useState } from "react";
import { read, utils } from "xlsx";
import type { ZodSchema, ZodTypeDef } from "zod";

import { useAntFeedback } from "#hooks/useAntFeedback.js";

export function SpreadsheetUploader<
  RowType extends object,
  OutputType extends object = RowType,
>({
  onUpload,
  onFail,
  noPreview,
  showIcon = true,
  showUploadList = false,
  text,
  paginate = true,
  ...props
}:
  | {
      rowValidator: (row: unknown) => row is RowType;
      rowMapper: (row: RowType) => OutputType | Promise<OutputType>;
      onUpload: (output: OutputType[]) => void | Promise<void>;
      onFail?: (error: Error) => void;
      noPreview?: boolean;
      showIcon?: boolean;
      showUploadList?: boolean;
      text?: string;
      paginate?: boolean;
    }
  | {
      rowSchema: ZodSchema<OutputType, ZodTypeDef, RowType>;
      onUpload: (output: OutputType[]) => void | Promise<void>;
      onFail?: (error: Error) => void;
      noPreview?: boolean;
      showIcon?: boolean;
      showUploadList?: boolean;
      text?: string;
      paginate?: boolean;
    }) {
  const { showErrorMessage, showSuccessNotification } = useAntFeedback();
  const [data, setData] = useState<OutputType[] | null>(null);

  return (
    <Flex vertical gap={8}>
      <Upload.Dragger
        accept=".xlsx,.csv"
        multiple={false}
        showUploadList={showUploadList}
        customRequest={async ({ file, onSuccess, onError }) => {
          try {
            if (typeof file === "string") {
              throw new TypeError("Invalid file type");
            }

            const { Sheets } = read(await file.arrayBuffer(), {
              type: "buffer",
            });
            const [sheet] = Object.values(Sheets);

            if (!sheet) {
              throw new Error("No sheet found in workbook");
            }

            const json = utils.sheet_to_json(sheet, { header: 2 });

            let output: OutputType[] = [];
            if ("rowSchema" in props) {
              const results = json.map((row) => props.rowSchema.safeParse(row));
              for (const result of results) {
                if (result.success) {
                  output.push(result.data);
                } else {
                  throw new Error(
                    `Invalid row format: ${result.error.issues
                      .map(
                        (error) => `${error.path.join(".")}: ${error.message}`
                      )
                      .join("; ")}`
                  );
                }
              }
            } else {
              if (!json.every(props.rowValidator)) {
                throw new Error("Invalid row format");
              }

              output = await Promise.all(
                json.map(props.rowMapper).map((row) => {
                  if (row instanceof Promise) {
                    return row;
                  }

                  return Promise.resolve(row);
                })
              );
            }

            setData(output);
            showSuccessNotification({ message: "File parsed successfully" });

            if (noPreview) {
              await onUpload(output);
            }

            onSuccess?.("ok");
          } catch (error) {
            console.error(error);
            showErrorMessage(`Error while uploading file: ${String(error)}`);
            onError?.(
              error instanceof Error ? error : new Error(String(error))
            );
            onFail?.(error instanceof Error ? error : new Error(String(error)));
          }
        }}
      >
        {showIcon && (
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
        )}
        <p className="ant-upload-text">
          {text ?? "Click or drag file to this area to upload"}
        </p>
      </Upload.Dragger>
      {data && !noPreview && (
        <>
          <Table
            dataSource={data}
            pagination={paginate ? undefined : false}
            scroll={{ x: "max-content", y: 500 }}
            columns={Object.keys(data[0]!).map(
              (key): ColumnType<OutputType> => ({
                title: key,
                dataIndex: key,
                key,
                width: `${Math.min(
                  Math.max(
                    data.reduce(
                      (max, row) =>
                        Math.max(
                          max,
                          String((row as Record<string, unknown>)[key]).length
                        ),
                      key.length
                    ),
                    key.length
                  ) + 5,
                  100
                )}ch`,
                hidden: data.every(
                  (row) => !(row as Record<string, unknown>)[key]
                ),
                render(value) {
                  if (Array.isArray(value)) {
                    return (
                      <ul>
                        {value.map((item, idx) => (
                          <li key={idx}>{String(item)}</li>
                        ))}
                      </ul>
                    );
                  } else if (typeof value === "object" && value) {
                    return (
                      <dl>
                        {Object.entries(value as Record<string, unknown>).map(
                          ([key, value]) => (
                            <>
                              <dt>{key}</dt>
                              <dd>{String(value)}</dd>
                            </>
                          )
                        )}
                      </dl>
                    );
                  } else if (value == null) {
                    return <i>N/A</i>;
                  } else if (typeof value === "string") {
                    if (value.length > 100) {
                      return (
                        <div
                          style={{ whiteSpace: "pre-wrap", overflow: "scroll" }}
                        >
                          {value}
                        </div>
                      );
                    }
                    if (value === "") {
                      return <i>Empty String</i>;
                    }
                    return value;
                  } else {
                    return String(value);
                  }
                },
              })
            )}
          />
          <Flex gap={8} justify="end">
            <Button
              onClick={() => {
                setData(null);
              }}
            >
              Clear
            </Button>
            <Button
              type="primary"
              onClick={() => {
                const promise = onUpload(data);
                (promise instanceof Promise ? promise : Promise.resolve())
                  .then(() => {
                    showSuccessNotification({
                      message: "File uploaded successfully",
                    });
                  })
                  .catch((error: unknown) => {
                    showErrorMessage(
                      `Error while uploading file: ${String(error)}`
                    );
                  });
              }}
            >
              Upload
            </Button>
          </Flex>
        </>
      )}
    </Flex>
  );
}
