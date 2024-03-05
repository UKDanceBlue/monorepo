import { useNavigate } from "@tanstack/react-router";

import { useNotificationCreator } from "./useNotificationCreator";

export const CreateNotificationForm = () => {
  const navigate = useNavigate();

  const { formApi } = useNotificationCreator((data) => {
    if (data?.uuid) {
      navigate({
        to: "/notifications/$notificationId/",
        params: {
          notificationId: data.uuid,
        },
      }).catch(console.error);
    }
  });

  return null;
};
