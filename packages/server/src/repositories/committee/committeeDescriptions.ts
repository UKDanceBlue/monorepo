import type { Prisma } from "@prisma/client";
import {
  CommitteeIdentifier,
  committeeNames,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";

const DEFAULT_MARATHON_YEAR = "DB24";

const createCommittee = (
  identifier: CommitteeIdentifier,
  parentIdentifier?: CommitteeIdentifier
) => {
  const committee = {
    create: {
      identifier,
      parentCommittee: parentIdentifier
        ? {
            connect: {
              identifier: parentIdentifier,
            },
          }
        : undefined,
      correspondingTeams: {
        create: [
          {
            name: committeeNames[identifier],
            marathon: {
              connectOrCreate: {
                create: {
                  year: DEFAULT_MARATHON_YEAR,
                },
                where: {
                  year: DEFAULT_MARATHON_YEAR,
                },
              },
            },
            legacyStatus: TeamLegacyStatus.ReturningTeam,
            type: TeamType.Spirit,
          },
        ],
      },
    },
    update: {
      parentCommittee: parentIdentifier
        ? {
            connect: {
              identifier: parentIdentifier,
            },
          }
        : undefined,
    },
    where: {
      identifier,
    },
  } satisfies Prisma.CommitteeUpsertWithoutChildCommitteesInput;

  return committee;
};

export const overallCommittee = createCommittee(
  CommitteeIdentifier.overallCommittee
);
export const viceCommittee = createCommittee(
  CommitteeIdentifier.viceCommittee,
  CommitteeIdentifier.overallCommittee
);
export const fundraisingCommittee = createCommittee(
  CommitteeIdentifier.fundraisingCommittee,
  CommitteeIdentifier.viceCommittee
);
export const dancerRelationsCommittee = createCommittee(
  CommitteeIdentifier.dancerRelationsCommittee,
  CommitteeIdentifier.viceCommittee
);
export const marketingCommittee = createCommittee(
  CommitteeIdentifier.marketingCommittee,
  CommitteeIdentifier.overallCommittee
);
export const corporateCommittee = createCommittee(
  CommitteeIdentifier.corporateCommittee,
  CommitteeIdentifier.overallCommittee
);
export const techCommittee = createCommittee(
  CommitteeIdentifier.techCommittee,
  CommitteeIdentifier.overallCommittee
);
export const operationsCommittee = createCommittee(
  CommitteeIdentifier.operationsCommittee,
  CommitteeIdentifier.overallCommittee
);
export const miniMarathonsCommittee = createCommittee(
  CommitteeIdentifier.miniMarathonsCommittee,
  CommitteeIdentifier.overallCommittee
);
export const communityDevelopmentCommittee = createCommittee(
  CommitteeIdentifier.communityDevelopmentCommittee,
  CommitteeIdentifier.overallCommittee
);
export const familyRelationsCommittee = createCommittee(
  CommitteeIdentifier.familyRelationsCommittee,
  CommitteeIdentifier.overallCommittee
);
export const programmingCommittee = createCommittee(
  CommitteeIdentifier.programmingCommittee,
  CommitteeIdentifier.overallCommittee
);
