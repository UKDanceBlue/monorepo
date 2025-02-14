import type {
  AccessLevel,
  AuthSource,
  BatchType,
  CommitteeIdentifier,
  CommitteeRole,
  DbRole,
  MembershipPositionType,
  Primitive,
  PrimitiveObject,
  SortDirection,
  TeamLegacyStatus,
  TeamType,
} from "@ukdanceblue/common";
import type { VariablesOf } from "gql.tada";
import { initGraphQLTada } from "gql.tada";

import type { introspection } from "./graphql-env";

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    LuxonDateRange: string;
    LuxonDuration: string;
    LuxonDateTime: string;
    GlobalId: string;
    NonEmptyString: string;
    NonNegativeInt: number;
    PositiveInt: number;
    LocalDate: string;
    LocalDateISO: string;
    URL: string;
    EmailAddress: string;
    DateTimeISO: string;
    AuthSource: AuthSource;
    AccessLevel: AccessLevel;
    DbRole: DbRole;
    CommitteeRole: CommitteeRole;
    CommitteeIdentifier: CommitteeIdentifier;
    // ErrorCode: ErrorCode,
    MembershipPositionType: MembershipPositionType;
    TeamLegacyStatus: TeamLegacyStatus;
    TeamType: TeamType;
    SortDirection: SortDirection;
    // Comparator: Comparator,
    // IsComparator: IsComparator,
    MarathonYear: string;
    BatchType: BatchType;
    JSONObject: Record<string, Primitive | PrimitiveObject>;
    PositiveFloat: number;
    SolicitationCodeUpsert: string;
  };
}>();

export type InputOf<Document> =
  VariablesOf<Document> extends { input: infer T } ? T : never;
