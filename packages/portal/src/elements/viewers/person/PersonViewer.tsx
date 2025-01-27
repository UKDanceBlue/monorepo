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
    teams: {
      position: MembershipPositionType;
      team: {
        marathon: { year: string };
        id: string;
        name: string;
        committeeIdentifier: CommitteeIdentifier | null;
      };
      committeeRole: CommitteeRole | null;
    }[];
  };
  personAuthorization?: Authorization;
}) {
  const committees: {
    identifier: CommitteeIdentifier;
    role: CommitteeRole;
    year: string;
  }[] = [];

  for (const team of teams) {
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
      column={1}
      layout="vertical"
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
        {
          label: "Teams",
          children:
            teams.length === 0 ? (
              "Not a member of any teams"
            ) : (
              <dl style={{ marginTop: "0" }}>
                {teams.map((team) => {
                  let children;

                  if (
                    personAuthorization &&
                    (personAuthorization.accessLevel >= AccessLevel.Committee ||
                      team.position === MembershipPositionType.Captain)
                  ) {
                    children = (
                      <Link
                        to="/teams/$teamId"
                        params={{ teamId: team.team.id }}
                      >
                        {team.position}
                      </Link>
                    );
                  } else {
                    children = team.position;
                  }

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
                        {team.team.name} ({team.team.marathon.year})
                      </dt>
                      <dd>{children}</dd>
                    </div>
                  );
                })}
              </dl>
            ),
        },
      ]}
    />
  );
}
