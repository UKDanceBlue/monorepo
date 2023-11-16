import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Descriptions } from "antd";
import { useQuery } from "urql";

const teamViewerDocument = graphql(/* GraphQL */ `
  query TeamViewer($uuid: String!) {
    team(uuid: $uuid) {
      data {
        name
        marathonYear
        legacyStatus
        totalPoints
        type
        members {
          person {
            name
            linkblue
          }
        }
        captains {
          person {
            name
            linkblue
          }
        }
      }
    }
  }
`);

export function TeamViewer({ uuid }: { uuid: string }) {
  const [{ fetching, data: team, error }] = useQuery({
    query: teamViewerDocument,
    variables: { uuid },
  });
  useQueryStatusWatcher({
    fetching,
    error,
    loadingMessage: "Loading team...",
  });

  return (
    <Descriptions bordered column={1} size="small">
      <Descriptions.Item label="Name">{team?.team.data.name}</Descriptions.Item>
      <Descriptions.Item label="Marathon Year">
        {team?.team.data.marathonYear}
      </Descriptions.Item>
      <Descriptions.Item label="Legacy Status">
        {team?.team.data.legacyStatus}
      </Descriptions.Item>
      <Descriptions.Item label="Total Points">
        {team?.team.data.totalPoints}
      </Descriptions.Item>
      <Descriptions.Item label="Type">{team?.team.data.type}</Descriptions.Item>
      <Descriptions.Item label="Members">
        <ul>
          {team?.team.data.members.map((member) => (
            <li>
              {member.person.name} ({member.person.linkblue})
            </li>
          ))}
        </ul>
      </Descriptions.Item>
      <Descriptions.Item label="Captains">
        <ul>
          {team?.team.data.captains.map((captain) => (
            <li>
              {captain.person.name} ({captain.person.linkblue})
            </li>
          ))}
        </ul>
      </Descriptions.Item>
    </Descriptions>
  );
}
