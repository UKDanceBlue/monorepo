import { Modal } from "antd";
import useNotification from "antd/es/notification/useNotification.js";
import { useEffect, useState } from "react";
import { useMutation } from "urql";

import { graphql } from "@/graphql/index.js";

const deleteEventDocument = graphql(/* GraphQL */ `
  mutation DeleteEvent($uuid: GlobalId!) {
    deleteEvent(uuid: $uuid) {
      ok
    }
  }
`);

export const useEventDeletePopup = ({
  uuid,
  onDelete,
}: {
  uuid: string;
  onDelete?: () => void;
}) => {
  const [{ info: showInfoMessage, error: showErrorMessage }, contextHolder] =
    useNotification();
  const [{ fetching, data }, deleteEvent] = useMutation(deleteEventDocument);
  const [open, setOpen] = useState(false);

  const showDelete = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data?.deleteEvent.ok) {
      setOpen(false);
    }
  }, [data?.deleteEvent.ok]);

  const EventDeletePopup = (
    <>
      {contextHolder}
      <Modal
        title="Delete Event"
        open={open}
        onOk={() =>
          deleteEvent({ uuid }).then((value) => {
            if (value.data?.deleteEvent.ok) {
              showInfoMessage({
                message: "Event successfully deleted",
              });
              onDelete?.();
            }
            if (value.error) {
              showErrorMessage({
                message: "Error deleting event",
                description: value.error.message,
              });
            }
          })
        }
        confirmLoading={fetching}
        onCancel={handleCancel}
        cancelButtonProps={{ disabled: fetching }}
      >
        <p>Are you sure you want to delete this event?</p>
      </Modal>
    </>
  );

  return {
    EventDeletePopup,
    showModal: showDelete,
  };
};
