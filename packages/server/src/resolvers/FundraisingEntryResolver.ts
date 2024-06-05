import {
  FundraisingAssignmentNode,
  FundraisingEntryNode,
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

@Resolver(() => FundraisingEntryNode)
@Service()
export class FundraisingEntryResolver {
  constructor(private readonly fundraisingRepository: FundraisingRepository) {}

  @Query(() => FundraisingEntryNode)
  async fundraisingEntry(@Arg("id") id: string): Promise<FundraisingEntryNode> {
    // TODO
  }

  @Mutation(() => FundraisingEntryNode)
  async createFundraisingEntry(
    @Arg("input") input: CreateFundraisingEntryInput,
    @Arg("teamId") teamId: string
  ): Promise<FundraisingEntryNode> {
    // TODO
  }

  @Mutation(() => FundraisingEntryNode)
  async updateFundraisingEntry(
    @Arg("id") id: string,
    @Arg("input") input: UpdateFundraisingEntryInput
  ): Promise<FundraisingEntryNode> {
    // TODO
  }

  @Mutation(() => FundraisingEntryNode)
  async deleteFundraisingEntry(
    @Arg("id") id: string
  ): Promise<FundraisingEntryNode> {
    // TODO
  }

  @FieldResolver(() => [FundraisingAssignmentNode])
  async assignments(
    @Root() entry: FundraisingEntryNode
  ): Promise<FundraisingAssignmentNode[]> {
    // TODO
  }
}
