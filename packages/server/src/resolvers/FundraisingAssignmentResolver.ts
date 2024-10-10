import { FundraisingEntryRepository } from "#repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "#repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "#repositories/fundraising/fundraisingEntryModelToNode.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { globalFundraisingAccessParam } from "./accessParams.js";

import {
  QueryAccessControl,
  checkParam,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  GlobalIdScalar,
  isGlobalId,
  MembershipPositionType,
  MutationAccessControl,
  PersonNode,
  TeamType,
} from "@ukdanceblue/common";
import { ConcreteResult } from "@ukdanceblue/common/error";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Container, Service } from "@freshgum/typedi";

import type { AccessControlContext, GlobalId } from "@ukdanceblue/common";
import {
  AssignEntryToPersonInput,
  UpdateFundraisingAssignmentInput,
} from "@ukdanceblue/common";
import { Option } from "ts-results-es";

@Resolver(() => FundraisingAssignmentNode)
@Service([FundraisingEntryRepository, PersonRepository])
export class FundraisingAssignmentResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @QueryAccessControl<never, FundraisingAssignmentNode>(
    async (
      root: never,
      context: AccessControlContext,
      result: Option<FundraisingAssignmentNode>
    ): Promise<boolean | null> => {
      const globalFundraisingAccess = await checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        root,
        {},
        context
      );
      if (globalFundraisingAccess.isErr()) {
        return false;
      }
      if (globalFundraisingAccess.value) {
        return true;
      }
      const { teamMemberships } = context;

      return result.mapOr<Promise<boolean | null>>(
        Promise.resolve(false),
        async ({ id: { id: fundraisingAssignmentId } }) => {
          const fundraisingEntryRepository: FundraisingEntryRepository =
            Container.get(FundraisingEntryRepository);
          const membership =
            await fundraisingEntryRepository.getMembershipForAssignment({
              uuid: fundraisingAssignmentId,
            });
          if (membership.isErr()) {
            return false;
          }

          for (const userCaptaincy of teamMemberships) {
            if (
              userCaptaincy.teamId === membership.value.team.uuid &&
              userCaptaincy.position === MembershipPositionType.Captain
            ) {
              return true;
            }
          }
          return false;
        }
      );
    }
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

  @MutationAccessControl(async (context, args): Promise<boolean | null> => {
    const globalFundraisingAccess = await checkParam(
      globalFundraisingAccessParam,
      context.authorization,
      {},
      args,
      context
    );
    if (globalFundraisingAccess.isErr()) {
      return false;
    }
    if (globalFundraisingAccess.value) {
      return true;
    }
    const { teamMemberships } = context;

    const {
      personId: { id: personId },
    } = args as { personId: GlobalId };

    const personRepository: PersonRepository = Container.get(PersonRepository);
    const membership = await personRepository.findMembershipsOfPerson(
      { uuid: personId },
      undefined,
      [TeamType.Spirit],
      true
    );
    if (membership.isErr()) {
      return false;
    }

    for (const userCaptaincy of teamMemberships) {
      if (
        membership.value.some(
          (personMembership) =>
            personMembership.team.uuid === userCaptaincy.teamId
        ) &&
        userCaptaincy.position === MembershipPositionType.Captain
      ) {
        return true;
      }
    }
    return false;
  })
  @Mutation(() => FundraisingAssignmentNode)
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

  @MutationAccessControl(
    async (
      context,
      { id: fundraisingAssignmentId }
    ): Promise<boolean | null> => {
      const globalFundraisingAccess = await checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        {},
        {},
        context
      );
      if (globalFundraisingAccess.isErr()) {
        return false;
      }
      if (globalFundraisingAccess.value) {
        return true;
      }
      const { teamMemberships } = context;

      if (!isGlobalId(fundraisingAssignmentId)) {
        return false;
      }

      const fundraisingEntryRepository: FundraisingEntryRepository =
        Container.get(FundraisingEntryRepository);
      const membership =
        await fundraisingEntryRepository.getMembershipForAssignment({
          uuid: fundraisingAssignmentId.id,
        });
      if (membership.isErr()) {
        return false;
      }

      for (const userCaptaincy of teamMemberships) {
        if (
          userCaptaincy.teamId === membership.value.team.uuid &&
          userCaptaincy.position === MembershipPositionType.Captain
        ) {
          return true;
        }
      }
      return false;
    }
  )
  @Mutation(() => FundraisingAssignmentNode)
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

  @MutationAccessControl(
    async (
      context,
      { id: fundraisingAssignmentId }
    ): Promise<boolean | null> => {
      const globalFundraisingAccess = await checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        {},
        {},
        context
      );
      if (globalFundraisingAccess.isErr()) {
        return false;
      }
      if (globalFundraisingAccess.value) {
        return true;
      }
      const { teamMemberships } = context;

      if (!isGlobalId(fundraisingAssignmentId)) {
        return false;
      }

      const fundraisingEntryRepository: FundraisingEntryRepository =
        Container.get(FundraisingEntryRepository);
      const membership =
        await fundraisingEntryRepository.getMembershipForAssignment({
          uuid: fundraisingAssignmentId.id,
        });
      if (membership.isErr()) {
        return false;
      }

      for (const userCaptaincy of teamMemberships) {
        if (
          userCaptaincy.teamId === membership.value.team.uuid &&
          userCaptaincy.position === MembershipPositionType.Captain
        ) {
          return true;
        }
      }
      return false;
    }
  )
  @Mutation(() => FundraisingAssignmentNode)
  async deleteFundraisingAssignment(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<Promise<FundraisingAssignmentNode>>> {
    const assignment = await this.fundraisingEntryRepository.deleteAssignment({
      uuid: id,
    });

    return assignment.map(fundraisingAssignmentModelToNode);
  }

  @QueryAccessControl<never, PersonNode>(
    async (root, context, result): Promise<boolean | null> => {
      // We can't grant blanket access as otherwise people would see who else was assigned to an entry

      const globalFundraisingAccess = await checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        root,
        {},
        context
      );
      if (globalFundraisingAccess.isErr()) {
        return false;
      }
      if (globalFundraisingAccess.value) {
        return true;
      }
      const { teamMemberships } = context;

      return result.mapOr<Promise<boolean | null>>(
        Promise.resolve(false),
        async ({ id: { id } }) => {
          const personRepository = Container.get(PersonRepository);
          const memberships = await personRepository.findMembershipsOfPerson(
            { uuid: id },
            undefined,
            undefined,
            true
          );
          const userCaptaincies = teamMemberships.filter(
            (membership) =>
              membership.position === MembershipPositionType.Captain
          );
          for (const targetPersonMembership of memberships) {
            if (
              userCaptaincies.some(
                (userCaptaincy) =>
                  userCaptaincy.teamId === targetPersonMembership.team.uuid
              )
            ) {
              return true;
            }
          }
          return null;
        }
      );
    }
  )
  @FieldResolver(() => PersonNode, {
    nullable: true,
    description:
      "The person assigned to this assignment, only null when access is denied",
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

  @QueryAccessControl<never, PersonNode>(
    async (root, context, result): Promise<boolean | null> => {
      // We can't grant blanket access as otherwise people would see who else was assigned to an entry

      const globalFundraisingAccess = await checkParam(
        globalFundraisingAccessParam,
        context.authorization,
        root,
        {},
        context
      );
      if (globalFundraisingAccess.isErr()) {
        return false;
      }
      if (globalFundraisingAccess.value) {
        return true;
      }
      const { teamMemberships } = context;

      return result.mapOr<Promise<boolean | null>>(
        Promise.resolve(false),
        async ({ id: { id } }) => {
          const personRepository = Container.get(PersonRepository);
          const memberships = await personRepository.findMembershipsOfPerson(
            { uuid: id },
            undefined,
            undefined,
            true
          );
          const userCaptaincies = teamMemberships.filter(
            (membership) =>
              membership.position === MembershipPositionType.Captain
          );
          for (const targetPersonMembership of memberships) {
            if (
              userCaptaincies.some(
                (userCaptaincy) =>
                  userCaptaincy.teamId === targetPersonMembership.team.uuid
              )
            ) {
              return true;
            }
          }
          return null;
        }
      );
    }
  )
  @FieldResolver(() => FundraisingEntryNode)
  async entry(
    @Root() { id: { id } }: FundraisingAssignmentNode
  ): Promise<ConcreteResult<Promise<FundraisingEntryNode>>> {
    const entry = await this.fundraisingEntryRepository.getEntryForAssignment({
      uuid: id,
    });
    return entry.map(fundraisingEntryModelToNode);
  }
}
