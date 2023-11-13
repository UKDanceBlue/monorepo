import { base64StringToArray } from "@ukdanceblue/common";
import type { FragmentType } from "@ukdanceblue/common/graphql-client-admin";
import { getFragmentData } from "@ukdanceblue/common/graphql-client-admin";
import { Button, Empty, Flex, Form, Image, Input, List } from "antd";
import { thumbHashToDataURL } from "thumbhash";
import type { UseQueryExecute } from "urql";

import { EventOccurrencePicker } from "../components/EventOccurrencePicker";

import { EventEditorFragment } from "./EventEditorGQL";
import { useEventEditorForm } from "./useEventEditorForm";

export function EventEditor({
  eventFragment,
  refetchEvent,
}: {
  eventFragment?: FragmentType<typeof EventEditorFragment> | undefined;
  refetchEvent?: UseQueryExecute | undefined;
}) {
  const { formApi } = useEventEditorForm(eventFragment, refetchEvent);

  const eventData = getFragmentData(EventEditorFragment, eventFragment);

  if (!eventData) {
    return <Empty description="Event not found" style={{ marginTop: "1em" }} />;
  }

  return (
    <Flex vertical gap="middle" align="center">
      <formApi.Provider>
        <Form
          onFinish={() => {
            formApi.handleSubmit().catch(console.error);
          }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 32 }}
        >
          <formApi.Field
            name="title"
            onChange={(value) => (!value ? "Title is required" : undefined)}
            children={(field) => (
              <Form.Item
                label="Title"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input
                  status={field.state.meta.errors.length > 0 ? "error" : ""}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          />
          {eventData.images.length > 0 && (
            <Flex
              gap="middle"
              align="center"
              style={{ maxHeight: "50vh", overflow: "auto" }}
            >
              <Image.PreviewGroup>
                {eventData.images.map((image) => {
                  const thumbHash =
                    image.thumbHash &&
                    thumbHashToDataURL(base64StringToArray(image.thumbHash));

                  return (
                    <Image
                      src={
                        image.url?.toString() ??
                        image.imageData ??
                        "about:blank"
                      }
                      fallback={thumbHash ?? "about:blank"}
                      loading="lazy"
                      placeholder={
                        thumbHash == null ? (
                          false
                        ) : (
                          <Image
                            src={thumbHash}
                            width={image.width}
                            height={image.height}
                          />
                        )
                      }
                      width={image.width}
                      height={image.height}
                      alt={image.alt ?? undefined}
                    />
                  );
                })}
              </Image.PreviewGroup>
            </Flex>
          )}
          <formApi.Field
            name="summary"
            onChange={(value) =>
              (value?.length ?? 0) > 255 ? "Too long" : undefined
            }
            children={(field) => (
              <Form.Item
                label="Summary"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input.TextArea
                  name={field.name}
                  value={field.state.value ?? undefined}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          />
          <formApi.Field
            name="location"
            children={(field) => (
              <Form.Item
                label="Location"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input
                  name={field.name}
                  value={field.state.value ?? undefined}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          />

          <List>
            <formApi.Field
              name="occurrences"
              onChange={(value) => {
                for (let i = 0; i < value.length; i++) {
                  const interval = value[i]?.interval;
                  if (interval && !interval.isValid) {
                    return `Occurrence interval ${i + 1} is invalid: ${
                      interval.invalidExplanation
                    }`;
                  }
                }
                return undefined;
              }}
              children={(field) => (
                <Form.Item
                  label="Occurrences"
                  validateStatus={
                    field.state.meta.errors.length > 0 ? "error" : ""
                  }
                  help={
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : undefined
                  }
                >
                  <List>
                    {field.state.value.map((occurrence, index) => (
                      <List.Item key={occurrence.uuid ?? index}>
                        <EventOccurrencePicker
                          defaultOccurrence={occurrence}
                          onChange={(value) => {
                            field.state.value.splice(index, 1, value);
                            field.handleChange(field.state.value);
                          }}
                        />
                      </List.Item>
                    ))}
                  </List>
                </Form.Item>
              )}
            />
          </List>
          <formApi.Field
            name="description"
            children={(field) => (
              <Form.Item
                label="Description"
                validateStatus={
                  field.state.meta.errors.length > 0 ? "error" : ""
                }
                help={
                  field.state.meta.errors.length > 0
                    ? field.state.meta.errors[0]
                    : undefined
                }
              >
                <Input.TextArea
                  name={field.name}
                  value={field.state.value ?? undefined}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Form.Item>
            )}
          />
          <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </formApi.Provider>
    </Flex>
  );
}
