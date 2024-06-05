import {
  FundraisingAssignmentNode,
  FundraisingEntryNode,
} from "@ukdanceblue/common";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";

import { CatchableConcreteError } from "../lib/formatError.js";
import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingEntryRepository.js";
import { fundraisingAssignmentModelToNode } from "../repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "../repositories/fundraising/fundraisingEntryModelToNode.js";

@Resolver(() => FundraisingEntryNode)
@Service()
export class FundraisingEntryResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @Query(() => FundraisingEntryNode)
  async fundraisingEntry(@Arg("id") id: string): Promise<FundraisingEntryNode> {
    const entry =
      await this.fundraisingEntryRepository.findFundraisingEntryByUnique({
        uuid: id,
      });
    if (entry.isErr) {
      throw new CatchableConcreteError(entry.error);
    }
    return fundraisingEntryModelToNode(entry.value);
  }

  @FieldResolver(() => [FundraisingAssignmentNode])
  async assignments(
    @Root() entry: FundraisingEntryNode
  ): Promise<FundraisingAssignmentNode[]> {
    const assignments =
      await this.fundraisingEntryRepository.getFundraisingAssignmentsForEntry({
        uuid: entry.id,
      });
    if (assignments.isErr) {
      throw new CatchableConcreteError(assignments.error);
    }
    return Promise.all(
      assignments.value.map((assignment) =>
        fundraisingAssignmentModelToNode(assignment)
      )
    );
  }
}
