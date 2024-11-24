import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";
import { useQuery } from "urql";

import { ManageNotificationForm } from "#elements/forms/notification/manage/ManageNotificationForm.js";
import { graphql } from "#graphql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";
import { routerAuthCheck } from "#tools/routerAuthCheck.js";

const notificationManagerDocument = graphql(/* GraphQL */ `
  query NotificationManager($uuid: GlobalId!) {
    notification(uuid: $uuid) {
      data {
        ...SingleNotificationFragment
      }
    }
  }
`);

function ManageNotificationPage() {
  const { notificationId } = Route.useParams();

  const [{ data, fetching, error }, refetchNotification] = useQuery({
    query: notificationManagerDocument,
    variables: { uuid: notificationId },
  });

  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Loading notification...",
  });

  return (
    <div>
      <h1>Manage Notification</h1>
      <p>
        Welcome to the notification delivery manager. It looks complicated but I
        promise it's not!
      </p>
      <details>
        <summary>More info</summary>
        <p>
          You will see there are three parts here, first is the preview of the
          notification, this isn't actually totally accurate but it gives you a
          good idea of what it will look like. The second part is the
          notification details pane. This shows you the full content of the
          notification, any extra info that goes into it, and its status. The
          third part is the sidebar with controls to send, delete, or schedule
          the notification. There is no way to edit the content of a
          notification once it's been created, so if you need to make changes
          you will need to delete the notification and create a new one.
          Deleting a notification is not possible once it has started sending as
          there is no way to stop Apple or Google from sending it once we have
          told them to. Upon request, the Tech Committee CAN delete a
          notification from users' notification history.
        </p>
        <p>
          The sidebar controls for scheduling and sending are also pretty
          simple. To send a notification right away just hit the "Send" button,
          this will go ahead and send the notification to everyone who is
          supposed to get it. To schedule a notification for a future date, just
          pick the date and time you want it to go out and hit the "Schedule"
          button. If you need to cancel a scheduled notification, just hit the
          "Cancel" button and it will be removed from the schedule. Note that
          due to the way notifications are handled by the server the time you
          pick is not guaranteed to be the exact time the notification goes out,
          but it will be close. This uncertainty does get much worse if you
          schedule a notification for sometime in the next few minutes though,
          in that case, please just send the notification manually.
        </p>
        <p>
          Once a notification has been sent it will fill out some of the
          metadata fields in details, first will be 'started sending at'. Over
          time the server will fill in the rest, assuming everything goes well
          you shouldn't see much else change, however, if there are delivery
          issues they will show up either under 'Individual delivery issues' or
          'Notification problem'. If something shows up under 'Notification
          problem' this means something bad happened and the entire notification
          failed to send. Retrying probably won't help this and you will need to
          reach out to the Tech Committee for help. Seeing issues under
          'Individual delivery issues' is not uncommon and usually means that a
          user's device was offline or they got a new phone or something like
          that. The server SHOULD handle all of this for you, but if you see a
          lot of issues here it might be worth checking in with the Tech
          Committee to make sure everything is working as expected.
        </p>
      </details>
      <ManageNotificationForm
        notificationFragment={data?.notification.data}
        refetchNotification={refetchNotification}
      />
    </div>
  );
}

export const Route = createFileRoute("/notifications/$notificationId/manage")({
  component: ManageNotificationPage,
  async beforeLoad({ context, params: { notificationId } }) {
    await context.urqlClient.query(notificationManagerDocument, {
      uuid: notificationId,
    });
    routerAuthCheck(Route, context);
  },
  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.CommitteeChairOrCoordinator,
      },
    ],
  },
});
