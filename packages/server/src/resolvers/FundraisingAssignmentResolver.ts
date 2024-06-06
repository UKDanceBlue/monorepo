import { FundraisingAssignmentNode, PersonNode } from "@ukdanceblue/common";
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
import { Service } from "typedi";

import { CatchableConcreteError } from "../lib/formatError.js";
import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "../repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { PersonRepository } from "../repositories/person/PersonRepository.js";
import { personModelToResource } from "../repositories/person/personModelToResource.js";

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

@Resolver(() => FundraisingAssignmentNode)
@Service()
export class FundraisingAssignmentResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository,
    private readonly personRepository: PersonRepository
  ) {}

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

  @FieldResolver(() => PersonNode)
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
}
