import "@mdxeditor/editor/style.css";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  MDXEditor,
  quotePlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";
import { Edit, useForm } from "@refinedev/antd";
import { type HttpError } from "@refinedev/core";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input } from "antd";
import { DateTime, Interval } from "luxon";

import { EventOccurrencePicker } from "#elements/components/event/EventOccurrencePicker.js";
import type { ResultOf, VariablesOf } from "#gql/index.js";

import type { EventEditorFragment } from "./EventEditorGQL.js";
import {
  eventEditorMutationDocument,
  eventEditorQueryDocument,
} from "./EventEditorGQL.js";

export function EventEditor({ id }: { id: string }) {
  const { formProps, saveButtonProps, onFinish } = useForm<
    ResultOf<typeof EventEditorFragment>,
    HttpError,
    VariablesOf<typeof eventEditorMutationDocument>["input"],
    Omit<ResultOf<typeof EventEditorFragment>, "occurrences"> & {
      occurrences: { id?: string; interval: Interval; fullDay: boolean }[];
    },
    ResultOf<typeof EventEditorFragment>
  >({
    id,
    action: "edit",
    resource: "event",
    meta: {
      gqlMutation: eventEditorMutationDocument,
      gqlQuery: eventEditorQueryDocument,
    },
    redirect: "show",
    queryOptions: {
      select({ data }) {
        return {
          data: {
            ...data,
            occurrences: data.occurrences.map((occurrence) => ({
              id: occurrence.id,
              interval: Interval.fromDateTimes(
                DateTime.fromISO(occurrence.interval.start),
                DateTime.fromISO(occurrence.interval.end)
              ),
              fullDay: occurrence.fullDay,
            })),
          },
        };
      },
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} resource="event">
      <Form
        {...(formProps as unknown as FormProps<
          Omit<
            ResultOf<typeof EventEditorFragment>,
            "occurrences" | "id" | "images"
          > & {
            occurrences: {
              id?: string;
              interval: Interval;
              fullDay: boolean;
            }[];
          }
        >)}
        layout="vertical"
        onFinish={(data) => {
          const occurrences: NonNullable<
            Parameters<typeof onFinish>[0]
          >["occurrences"] = [];
          for (const { interval, ...occurrence } of data.occurrences) {
            if (!interval.isValid) {
              throw new Error(`Invalid interval: ${interval.invalidReason}`);
            } else if (!interval.start?.isValid) {
              throw new Error(
                `Invalid start: ${interval.start?.invalidReason}`
              );
            } else if (!interval.end?.isValid) {
              throw new Error(`Invalid end: ${interval.end?.invalidReason}`);
            } else {
              occurrences.push({
                ...occurrence,
                interval: {
                  start: interval.start.toISO(),
                  end: interval.end.toISO(),
                },
              });
            }
          }
          return onFinish({
            ...data,
            occurrences,
            description: data.description || undefined,
            location: data.location || undefined,
            summary: data.summary || undefined,
          });
        }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Summary" name="summary">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Location" name="location">
          <Input />
        </Form.Item>
        <Form.List name="occurrences">
          {(fields, { add, remove }) => (
            <div>
              {fields.map((field, i) => (
                <Form.Item {...field}>
                  <EventOccurrencePicker onDelete={() => remove(i)} />
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      interval: Interval.invalid("No input"),
                      fullDay: false,
                    })
                  }
                  icon={<PlusOutlined />}
                >
                  Add occurrence
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.Item label="Description" name="description">
          {formProps.initialValues ? (
            <MDXEditor
              markdown={formProps.initialValues.description ?? ""}
              onChange={(text) =>
                formProps.form?.setFieldValue("description", text)
              }
              plugins={[
                headingsPlugin(),
                quotePlugin(),
                listsPlugin(),
                linkPlugin({
                  validateUrl(url) {
                    try {
                      new URL(url);
                      return true;
                    } catch {
                      return false;
                    }
                  },
                }),
                linkDialogPlugin(),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <BlockTypeSelect />
                      <CreateLink />
                      <InsertImage />
                    </>
                  ),
                }),
              ]}
            />
          ) : (
            <Flex justify="center">
              <LoadingOutlined spin />
            </Flex>
          )}
        </Form.Item>
      </Form>
    </Edit>
  );
}
