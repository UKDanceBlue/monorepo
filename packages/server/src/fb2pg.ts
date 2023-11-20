import { TeamLegacyStatus, TeamType } from "@ukdanceblue/common";
import { cert, initializeApp } from "firebase-admin/app";
import { Timestamp, getFirestore } from "firebase-admin/firestore";

import { sequelizeDb } from "./data-source.js";
import { json } from "./dbPoints.js";
import { MembershipModel } from "./models/Membership.js";
import { PersonModel } from "./models/Person.js";
import { PointOpportunityModel } from "./models/PointOpportunity.js";
import { TeamModel } from "./models/Team.js";

initializeApp({
  credential: cert(
    "/home/tagho/Source/danceblue/packages/server/react-danceblue-firebase-adminsdk-73qss-83d3f96693.json"
  ),
});

await import("./environment.js");
await import("./models/init.js");

export interface FirestoreTeamJson {
  id: string;
  name: string;
  members?: string[];
  memberNames?: Record<string, string | null>;
}
export interface SpiritTeamsRootDocJson {
  basicInfo: {
    [teamId: string]: {
      name: string;
      teamClass?: "public" | "committee";
      totalPoints?: number;
    };
  };
}

export interface FirestoreSpiritOpportunityInfoJson {
  id: string;
  name: string;
  date: Timestamp;
}
export interface SpiritPointEntryJson {
  points: number;
  teamId: string;
  opportunityId: string;
  linkblue: string;
  displayName?: string;
}

// Read from firebase

const firestore = getFirestore();
const spiritCollection = firestore.collection("spirit");
const opportunityDocumentCollection = spiritCollection
  .doc("opportunities")
  .collection("documents");
const teamDocumentCollection = spiritCollection
  .doc("teams")
  .collection("documents");

const spiritOpportunities = await opportunityDocumentCollection.get();
const spiritTeams = await teamDocumentCollection.get();

const spiritOpportunitiesJson: FirestoreSpiritOpportunityInfoJson[] = [];
const spiritTeamsJson: FirestoreTeamJson[] = [];

spiritOpportunities.forEach((doc) => {
  const data = doc.data();
  if (typeof data !== "object") return;
  if (typeof data.name !== "string") return;
  if (!(data.date instanceof Timestamp)) return;
  if (typeof data.totalPoints !== "number") return;

  spiritOpportunitiesJson.push({
    id: doc.id,
    name: data.name,
    date: data.date,
  });
});

console.log(spiritTeams.size);

const pointEntries: SpiritPointEntryJson[] = [];

await Promise.all(
  spiritTeams.docs.map((doc) =>
    (async (doc) => {
      const data = doc.data();

      spiritTeamsJson.push({
        id: doc.id,
        name: data.name as string,
        members: data.members as string[],
        memberNames: data.memberNames as Record<string, string | null>,
      });

      const pointEntriesCollection = await doc.ref
        .collection("pointEntries")
        .get();
      pointEntriesCollection.forEach((doc) => {
        const data = doc.data();
        if (typeof data !== "object") return;
        if (typeof data.points !== "number") return;
        if (typeof data.opportunityId !== "string") return;
        if (typeof data.teamId !== "string") return;
        if (typeof data.linkblue !== "string") return;

        pointEntries.push({
          points: data.points,
          opportunityId: data.opportunityId,
          teamId: data.teamId,
          linkblue: data.linkblue,
          displayName: data.displayName as string,
        });
      });
    })(doc)
  )
);

// Play around with the data
interface ParsedSpiritOpportunityInfo {
  name: string;
  opportunityDate: Date;
}
type ParsedSpiritOpportunityInfoMap = Record<
  string,
  ParsedSpiritOpportunityInfo
>;

type People = Record</* linkblue*/ string, /* name*/ string | undefined>;

interface ParsedPointEntry {
  points: number;
  opportunity: string;
  person: string;
}

interface ParsedTeam {
  name: string;
  members: string[]; // linkblue
  entries: ParsedPointEntry[];
}

const parsedSpiritOpportunities: ParsedSpiritOpportunityInfoMap = {};
const people: People = {};
const teams: Record<string, ParsedTeam> = {};

spiritOpportunitiesJson.forEach((opportunity) => {
  parsedSpiritOpportunities[opportunity.id] = {
    name: opportunity.name,
    opportunityDate: opportunity.date.toDate(),
  };
});

spiritTeamsJson.forEach((team) => {
  teams[team.id] = {
    name: team.name,
    members: team.members ?? [],
    entries: [],
  };

  team.members?.forEach((member) => {
    if (people[member] === undefined) {
      people[member] = team.memberNames?.[member] ?? undefined;
    }
  });
});

const failedOpportunityLookups: SpiritPointEntryJson[] = [];

pointEntries.forEach((entry) => {
  const opportunity = parsedSpiritOpportunities[entry.opportunityId];
  if (opportunity === undefined) {
    console.error(
      `Could not find opportunity ${entry.opportunityId} for entry ${entry.linkblue}`
    );
    failedOpportunityLookups.push(entry);
    return;
  }

  const team = teams[entry.teamId];
  if (team === undefined) {
    console.error(
      `Could not find team ${entry.teamId} for entry ${entry.linkblue}`
    );
    return;
  }

  if (entry.displayName && !people[entry.linkblue]) {
    people[entry.linkblue] = entry.displayName;
  }

  team.entries.push({
    points: entry.points,
    opportunity: opportunity.name,
    person: entry.linkblue,
  });
});

const sortedByPoints = Object.entries(pointEntries).sort(
  ([, a], [, b]) => b.points - a.points
);
for (let i = 0; i < json.length; i++) {
  const entry = sortedByPoints[i];
  if (entry === undefined) {
    console.error(`Could not find entry ${i}`);
    throw new Error(`Could not find entry ${i}`);
  }
  const matchingPoint = json[i]?.points;
  if (matchingPoint === undefined) {
    console.error(`Could not find matchingPoint ${i}`);
    throw new Error(`Could not find matchingPoint ${i}`);
  }

  if (entry[1].points !== matchingPoint) {
    throw new Error(
      `Points do not match for entry ${i} - ${json[i]?.team_id}: ${entry[1].points} !== ${matchingPoint}`
    );
  }
}

// Write to postgres

console.log("Writing to postgres");

await sequelizeDb.transaction(async () => {
  // linkblue to PersonModel
  const peopleModels = Object.fromEntries(
    await Promise.all(
      [
        ...Object.entries(people)
          .filter(([linkblue]) => linkblue.length > 0)
          .map(([linkblue, name]) => {
            let parsedLinkBlue = linkblue.trim().toLowerCase();
            if (parsedLinkBlue.endsWith("@uky.edu")) {
              parsedLinkBlue = parsedLinkBlue.slice(0, -8);
            }
            if (parsedLinkBlue.includes(" ")) {
              const spaceIndex = parsedLinkBlue.indexOf(" ");
              parsedLinkBlue = parsedLinkBlue.substring(0, spaceIndex);
            }
            if (parsedLinkBlue === "") {
              throw new Error(`parsedLinkBlue is empty ${linkblue}`);
            }
            return [parsedLinkBlue, name] as const;
          })
          // Dedupe
          .reduce((acc, [linkblue, name]) => {
            if (acc.has(linkblue)) return acc;
            acc.set(linkblue, name);
            return acc;
          }, new Map<string, string | undefined>())
          .entries(),
      ].map(async ([linkblue, name]) => {
        return [
          linkblue,
          await PersonModel.create({
            linkblue,
            name: name ?? null,
            email: `${linkblue}@uky.edu`,
          }),
        ] as const;
      })
    )
  );

  // team id to TeamModel
  const teamsModels = Object.fromEntries(
    await Promise.all(
      Object.entries(teams).map(async ([id, team]) => {
        return [
          id,
          await TeamModel.create({
            name: team.name,
            type: TeamType.Spirit,
            legacyStatus: TeamLegacyStatus.ReturningTeam,
            marathonYear: "DB24",
          }),
        ] as const;
      })
    )
  );

  // opportunity id to PointOpportunityModel
  const opportunitiesModels = Object.fromEntries(
    await Promise.all(
      Object.entries(parsedSpiritOpportunities).map(
        async ([id, opportunity]) => {
          return [
            id,
            await PointOpportunityModel.create({
              name: opportunity.name,
              opportunityDate: opportunity.opportunityDate,
              type: TeamType.Spirit,
            }),
          ] as const;
        }
      )
    )
  );

  // Create the point entries
  await Promise.all(
    Object.entries(teams).map(async ([id, team]) => {
      const teamModel = teamsModels[id];
      if (teamModel === undefined) throw new Error("teamModel is undefined");
      await Promise.all(
        team.entries.map(async (entry) => {
          const linkblue = entry.person;
          let parsedLinkBlue = linkblue.trim().toLowerCase();
          if (parsedLinkBlue.endsWith("@uky.edu")) {
            parsedLinkBlue = parsedLinkBlue.slice(0, -8);
          }
          if (parsedLinkBlue.includes(" ")) {
            const spaceIndex = parsedLinkBlue.indexOf(" ");
            parsedLinkBlue = parsedLinkBlue.substring(0, spaceIndex);
          }
          await teamModel.createPointEntry({
            points: entry.points,
            comment: "Imported from old app database",
            personFromId: peopleModels[parsedLinkBlue]?.id ?? undefined,
            pointOpportunityId: opportunitiesModels[entry.opportunity]?.id,
            teamId: teamModel.id,
          });
        })
      );
    })
  );

  // Create the memberships
  await Promise.all(
    Object.entries(teams).map(async ([id, team]) => {
      const teamModel = teamsModels[id];
      if (teamModel === undefined) throw new Error("teamModel is undefined");
      await Promise.all(
        team.members.map(async (linkblue) => {
          let parsedLinkBlue = linkblue.trim().toLowerCase();
          if (parsedLinkBlue.endsWith("@uky.edu")) {
            parsedLinkBlue = parsedLinkBlue.slice(0, -8);
          }
          if (parsedLinkBlue.includes(" ")) {
            const spaceIndex = parsedLinkBlue.indexOf(" ");
            parsedLinkBlue = parsedLinkBlue.substring(0, spaceIndex);
          }
          const personModel = peopleModels[parsedLinkBlue];
          if (personModel === undefined)
            throw new Error("personModel is undefined");
          await MembershipModel.create({
            personId: personModel.id,
            teamId: teamModel.id,
            position: "Member",
          });
        })
      );
    })
  );
});
