import { Service } from "@freshgum/typedi";
import {
  AbstractGraphQLPaginatedResponse,
  AccessControlAuthorized,
  AuditLogNode,
  DEFAULT_PAGE_SIZE,
  FIRST_PAGE,
  Node,
  parseGlobalId,
  PersonNode,
  PrimitiveObject,
} from "@ukdanceblue/common";
import { ConcreteResult, optionOf } from "@ukdanceblue/common/error";
import {
  GraphQLNonEmptyString,
  GraphQLPositiveInt,
  JSONObjectResolver,
} from "graphql-scalars";
import { None, Ok, Option, Result } from "ts-results-es";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import type { GraphQLContext } from "#auth/context.js";
import { drizzleToken } from "#lib/typediTokens.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { RepositoryError } from "#repositories/shared.js";

import { NodeResolver } from "./NodeResolver.js";

@ObjectType("ListAuditLogsResponse", {
  implements: AbstractGraphQLPaginatedResponse<AuditLogNode>,
})
export class ListAuditLogsResponse extends AbstractGraphQLPaginatedResponse<AuditLogNode> {
  @Field(() => AuditLogNode)
  data!: AuditLogNode[];
}

@Resolver(() => AuditLogNode)
@Service([drizzleToken, PersonRepository, NodeResolver])
export class AuditLogResolver {
  constructor(
    protected readonly db: Drizzle,
    private readonly personRepository: PersonRepository,
    private readonly nodeResolver: NodeResolver
  ) {}

  @AccessControlAuthorized("read", "AuditLogNode")
  @Query(() => ListAuditLogsResponse, {
    name: "auditLogs",
    description: "Get a list of audit logs",
  })
  async auditLogs(
    @Arg("page", () => GraphQLPositiveInt, {
      nullable: true,
      defaultValue: FIRST_PAGE,
    })
    page: number,
    @Arg("pageSize", () => GraphQLPositiveInt, {
      nullable: true,
      defaultValue: DEFAULT_PAGE_SIZE,
    })
    pageSize: number,
    @Arg("search", () => GraphQLNonEmptyString, { nullable: true })
    search?: string
  ): Promise<ListAuditLogsResponse> {
    const logs = await this.prisma.auditLog.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: search
        ? {
            OR: [
              { summary: { contains: search } },
              { details: { string_contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });
    const total = await this.prisma.auditLog.count({
      where: search
        ? {
            OR: [
              { summary: { contains: search } },
              { details: { string_contains: search } },
            ],
          }
        : undefined,
    });

    return ListAuditLogsResponse.newPaginated({
      data: logs.map((log) =>
        AuditLogNode.init({
          id: log.uuid,
          summary: log.summary,
          details: (typeof log.details !== "object"
            ? { val: log.details }
            : log.details) as PrimitiveObject | null,
          createdAt: log.createdAt,
          userId: log.userId,
          subjectGlobalId: log.subjectGlobalId,
        })
      ),
      total,
      page,
      pageSize,
    });
  }

  @FieldResolver(() => PersonNode, { nullable: true })
  async user(
    @Root() log: AuditLogNode
  ): Promise<Result<PersonNode | null, RepositoryError>> {
    if (!log.userId) {
      return Ok(null);
    }

    const user = await this.prisma.person.findUnique({
      where: { id: log.userId },
    });

    if (!user) {
      return Ok(null);
    }

    return personModelToResource(user, this.personRepository).promise;
  }

  @AccessControlAuthorized("read", "Node")
  @FieldResolver(() => Node, { nullable: true })
  async subject(
    @Root() log: AuditLogNode,
    @Ctx() ctx: GraphQLContext
  ): Promise<ConcreteResult<Node | Option<Node>>> {
    if (!log.subjectGlobalId) {
      return Ok(None);
    }

    const globalId = parseGlobalId(log.subjectGlobalId);

    if (globalId.isErr()) {
      return globalId;
    }

    try {
      return await this.nodeResolver.node(globalId.value, ctx);
    } catch {
      return Ok(None);
    }
  }

  @AccessControlAuthorized("read", "Node")
  @FieldResolver(() => JSONObjectResolver, { nullable: true })
  async subjectJson(
    @Root() log: AuditLogNode,
    @Ctx() ctx: GraphQLContext
  ): Promise<ConcreteResult<object | Option<object>>> {
    const subject = await this.subject(log, ctx);

    return subject.map((subject) =>
      optionOf(subject).map(JSON.stringify).map(JSON.parse)
    );
  }
}
