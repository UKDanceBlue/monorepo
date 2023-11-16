import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Modal } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { useEffect, useState } from "react";
import { useMutation } from "urql";

const deletePointEntryDocument = graphql(/* GraphQL */ `
  mutation DeletePointEntry($uuid: String!) {
    deletePointEntry(uuid: $uuid) {
      ok
    }
  }
`);

export const usePointEntryDeletePopup = ({
  onDelete,
}: {
  onDelete?: () => void;
} = {}) => {
  const [{ info: showInfoMessage, error: showErrorMessage }, contextHolder] =
    useNotification();
  const [{ fetching, data }, deletePointEntry] = useMutation(
    deletePointEntryDocument
  );
  const [open, setOpen] = useState(false);
  const [uuid, setUuid] = useState<string | null>(null);

  const showDelete = (uuid: string) => {
    setUuid(uuid);
    setOpen(true);
  };

  const handleCancel = () => {
    setUuid(null);
    setOpen(false);
  };

  useEffect(() => {
    if (data?.deletePointEntry.ok) {
      setUuid(null);
      setOpen(false);
    }
  }, [data?.deletePointEntry.ok]);

  const PointEntryDeletePopup = (
    <>
      {contextHolder}
      <Modal
        title="Delete PointEntry"
        open={open}
        onOk={() => {
          if (uuid) {
            deletePointEntry({ uuid })
              .then((value) => {
                if (value.data?.deletePointEntry.ok) {
                  showInfoMessage({
                    message: "Point entry successfully deleted",
                  });
                  onDelete?.();
                }
                if (value.error) {
                  showErrorMessage({
                    message: "Error deleting point entry",
                    description: value.error.message,
                  });
                }
              })
              .catch(console.error);
          }
        }}
        confirmLoading={fetching}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: fetching }}
      >
        <p>Are you sure you want to delete this point entry?</p>
      </Modal>
    </>
  );

  return {
    PointEntryDeletePopup,
    showModal: showDelete,
  };
};
