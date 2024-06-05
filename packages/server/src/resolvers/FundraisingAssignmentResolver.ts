import {
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  PersonNode,
} from "@ukdanceblue/common";
import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingEntryRepository.js";

@Resolver(() => FundraisingAssignmentNode)
@Service()
export class FundraisingAssignmentResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @Query(() => FundraisingAssignmentNode)
  async fundraisingAssignment(
    @Arg("id") id: string
  ): Promise<FundraisingAssignmentNode> {}

  @Mutation(() => FundraisingAssignmentNode)
  async createFundraisingAssignment(
    @Arg("input") input: CreateFundraisingAssignmentInput
  ): Promise<FundraisingAssignmentNode> {
    // TODO
  }

  @Mutation(() => FundraisingAssignmentNode)
  async updateFundraisingAssignment(
    @Arg("id") id: string,
    @Arg("input") input: UpdateFundraisingAssignmentInput
  ): Promise<FundraisingAssignmentNode> {
    // TODO
  }

  @Mutation(() => FundraisingAssignmentNode)
  async deleteFundraisingAssignment(
    @Arg("id") id: string
  ): Promise<FundraisingAssignmentNode> {
    // TODO
  }

  @FieldResolver(() => FundraisingEntryNode)
  async entry(
    @Root() assignment: FundraisingAssignmentNode
  ): Promise<FundraisingEntryNode> {
    // TODO
  }

  @FieldResolver(() => PersonNode)
  async person(
    @Root() assignment: FundraisingAssignmentNode
  ): Promise<PersonNode> {
    // TODO
  }
}
