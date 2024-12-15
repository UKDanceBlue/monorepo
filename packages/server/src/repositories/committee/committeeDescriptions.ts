import { CommitteeIdentifier } from "@ukdanceblue/common";

export interface CommitteeDescription {
  identifier: CommitteeIdentifier;
  parentIdentifier?: CommitteeIdentifier;
}

export const overallCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.overallCommittee,
};

export const viceCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.viceCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const fundraisingCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.fundraisingCommittee,
  parentIdentifier: CommitteeIdentifier.viceCommittee,
};

export const dancerRelationsCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.dancerRelationsCommittee,
  parentIdentifier: CommitteeIdentifier.viceCommittee,
};

export const marketingCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.marketingCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const corporateCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.corporateCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const techCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.techCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const operationsCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.operationsCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const miniMarathonsCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.miniMarathonsCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const communityDevelopmentCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.communityDevelopmentCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const familyRelationsCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.familyRelationsCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};

export const programmingCommittee: CommitteeDescription = {
  identifier: CommitteeIdentifier.programmingCommittee,
  parentIdentifier: CommitteeIdentifier.overallCommittee,
};
