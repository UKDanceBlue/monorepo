import {
  AccessControl,
  AccessControlParam,
  CommitteeIdentifier,
  CommitteeRole,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  MembershipPositionType,
  PersonNode,
} from "@ukdanceblue/common";
import {
  Arg,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Container, Service } from "typedi";

import { CatchableConcreteError } from "../lib/formatError.js";
import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "../repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "../repositories/fundraising/fundraisingEntryModelToNode.js";
import { PersonRepository } from "../repositories/person/PersonRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";

import { globalFundraisingAccessParam } from "./FundraisingEntryResolver.js";

@InputType()
class AssignEntryToPersonInput {
  @Field()
  amount!: number;
}

@InputType()
class UpdateFundraisingAssignmentInput {
  @Field()
  amount!: number;
}

const fundraisingAccess: AccessControlParam<FundraisingAssignmentNode> = {
  authRules: [
    {
      minCommitteeRole: CommitteeRole.Coordinator,
      committeeIdentifiers: [CommitteeIdentifier.fundraisingCommittee],
    },
  ],
};

@Resolver(() => FundraisingAssignmentNode)
@Service()
export class FundraisingAssignmentResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

  @AccessControl(fundraisingAccess)
  @Query(() => FundraisingAssignmentNode)
  async fundraisingAssignment(
    @Arg("id") id: string
  ): Promise<FundraisingAssignmentNode> {
    const assignment =
      await this.fundraisingEntryRepository.findAssignmentByUnique({
        uuid: id,
      });

    if (assignment.isErr) {
      throw new CatchableConcreteError(assignment.error);
    }

    return fundraisingAssignmentModelToNode(assignment.value);
  }

  @AccessControl(fundraisingAccess)
  @Mutation(() => FundraisingAssignmentNode)
  async assignEntryToPerson(
    @Arg("entryId") entryId: string,
    @Arg("personId") personId: string,
    @Arg("input") { amount }: AssignEntryToPersonInput
  ): Promise<FundraisingAssignmentNode> {
    const assignment =
      await this.fundraisingEntryRepository.addAssignmentToEntry(
        { uuid: entryId },
        { uuid: personId },
        { amount }
      );

    if (assignment.isErr) {
      throw new CatchableConcreteError(assignment.error);
    }

    return fundraisingAssignmentModelToNode(assignment.value);
  }

  @AccessControl(fundraisingAccess)
  @Mutation(() => FundraisingAssignmentNode)
  async updateFundraisingAssignment(
    @Arg("id") id: string,
    @Arg("input") { amount }: UpdateFundraisingAssignmentInput
  ): Promise<FundraisingAssignmentNode> {
    const assignment = await this.fundraisingEntryRepository.updateAssignment(
      { uuid: id },
      { amount }
    );

    if (assignment.isErr) {
      throw new CatchableConcreteError(assignment.error);
    }

    return fundraisingAssignmentModelToNode(assignment.value);
  }

  @AccessControl(fundraisingAccess)
  @Mutation(() => FundraisingAssignmentNode)
  async deleteFundraisingAssignment(
    @Arg("id") id: string
  ): Promise<FundraisingAssignmentNode> {
    const assignment = await this.fundraisingEntryRepository.deleteAssignment({
      uuid: id,
    });

    if (assignment.isErr) {
      throw new CatchableConcreteError(assignment.error);
    }

    return fundraisingAssignmentModelToNode(assignment.value);
  }

  @AccessControl<never, PersonNode>(globalFundraisingAccessParam, {
    custom: async (_, { teamMemberships }, { id }) => {
      const personRepository = Container.get(PersonRepository);
      const memberships =
        (await personRepository.findMembershipsOfPerson(
          { uuid: id },
          undefined,
          undefined,
          true
        )) ?? [];
      const userCaptaincies = teamMemberships.filter(
        (membership) => membership.position === MembershipPositionType.Captain
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
    },
  })
  @FieldResolver(() => PersonNode, {
    nullable: true,
    description:
      "The person assigned to this assignment, only null when access is denied",
  })
  async person(
    @Root() assignment: FundraisingAssignmentNode
  ): Promise<PersonNode> {
    const person = await this.fundraisingEntryRepository.getPersonForAssignment(
      { uuid: assignment.id }
    );
    if (person.isErr) {
      throw new CatchableConcreteError(person.error);
    }
    return personModelToResource(person.value, this.personRepository);
  }

  @FieldResolver(() => FundraisingEntryNode)
  async entry(
    @Root() assignment: FundraisingAssignmentNode
  ): Promise<FundraisingEntryNode> {
    const entry = await this.fundraisingEntryRepository.getEntryForAssignment({
      uuid: assignment.id,
    });
    if (entry.isErr) {
      throw new CatchableConcreteError(entry.error);
    }
    return fundraisingEntryModelToNode(entry.value);
  }
}
