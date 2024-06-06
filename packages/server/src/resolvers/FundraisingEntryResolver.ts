import {
  FilteredListQueryArgs,
  FundraisingAssignmentNode,
  FundraisingEntryNode,
  SortDirection,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";

import { CatchableConcreteError } from "../lib/formatError.js";
import { FundraisingEntryRepository } from "../repositories/fundraising/FundraisingRepository.js";
import { fundraisingAssignmentModelToNode } from "../repositories/fundraising/fundraisingAssignmentModelToNode.js";
import { fundraisingEntryModelToNode } from "../repositories/fundraising/fundraisingEntryModelToNode.js";

import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@ArgsType()
class ListFundraisingEntriesArgs extends FilteredListQueryArgs<
  | "donatedOn"
  | "amount"
  | "donatedTo"
  | "donatedBy"
  | "teamId"
  | "createdAt"
  | "updatedAt",
  "donatedTo" | "donatedBy",
  "teamId",
  "amount",
  "donatedOn" | "createdAt" | "updatedAt",
  never
>("FundraisingEntryResolver", {
  all: [
    "donatedOn",
    "amount",
    "donatedTo",
    "donatedBy",
    "createdAt",
    "updatedAt",
  ],
  string: ["donatedTo", "donatedBy"],
  numeric: ["amount"],
  oneOf: ["teamId"],
  date: ["donatedOn", "createdAt", "updatedAt"],
}) {}

@ObjectType("ListFundraisingEntriesResponse", {
  implements: AbstractGraphQLPaginatedResponse<FundraisingEntryNode[]>,
})
class ListFundraisingEntriesResponse extends AbstractGraphQLPaginatedResponse<FundraisingEntryNode> {
  @Field(() => [FundraisingEntryNode])
  data!: FundraisingEntryNode[];
}

@Resolver(() => FundraisingEntryNode)
@Service()
export class FundraisingEntryResolver {
  constructor(
    private readonly fundraisingEntryRepository: FundraisingEntryRepository
  ) {}

  @Query(() => FundraisingEntryNode)
  async fundraisingEntry(@Arg("id") id: string): Promise<FundraisingEntryNode> {
    const entry = await this.fundraisingEntryRepository.findEntryByUnique({
      uuid: id,
    });
    if (entry.isErr) {
      throw new CatchableConcreteError(entry.error);
    }
    return fundraisingEntryModelToNode(entry.value);
  }

  @Query(() => ListFundraisingEntriesResponse)
  async fundraisingEntries(
    @Args(() => ListFundraisingEntriesArgs) args: ListFundraisingEntriesArgs
  ): Promise<ListFundraisingEntriesResponse> {
    const entries = await this.fundraisingEntryRepository.listEntries({
      filters: args.filters,
      order:
        args.sortBy?.map((key, i) => [
          key,
          args.sortDirection?.[i] ?? SortDirection.desc,
        ]) ?? [],
      skip:
        args.page != null && args.pageSize != null
          ? (args.page - 1) * args.pageSize
          : null,
      take: args.pageSize,
    });
    const count = await this.fundraisingEntryRepository.countEntries({
      filters: args.filters,
    });

    if (entries.isErr) {
      throw new CatchableConcreteError(entries.error);
    }
    if (count.isErr) {
      throw new CatchableConcreteError(count.error);
    }

    return ListFundraisingEntriesResponse.newPaginated({
      data: await Promise.all(
        entries.value.map((model) => fundraisingEntryModelToNode(model))
      ),
      total: count.value,
      page: args.page,
      pageSize: args.pageSize,
    });
  }
  @FieldResolver(() => [FundraisingAssignmentNode])
  async assignments(
    @Root() entry: FundraisingEntryNode
  ): Promise<FundraisingAssignmentNode[]> {
    const assignments =
      await this.fundraisingEntryRepository.getAssignmentsForEntry({
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
