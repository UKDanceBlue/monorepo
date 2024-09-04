import { CreateNotificationForm } from "@elements/forms/notification/create/CreateNotificationForm";
import { createFileRoute } from "@tanstack/react-router";

function CreateNotificationPage() {
  return (
    <div>
      <h1>Create Notification</h1>
      <CreateNotificationForm />
    </div>
  );
}

export const Route = createFileRoute("/notifications/create")({
  component: CreateNotificationPage,
});
