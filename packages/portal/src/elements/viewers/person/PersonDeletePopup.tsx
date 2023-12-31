import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Modal } from "antd";
import useNotification from "antd/es/notification/useNotification";
import { useEffect, useState } from "react";
import { useMutation } from "urql";

const deletePersonDocument = graphql(/* GraphQL */ `
  mutation DeletePerson($uuid: String!) {
    deletePerson(uuid: $uuid) {
      ok
    }
  }
`);

export const usePersonDeletePopup = ({
  uuid,
  onDelete,
}: {
  uuid: string;
  onDelete?: () => void;
}) => {
  const [{ info: showInfoMessage, error: showErrorMessage }, contextHolder] =
    useNotification();
  const [{ fetching, data }, deletePerson] = useMutation(deletePersonDocument);
  const [open, setOpen] = useState(false);

  const showDelete = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data?.deletePerson.ok) {
      setOpen(false);
    }
  }, [data?.deletePerson.ok]);

  const PersonDeletePopup = (
    <>
      {contextHolder}
      <Modal
        title="Delete Person"
        open={open}
        onOk={() =>
          deletePerson({ uuid }).then((value) => {
            if (value.data?.deletePerson.ok) {
              showInfoMessage({
                message: "Person successfully deleted",
              });
              onDelete?.();
            }
            if (value.error) {
              showErrorMessage({
                message: "Error deleting person",
                description: value.error.message,
              });
            }
          })
        }
        confirmLoading={fetching}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: fetching }}
      >
        <p>Are you sure you want to delete this person?</p>
      </Modal>
    </>
  );

  return {
    PersonDeletePopup,
    showModal: showDelete,
  };
};
