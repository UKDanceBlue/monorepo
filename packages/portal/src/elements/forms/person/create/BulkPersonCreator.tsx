import { InboxOutlined } from "@ant-design/icons";
import { useMarathon } from "@config/marathonContext";
import { useAntFeedback } from "@hooks/useAntFeedback";
import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { CommitteeIdentifier, CommitteeRole } from "@ukdanceblue/common";
import { graphql } from "@ukdanceblue/common/graphql-client-portal";
import type { BulkPersonInput } from "@ukdanceblue/common/graphql-client-portal/raw-types";
import { Upload } from "antd";
import { useMutation } from "urql";

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

const WellFormedCsvBody =
  /^([\w ]+),(.+@uky\.edu),(\w+\d+),(Community Development\/Morale|Overall|Corporate Relations|Dancer Relations|Family Relations|Fundraising|Marketing|Corporate|Mini Marathons|Operations|Programming|Technology|),(Chair|Coordinator|Member|)$/;

function mapCommitteeNameToIdentifier(committee: string): CommitteeIdentifier {
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

export function BulkPersonCreator() {
  const [{ fetching, error }, bulkCreatePeople] = useMutation(
    personBulkCreatorDocument
  );
  useQueryStatusWatcher({
    error,
    fetching,
    loadingMessage: "Creating people...",
  });

  const selectedMarathon = useMarathon();

  const { showErrorMessage, showSuccessNotification } = useAntFeedback();

  return (
    <Upload.Dragger
      accept="text/csv"
      multiple={false}
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          if (!selectedMarathon) {
            throw new Error("No marathon selected");
          }

          console.log(file);
          let fileString = "";
          if (typeof file === "string") {
            fileString = file;
          } else {
            fileString = await file
              .arrayBuffer()
              .then((buffer) => new TextDecoder().decode(buffer));
          }
          console.log(fileString);

          const lines = fileString.split("\n");
          if (lines[0] !== "Name,Email,LinkBlue,Committee,Role") {
            throw new Error("Invalid CSV header");
          }
          const headers = lines[0].split(",");

          console.log(headers);
          const people: {
            name: string;
            email: string;
            linkBlue: string;
            committee: string;
            role: string;
          }[] = [];
          for (const line of lines.slice(1)) {
            if (line.trim() === "") {
              continue;
            }

            if (!WellFormedCsvBody.test(line)) {
              console.error("Invalid CSV row (regex)", line);
              throw new Error("Invalid CSV row (regex)");
            }

            const values = line.split(",");
            if (values.length !== headers.length) {
              console.error("Invalid CSV row", line);
              throw new Error("Invalid CSV row");
            }
            const person: {
              name: string;
              email: string;
              linkBlue: string;
              committee: string;
              role: string;
            } = {
              name: values[0]!,
              email: values[1]!,
              linkBlue: values[2]!,
              committee: values[3]!,
              role: values[4]!,
            };
            people.push(person);
          }
          console.table(people);

          const mappedPeople: BulkPersonInput[] = people.map((person) => ({
            name: person.name,
            email: person.email,
            linkblue: person.linkBlue,
            committee: mapCommitteeNameToIdentifier(person.committee),
            role: CommitteeRole[person.role as keyof typeof CommitteeRole],
          }));

          const result = await bulkCreatePeople({
            input: mappedPeople,
            marathonId: selectedMarathon.id,
          });
          showSuccessNotification({
            message: `Successfully created ${result.data?.bulkLoadPeople.length} people`,
          });
          onSuccess?.("ok");

          console.log(result);
        } catch (error) {
          showErrorMessage(`Error while uploading file: ${String(error)}`);
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
    </Upload.Dragger>
  );
}
