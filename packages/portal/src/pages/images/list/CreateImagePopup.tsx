import { TanAntFormItem } from "@elements/components/form/TanAntFormItem";
import { useAntFeedback } from "@hooks/useAntFeedback";
import { useForm } from "@tanstack/react-form";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import { Form, Input, Modal } from "antd";
import { useClient } from "urql";

const createImageDocument = graphql(/* GraphQL */ `
  mutation CreateImage($input: CreateImageInput!) {
    createImage(input: $input) {
      id
    }
  }
`);

export function CreateImagePopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: (createdImageUuid?: string) => void;
}) {
  const { showErrorMessage } = useAntFeedback();

  const client = useClient();

  const formApi = useForm<{
    alt: string;
    url?: string;
  }>({
    onSubmit: async ({ value: { alt, url } }) => {
      const { data, error } = await client
        .mutation(createImageDocument, {
          input: {
            alt,
            url: url ? new URL(url) : undefined,
          },
        })
        .toPromise();

      if (data?.createImage) {
        if (error) {
          void showErrorMessage(error.message);
        }
        onClose(data.createImage.id);
      } else {
        void showErrorMessage(error?.message ?? "An unknown error occurred");
      }
    },
  });

  return (
    <Form layout="vertical">
      <Modal
        title="Create Image"
        open={open}
        okType="primary"
        okText="Create"
        onOk={async () => {
          return formApi.handleSubmit().catch((error: unknown) => {
            if (error instanceof Error) {
              void showErrorMessage(error.message);
            } else {
              void showErrorMessage("An unknown error occurred");
            }
          });
        }}
        onCancel={() => {
          onClose();
          formApi.reset();
        }}
      >
        <TanAntFormItem
          formApi={formApi}
          name="alt"
          fieldProps={{
            validate: (value) => {
              if (!value || value.trim() === "") {
                return "Please provide a description";
              }
              return undefined;
            },
          }}
          label="Image Description"
        >
          {({ value, onBlur, onChange, status }) => (
            <Input
              placeholder="A description of the image (please be descriptive)"
              value={value}
              onBlur={onBlur}
              onChange={(e) => onChange(e.target.value)}
              status={status}
            />
          )}
        </TanAntFormItem>
        <TanAntFormItem
          formApi={formApi}
          name="url"
          fieldProps={{
            validate: (value) => {
              if (!value || value.trim() === "") {
                return undefined;
              }

              try {
                new URL(value);
                return undefined;
              } catch {
                return "URL is invalid";
              }
            },
          }}
          label="Image URL"
        >
          {({ value, onBlur, onChange, status }) => (
            <>
              <Input
                placeholder="URL of the image"
                value={value}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                status={status}
              />
              <p>
                If you would like to upload the image rather than provide an
                external URL, just leave this field blank. You can upload the
                actual file in the next step.
              </p>
            </>
          )}
        </TanAntFormItem>
      </Modal>
    </Form>
  );
}
