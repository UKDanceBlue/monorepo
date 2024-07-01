import { useQueryStatusWatcher } from "@hooks/useQueryStatusWatcher";
import { useParams } from "@tanstack/react-router";
import { graphql } from "@ukdanceblue/common/graphql-client-admin";
import { Flex } from "antd";
import { useQuery } from "urql";

const ViewTeamFundraisingDocument = graphql(/* GraphQL */ `
  query ViewTeamFundraisingDocument($teamUuid: GlobalId!) {
    team(uuid: $teamUuid) {
      data {
        # TODO: Add filtering and pagination
        fundraisingEntries(sendAll: true) {
          data {
            id
            amount
            donatedByText
            donatedToText
            donatedOn
            assignments {
              id
              amount
              person {
                name
              }
            }
          }
        }
      }
    }
  }
`);

export function ViewTeamFundraising() {
  const { teamId: teamUuid } = useParams({ from: "/teams/$teamId/" });

  const [{ data, fetching, error }] = useQuery({
    query: ViewTeamFundraisingDocument,
    variables: { teamUuid },
  });
  useQueryStatusWatcher({ fetching, error });

  return (
    <Flex>
      <table>
        <thead>
          <tr>
            <th>Donated By</th>
            <th>Donated To</th>
            <th>Donated On</th>
            <th>Amount</th>
            <th>Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {data?.team.data.fundraisingEntries.data.map(
            ({
              id,
              donatedByText,
              donatedToText,
              donatedOn,
              amount,
              assignments,
            }) => (
              <tr key={id}>
                <td>{donatedByText}</td>
                <td>{donatedToText}</td>
                <td>{donatedOn.toLocaleString()}</td>
                <td>${amount}</td>
                <td>
                  <dl>
                    {assignments.map(({ id, person, amount }) => (
                      <div key={id}>
                        <dt>{person?.name}</dt>
                        <dd>${amount}</dd>
                      </div>
                    ))}
                  </dl>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </Flex>
  );
}
