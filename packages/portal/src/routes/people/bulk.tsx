console.log(
  "If you press the eye icon you can see that person's info, such as email, linkblue, access level, and team. If you press the pencil then you can edit the info. if you press “create person” you type their name, link blue and email. This is important because to access anything on the front face of the app, they need to log in with their link blue."
);

import { createFileRoute } from "@tanstack/react-router";
import { AccessLevel } from "@ukdanceblue/common";

import { BulkPersonCreator } from "#elements/forms/person/create/BulkPersonCreator.js";

function BulkCreatePersonPage() {
  return (
    <div>
      <h1>Upload Person CSV</h1>
      <BulkPersonCreator />
    </div>
  );
}

export const Route = createFileRoute("/people/bulk")({
  component: BulkCreatePersonPage,

  staticData: {
    authorizationRules: [
      {
        accessLevel: AccessLevel.SuperAdmin,
      },
    ],
  },
});
