import { useNotification } from "@refinedev/core";
import { CommitteeRole } from "@ukdanceblue/common";
import { CommitteeIdentifier } from "@ukdanceblue/common";
import { useMutation } from "urql";
import { z } from "zod";

import { useMarathon } from "#config/marathonContext.js";
import { UploadButton } from "#elements/components/UploadButton.tsx";
import { graphql, type VariablesOf } from "#gql/index.js";
import { useQueryStatusWatcher } from "#hooks/useQueryStatusWatcher.js";

const personBulkCreatorDocument = graphql(/* GraphQL */ `
  mutation PersonBulkCreator(
    $input: [BulkPersonInput!]!
    $marathonId: GlobalId!
  ) {
    bulkLoadPeople(people: $input, marathonId: $marathonId) {
      id
    }
  }
`);

function mapCommitteeNameToIdentifier(committee: string): CommitteeIdentifier {
  for (const [key, value] of Object.entries(CommitteeIdentifier)) {
    if (committee === key || committee === value) {
      return value;
    }
  }
  switch (committee) {
    case "Community Development/Morale": {
      return CommitteeIdentifier.communityDevelopmentCommittee;
    }
    case "Overall": {
      return CommitteeIdentifier.overallCommittee;
    }
    case "Corporate Relations": {
      return CommitteeIdentifier.corporateCommittee;
    }
    case "Dancer Relations": {
      return CommitteeIdentifier.dancerRelationsCommittee;
    }
    case "Family Relations": {
      return CommitteeIdentifier.familyRelationsCommittee;
    }
    case "Fundraising": {
      return CommitteeIdentifier.fundraisingCommittee;
    }
    case "Marketing": {
      return CommitteeIdentifier.marketingCommittee;
    }
    case "Corporate": {
      return CommitteeIdentifier.corporateCommittee;
    }
    case "Mini Marathons": {
      return CommitteeIdentifier.miniMarathonsCommittee;
    }
    case "Operations": {
      return CommitteeIdentifier.operationsCommittee;
    }
    case "Programming": {
      return CommitteeIdentifier.programmingCommittee;
    }
    case "Technology": {
      return CommitteeIdentifier.techCommittee;
    }
    default: {
      throw new Error(`Unknown committee: ${committee}`);
    }
  }
}

export function UploadPersonButton() {
  const [{ fetching, error }, bulkCreatePeople] = useMutation(
    personBulkCreatorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Creating people...",
  });

  const selectedMarathon = useMarathon();

  const { open } = useNotification();

  return (
    <UploadButton
      title="Import People"
      onConfirm={async (
        input: {
          name: string | undefined;
          linkblue: string | undefined;
          email: string;
          committee: CommitteeIdentifier | undefined;
          role: CommitteeRole | undefined;
        }[]
      ) => {
        if (!selectedMarathon) {
          throw new Error("No marathon selected");
        }
        const result = await bulkCreatePeople({
          input: input as VariablesOf<
            typeof personBulkCreatorDocument
          >["input"],
          marathonId: selectedMarathon.id,
        });

        if (result.error) {
          throw result.error;
        } else {
          open?.({ type: "success", message: "People created successfully" });
        }
      }}
      columns={[
        {
          id: "name",
          title: "Name",
          validator: z.string().nonempty().optional(),
        },
        {
          id: "email",
          title: "Email",
          validator: z.string().email(),
        },
        {
          id: "linkblue",
          title: "Linkblue",
          validator: z.string().nonempty().optional(),
        },
        {
          id: "committee",
          title: "Committee",
          validator: z
            .string()
            .optional()
            .transform((committee, ctx) => {
              try {
                if (committee == null) {
                  return undefined;
                }
                return mapCommitteeNameToIdentifier(committee);
              } catch (error) {
                ctx.addIssue({
                  message: String(error),
                  code: z.ZodIssueCode.custom,
                });
                return z.NEVER;
              }
            }),
        },
        {
          id: "role",
          title: "Role",
          validator: z
            .enum([
              CommitteeRole.Member,
              CommitteeRole.Coordinator,
              CommitteeRole.Chair,
            ])
            .optional(),
        },
      ]}
    />
  );
}
