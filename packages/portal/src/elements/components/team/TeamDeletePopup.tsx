import { Modal } from "antd";
import useNotification from "antd/es/notification/useNotification.js";
import { useEffect, useState } from "react";
import { useMutation } from "urql";

import { graphql } from "@/graphql/index.js";

const deleteTeamDocument = graphql(/* GraphQL */ `
  mutation DeleteTeam($uuid: GlobalId!) {
    deleteTeam(uuid: $uuid) {
      ok
    }
  }
`);

export const useTeamDeletePopup = ({
  uuid,
  onDelete,
}: {
  uuid: string;
  onDelete?: () => void;
}) => {
  const [{ info: showInfoMessage, error: showErrorMessage }, contextHolder] =
    useNotification();
  const [{ fetching, data }, deleteTeam] = useMutation(deleteTeamDocument);
  const [open, setOpen] = useState(false);

  const showDelete = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data?.deleteTeam.ok) {
      setOpen(false);
    }
  }, [data?.deleteTeam.ok]);

  const TeamDeletePopup = (
    <>
      {contextHolder}
      <Modal
        title="Delete Team"
        open={open}
        onOk={() =>
          deleteTeam({ uuid }).then((value) => {
            if (value.data?.deleteTeam.ok) {
              showInfoMessage({
                message: "Team successfully deleted",
              });
              onDelete?.();
            }
            if (value.error) {
              showErrorMessage({
                message: "Error deleting team",
                description: value.error.message,
              });
            }
          })
        }
        confirmLoading={fetching}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: fetching }}
      >
        <p>Are you sure you want to delete this team?</p>
      </Modal>
    </>
  );

  return {
    TeamDeletePopup,
    showModal: showDelete,
  };
};
