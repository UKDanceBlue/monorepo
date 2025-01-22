import { Container, Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  CrudResolver,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  isGlobalId,
  PersonNode,
} from "@ukdanceblue/common";
import {
  AssignEntryToPersonInput,
  UpdateFundraisingAssignmentInput,
} from "@ukdanceblue/common";
import {
  ConcreteResult,
  InvalidArgumentError,
} from "@ukdanceblue/common/error";
import { AsyncResult, Err } from "ts-results-es";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { WithAuditLogging } from "#lib/logging/auditLogging.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";

// TODO: Turn authorization back on for this field, currently we are only protected by the parent field
@Resolver(() => FundraisingAssignmentNode)
@Service([FundraisingEntryRepository, PersonRepository])
export class FundraisingAssignmentResolver
  implements CrudResolver<FundraisingAssignmentNode, "fundraisingAssignment">
{
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @AccessControlAuthorized<"TeamNode">(
    "get",
    (_, { entryId }) => {
      if (!isGlobalId(entryId)) {
        return Err(new InvalidArgumentError("Invalid entryId"));
      }
      return new AsyncResult(
        Container.get(FundraisingEntryRepository).getMembershipForAssignment({
          uuid: entryId.id,
        })
      ).map(
        ({ team: { uuid } }) =>
          ({
            id: uuid,
            kind: "TeamNode",
          }) as const
      );
    },
    ".fundraisingAssignments"
  )
  @Query(() => FundraisingAssignmentNode)
  async fundraisingAssignment(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FundraisingAssignmentNode>> {
    const assignment =
      await this.fundraisingEntryRepository.findAssignmentByUnique({
        uuid: id,
      });

    return assignment.toAsyncResult().map(fundraisingAssignmentModelToNode)
      .promise;
  }

  @AccessControlAuthorized<"TeamNode">(
    "create",
    (_, { entryId }) => {
      if (!isGlobalId(entryId)) {
        return Err(new InvalidArgumentError("Invalid entryId"));
      }
      return new AsyncResult(
        Container.get(FundraisingEntryRepository).getMembershipForAssignment({
          uuid: entryId.id,
        })
      ).map(
        ({ team: { uuid } }) =>
          ({
            id: uuid,
            kind: "TeamNode",
          }) as const
      );
    },
    ".fundraisingAssignments"
  )
  @Mutation(() => FundraisingAssignmentNode)
  @WithAuditLogging()
  async assignEntryToPerson(
    @Arg("entryId", () => GlobalIdScalar) { id: entryId }: GlobalId,
    @Arg("personId", () => GlobalIdScalar) { id: personId }: GlobalId,
    @Arg("input") { amount }: AssignEntryToPersonInput
  ): Promise<ConcreteResult<Promise<FundraisingAssignmentNode>>> {
    const assignment =
      await this.fundraisingEntryRepository.addAssignmentToEntry(
        { uuid: entryId },
        { uuid: personId },
        { amount }
      );

    return assignment.map(fundraisingAssignmentModelToNode);
  }

  @AccessControlAuthorized<"TeamNode">(
    "update",
    (_, { entryId }) => {
      if (!isGlobalId(entryId)) {
        return Err(new InvalidArgumentError("Invalid entryId"));
      }
      return new AsyncResult(
        Container.get(FundraisingEntryRepository).getMembershipForAssignment({
          uuid: entryId.id,
        })
      ).map(
        ({ team: { uuid } }) =>
          ({
            id: uuid,
            kind: "TeamNode",
          }) as const
      );
    },
    ".fundraisingAssignments"
  )
  @Mutation(() => FundraisingAssignmentNode)
  @WithAuditLogging()
  async updateFundraisingAssignment(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") { amount }: UpdateFundraisingAssignmentInput
  ): Promise<ConcreteResult<Promise<FundraisingAssignmentNode>>> {
    const assignment = await this.fundraisingEntryRepository.updateAssignment(
      { uuid: id },
      { amount }
    );

    return assignment.map(fundraisingAssignmentModelToNode);
  }

  @AccessControlAuthorized<"TeamNode">(
    "delete",
    (_, { entryId }) => {
      if (!isGlobalId(entryId)) {
        return Err(new InvalidArgumentError("Invalid entryId"));
      }
      return new AsyncResult(
        Container.get(FundraisingEntryRepository).getMembershipForAssignment({
          uuid: entryId.id,
        })
      ).map(
        ({ team: { uuid } }) =>
          ({
            id: uuid,
            kind: "TeamNode",
          }) as const
      );
    },
    ".fundraisingAssignments"
  )
  @Mutation(() => FundraisingAssignmentNode)
  @WithAuditLogging()
  async deleteFundraisingAssignment(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<FundraisingAssignmentNode>> {
    const assignment = new AsyncResult(
      this.fundraisingEntryRepository.deleteAssignment({
        uuid: id,
      })
    );

    return assignment.map(fundraisingAssignmentModelToNode).promise;
  }

  @FieldResolver(() => PersonNode, {
    nullable: true,
  })
  async person(
    @Root() { id: { id } }: FundraisingAssignmentNode
  ): Promise<ConcreteResult<PersonNode>> {
    const person = await this.fundraisingEntryRepository.getPersonForAssignment(
      { uuid: id }
    );
    return person
      .toAsyncResult()
      .andThen((person) => personModelToResource(person, this.personRepository))
      .promise;
  }

  @FieldResolver(() => FundraisingEntryNode)
  async entry(
    @Root() { id: { id } }: FundraisingAssignmentNode
  ): Promise<ConcreteResult<FundraisingEntryNode>> {
    const entry = await this.fundraisingEntryRepository.getEntryForAssignment({
      uuid: id,
    });
    return entry.map(fundraisingEntryModelToNode);
  }
}
