import "@mdxeditor/editor/style.css";

import { listsPlugin, MDXEditor, quotePlugin } from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor";
import { useForm } from "@refinedev/antd";
import type { HttpError } from "@refinedev/core";

import type { ResultOf, VariablesOf } from "#graphql/index.js";
import { readFragment } from "#graphql/index.js";

import {
  EventEditorFragment,
  eventEditorMutationDocument,
  eventEditorQueryDocument,
} from "./EventEditorGQL.js";

export function EventEditor({ id }: { id: string }) {
  const { formProps, saveButtonProps, query } = useForm<
    ResultOf<typeof eventEditorQueryDocument>,
    HttpError,
    VariablesOf<typeof eventEditorMutationDocument>["input"],
    ResultOf<typeof EventEditorFragment>,
    ResultOf<typeof eventEditorMutationDocument>
  >({
    id,
    action: "edit",
    resource: "event",
    meta: {
      gqlMutation: eventEditorMutationDocument,
      gqlQuery: eventEditorQueryDocument,
    },
    queryOptions: {
      select({ data }) {
        return { data: readFragment(EventEditorFragment, data.event) };
      },
    },
  });

  return (
    // <Flex vertical gap="middle" align="center">
    //   <Form
    //     onFinish={() => {
    //       formApi.handleSubmit().catch((error: unknown) => {
    //         if (error instanceof Error) {
    //           void message.error(error.message);
    //         } else {
    //           void message.error("An unknown error occurred");
    //         }
    //       });
    //     }}
    //     labelCol={{ span: 8 }}
    //     wrapperCol={{ span: 32 }}
    //   >
    //     <formApi.Field
    //       name="title"
    //       validators={{
    //         onChange: ({ value }) => (!value ? "Title is required" : undefined),
    //       }}
    //       children={(field) => (
    //         <Form.Item
    //           label="Title*"
    //           validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
    //           help={
    //             field.state.meta.errors.length > 0
    //               ? field.state.meta.errors[0]
    //               : undefined
    //           }
    //         >
    //           <Input
    //             status={field.state.meta.errors.length > 0 ? "error" : ""}
    //             name={field.name}
    //             value={field.state.value}
    //             onBlur={field.handleBlur}
    //             onChange={(e) => field.handleChange(e.target.value)}
    //           />
    //         </Form.Item>
    //       )}
    //     />
    //     {eventData.images.length > 0 && (
    //       <Flex
    //         gap="middle"
    //         align="center"
    //         style={{ maxHeight: "50vh", overflow: "auto" }}
    //       >
    //         <Image.PreviewGroup>
    //           {eventData.images.map((image) => {
    //             const thumbHash =
    //               image.thumbHash &&
    //               thumbHashToDataURL(base64StringToArray(image.thumbHash));

    //             return (
    //               <Image
    //                 src={image.url?.toString() ?? "about:blank"}
    //                 fallback={thumbHash ?? "about:blank"}
    //                 loading="lazy"
    //                 placeholder={
    //                   thumbHash == null ? (
    //                     false
    //                   ) : (
    //                     <Image
    //                       src={thumbHash}
    //                       width={image.width}
    //                       height={image.height}
    //                     />
    //                   )
    //                 }
    //                 width={image.width}
    //                 height={image.height}
    //                 alt={image.alt ?? undefined}
    //               />
    //             );
    //           })}
    //         </Image.PreviewGroup>
    //       </Flex>
    //     )}
    //     <formApi.Field
    //       name="summary"
    //       validators={{
    //         onChange: ({ value }) =>
    //           (value?.length ?? 0) > 255 ? "Too long" : undefined,
    //       }}
    //       children={(field) => (
    //         <Form.Item
    //           label="Summary*"
    //           validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
    //           help={
    //             field.state.meta.errors.length > 0
    //               ? field.state.meta.errors[0]
    //               : undefined
    //           }
    //         >
    //           <Input.TextArea
    //             name={field.name}
    //             value={field.state.value ?? undefined}
    //             onBlur={field.handleBlur}
    //             onChange={(e) => field.handleChange(e.target.value)}
    //           />
    //         </Form.Item>
    //       )}
    //     />
    //     <formApi.Field
    //       name="location"
    //       children={(field) => (
    //         <Form.Item
    //           label="Location"
    //           validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
    //           help={
    //             field.state.meta.errors.length > 0
    //               ? field.state.meta.errors[0]
    //               : undefined
    //           }
    //         >
    //           <Input
    //             name={field.name}
    //             value={field.state.value ?? undefined}
    //             onBlur={field.handleBlur}
    //             onChange={(e) => field.handleChange(e.target.value)}
    //           />
    //         </Form.Item>
    //       )}
    //     />

    //     <formApi.Field
    //       name="occurrences"
    //       validators={{
    //         onChange: ({ value }) => {
    //           for (let i = 0; i < value.length; i++) {
    //             const interval = value[i]?.interval;
    //             if (interval && !interval.isValid) {
    //               return `Occurrence interval ${i + 1} is invalid: ${
    //                 interval.invalidExplanation
    //               }`;
    //             }
    //           }
    //           return undefined;
    //         },
    //       }}
    //       mode="array"
    //     >
    //       {(field) => (
    //         <Form.Item
    //           label="Occurrences"
    //           validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
    //           help={
    //             field.state.meta.errors.length > 0
    //               ? field.state.meta.errors[0]
    //               : undefined
    //           }
    //         >
    //           <List>
    //             {field.state.value.length > 0 ? (
    //               field.state.value.map((occurrence, index) => (
    //                 <List.Item key={occurrence.uuid ?? index}>
    //                   <EventOccurrencePicker
    //                     defaultOccurrence={occurrence}
    //                     onChange={(value) => {
    //                       field.state.value.splice(index, 1, value);
    //                       field.handleChange(field.state.value);
    //                     }}
    //                   />
    //                 </List.Item>
    //               ))
    //             ) : (
    //               <Empty description="No occurrences" />
    //             )}
    //           </List>
    //           <Button
    //             icon={<PlusOutlined />}
    //             onClick={() => {
    //               field.pushValue({
    //                 interval: Interval.fromDateTimes(
    //                   DateTime.now(),
    //                   DateTime.now().plus({ hours: 1 })
    //                 ),
    //                 fullDay: false,
    //               });
    //             }}
    //           >
    //             Add occurrence
    //           </Button>
    //         </Form.Item>
    //       )}
    //     </formApi.Field>
    //     <formApi.Field
    //       name="description"
    //       children={(field) => (
    //         <Form.Item
    //           label="Description"
    //           validateStatus={field.state.meta.errors.length > 0 ? "error" : ""}
    //           help={
    //             field.state.meta.errors.length > 0
    //               ? field.state.meta.errors[0]
    //               : undefined
    //           }
    //         >
    //           <MDXEditor
    //             markdown={field.state.value ?? ""}
    //             onBlur={field.handleBlur}
    //             onChange={(text) => field.handleChange(text)}
    //             plugins={[headingsPlugin()]}
    //             onError={(error) =>
    //               field.setErrorMap({ onChange: error.error })
    //             }
    //           />
    //         </Form.Item>
    //       )}
    //     />
    //     <Form.Item wrapperCol={{ span: 32, offset: 8 }}>
    //       <Button type="primary" htmlType="submit">
    //         Save
    //       </Button>
    //     </Form.Item>
    //   </Form>
    // </Flex>

    // <Edit saveButtonProps={saveButtonProps}>
    //   <Form {...formProps} layout="vertical">
    //     <Form.Item
    //       label="Title"
    //       name="title"
    //       rules={[{ required: true, message: "Title is required" }]}
    //     >
    //       <Input />
    //     </Form.Item>
    //     <Form.Item
    //       label="Summary"
    //       name="summary"
    //       rules={[{ required: true, message: "Summary is required" }]}
    //     >
    //       <Input.TextArea />
    //     </Form.Item>
    //     <Form.Item label="Location" name="location">
    //       <Input />
    //     </Form.Item>
    //     <Form.List name="occurrences">
    //       {(fields, { add, remove }) => (
    //         <div>
    //           {fields.map((field, i) => (
    //             <Form.Item {...field}>
    //               <EventOccurrencePicker onDelete={() => remove(i)} />
    //             </Form.Item>
    //           ))}
    //           <Form.Item>
    //             <Button
    //               type="dashed"
    //               onClick={() => add()}
    //               icon={<PlusOutlined />}
    //             >
    //               Add occurrence
    //             </Button>
    //           </Form.Item>
    //         </div>
    //       )}
    //     </Form.List>
    //     {/* <Form.Item label="Description" name="description">
    // <MDXEditor
    //   markdown={formProps.initialValues?.description ?? ""}
    //   onChange={(text) => formProps.form?.setFieldValue("description", text)}
    //   plugins={[headingsPlugin(), quotePlugin(), listsPlugin()]}
    // />

    JSON.stringify(formProps.initialValues)

    //     </Form.Item> */}
    //   </Form>
    // </Edit>
    // null
  );
}
