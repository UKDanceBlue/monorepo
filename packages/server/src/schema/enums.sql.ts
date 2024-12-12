import { danceblue } from "#schema/core.sql.js";

export const authSource = danceblue.enum("AuthSource", [
  "LinkBlue",
  "Anonymous",
  "Demo",
  "Password",
]);
export const batchType = danceblue.enum("BatchType", [
  "DBFunds",
  "Check",
  "Transmittal",
  "CreditCard",
  "ACH",
  "NonCash",
  "PayrollDeduction",
  "Unknown",
]);
export const committeeName = danceblue.enum("CommitteeName", [
  "programmingCommittee",
  "fundraisingCommittee",
  "communityDevelopmentCommittee",
  "dancerRelationsCommittee",
  "familyRelationsCommittee",
  "techCommittee",
  "operationsCommittee",
  "marketingCommittee",
  "corporateCommittee",
  "miniMarathonsCommittee",
  "viceCommittee",
  "overallCommittee",
]);
export const committeeRole = danceblue.enum("CommitteeRole", [
  "Chair",
  "Coordinator",
  "Member",
]);
export const membershipPosition = danceblue.enum("MembershipPosition", [
  "Member",
  "Captain",
]);
export const notificationError = danceblue.enum("NotificationError", [
  "DeviceNotRegistered",
  "InvalidCredentials",
  "MessageTooBig",
  "MessageRateExceeded",
  "MismatchSenderId",
  "Unknown",
]);
export const pointOpportunityType = danceblue.enum("PointOpportunityType", [
  "Spirit",
  "Morale",
  "Committee",
]);
export const teamLegacyStatus = danceblue.enum("TeamLegacyStatus", [
  "NewTeam",
  "ReturningTeam",
  "DemoTeam",
]);
export const teamType = danceblue.enum("TeamType", [
  "Spirit",
  "Morale",
  "Mini",
]);
