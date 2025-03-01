import { Link } from "@tanstack/react-router";
import type {
  Authorization,
  CommitteeIdentifier,
  CommitteeRole,
} from "@ukdanceblue/common";
import {
  AccessLevel,
  committeeNames,
  MembershipPositionType,
  roleToAccessLevel,
  stringifyAccessLevel,
} from "@ukdanceblue/common";
import { Descriptions } from "antd";

export function PersonViewer({
  personData: {
    name,
    teams,
    email,
    linkblue,
    primarySpiritTeam,
    primaryMoraleTeam,
  },
  personAuthorization,
}: {
  personData: {
    name: string | null;
    linkblue: string | null;
    email: string;
    primarySpiritTeam: { team: { id: string } } | null;
    primaryMoraleTeam: { team: { id: string } } | null;
    teams:
      | {
          position: MembershipPositionType;
          team: {
            marathon: { year: string };
            id: string;
            name: string;
            committeeIdentifier: CommitteeIdentifier | null;
          };
          committeeRole: CommitteeRole | null;
        }[]
      | null
      | undefined;
  };
  personAuthorization?: Authorization;
}) {
  const committees: {
    identifier: CommitteeIdentifier;
    role: CommitteeRole;
    year: string;
  }[] = [];

  for (const team of teams ?? []) {
    if (team.team.committeeIdentifier && team.committeeRole) {
      committees.push({
        identifier: team.team.committeeIdentifier,
        role: team.committeeRole,
        year: team.team.marathon.year,
      });
    }
  }

  return (
    <Descriptions
      column={2}
      layout="horizontal"
      items={[
        { label: "Name", children: name },
        {
          label: "Linkblue",
          children: linkblue,
        },
        {
          label: "Email",
          children: email,
        },
        ...(personAuthorization
          ? [
              {
                label: "Access Level",
                children: (
                  <span
                    title={personAuthorization.effectiveCommitteeRoles
                      .map(
                        (role) =>
                          `${committeeNames[role.identifier]}: ${role.role}`
                      )
                      .join("\n")}
                  >
                    {stringifyAccessLevel(
                      roleToAccessLevel(
                        committees,
                        personAuthorization.authSource
                      )
                    )}
                  </span>
                ),
              },
            ]
          : []),
        ...committees.map((committee) => ({
          label: `${committeeNames[committee.identifier]} (${committee.year})`,
          children: committee.role,
        })),
        ...(teams
          ? [
              {
                label: "Teams",
                children:
                  teams.length === 0 ? (
                    "Not a member of any teams"
                  ) : (
                    <dl style={{ marginTop: "0" }}>
                      {teams.map((team) => {
                        const isCaptain =
                          personAuthorization &&
                          (personAuthorization.accessLevel >=
                            AccessLevel.Committee ||
                            team.position === MembershipPositionType.Captain);

                        return (
                          <div key={team.team.id}>
                            <dt
                              style={{
                                fontWeight:
                                  primarySpiritTeam?.team.id === team.team.id ||
                                  primaryMoraleTeam?.team.id === team.team.id
                                    ? "bold"
                                    : "normal",
                              }}
                            >
                              {team.team.name} {team.position} (
                              {team.team.marathon.year})
                            </dt>
                            <dd>
                              <br />
                              {isCaptain ? (
                                <Link
                                  to="/teams/$teamId"
                                  params={{ teamId: team.team.id }}
                                >
                                  Click here to view
                                </Link>
                              ) : (
                                ""
                              )}
                            </dd>
                          </div>
                        );
                      })}
                    </dl>
                  ),
              },
            ]
          : []),
      ]}
    />
  );
}
