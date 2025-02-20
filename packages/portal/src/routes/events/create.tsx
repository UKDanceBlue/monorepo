import { PlusOutlined } from "@ant-design/icons";
import { Create } from "@refinedev/antd";
import { createFileRoute } from "@tanstack/react-router";
import { Button, Flex, Form, Input } from "antd";
import { DateTime, Interval } from "luxon";

import {
  EventOccurrencePicker,
  type EventOccurrencePickerValue,
} from "#elements/components/event/EventOccurrencePicker.tsx";
import { graphql } from "#gql/index.ts";
import { useTypedForm } from "#hooks/useTypedRefine.tsx";

const eventCreatorDocument = graphql(/* GraphQL */ `
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      summary
      location
      description
      occurrences {
        id
        fullDay
        interval {
          start
          end
        }
      }
    }
  }
`);

function EventsCreate() {
  const { form } = useTypedForm({
    mutation: eventCreatorDocument,
    props: {
      action: "create",
      resource: "event",
      redirect: false,
    },
    dataToForm(data): {
      title: string;
      summary: string | null | undefined;
      location: string | null | undefined;
      description: string | null | undefined;
      occurrences: EventOccurrencePickerValue[] | null | undefined;
    } {
      return {
        title: data.title,
        summary: data.summary,
        location: data.location,
        description: data.description,
        occurrences: data.occurrences.map((val) => ({
          ...val,
          interval: Interval.fromDateTimes(
            DateTime.fromISO(val.interval.start),
            DateTime.fromISO(val.interval.end)
          ),
        })),
      };
    },
    formToVariables(formData: {
      title: string;
      summary: string | null | undefined;
      location: string | null | undefined;
      description: string | null | undefined;
      occurrences: EventOccurrencePickerValue[] | null | undefined;
    }) {
      return {
        title: formData.title,
        summary: formData.summary || undefined,
        location: formData.location || undefined,
        description: formData.description || undefined,
        occurrences:
          formData.occurrences?.map((val) => ({
            ...val,
            interval: {
              start: val.interval.start!.toISO(),
              end: val.interval.end!.toISO(),
            },
          })) ?? [],
      };
    },
  });

  return (
    <Create title="Create Event" resource="event">
      <p>Add an event to the DanceBlue app and website.</p>
      <Form form={form}>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Summary" name="summary">
          <Input />
        </Form.Item>
        <Form.Item label="Location" name="location">
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea />
        </Form.Item>
        <Form.List name="occurrences">
          {(fields, { add, remove }) => (
            <Flex vertical>
              {fields.map((field, idx) => (
                <Form.Item
                  label={`Occurrence ${idx + 1}`}
                  {...field}
                  validateFirst
                  rules={[
                    {
                      required: true,
                    },
                    {
                      validator(
                        _,
                        value: EventOccurrencePickerValue | undefined,
                        callback
                      ) {
                        if (!value) {
                          return;
                        }
                        if (!value.interval.isValid) {
                          callback(
                            value.interval.invalidExplanation ??
                              value.interval.invalidReason ??
                              value.interval.start?.invalidExplanation ??
                              value.interval.start?.invalidReason ??
                              value.interval.end?.invalidExplanation ??
                              value.interval.end?.invalidReason ??
                              "Invalid"
                          );
                        }
                      },
                    },
                  ]}
                >
                  <EventOccurrencePicker onDelete={() => remove(idx)} />
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Add Occurrence
                </Button>
              </Form.Item>
            </Flex>
          )}
        </Form.List>
        <Button type="primary" htmlType="submit">
          Create Event
        </Button>
      </Form>
    </Create>
  );
}

export const Route = createFileRoute("/events/create")({
  component: EventsCreate,
});
