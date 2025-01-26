import { Service } from "@freshgum/typedi";
import { type Prisma, PrismaClient } from "@prisma/client";
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
import {
  ConcreteResult,
  ExtendedError,
  optionOf,
} from "@ukdanceblue/common/error";
import {
  GraphQLNonEmptyString,
  GraphQLPositiveInt,
  JSONObjectResolver,
} from "graphql-scalars";
import { DateTime } from "luxon";
import { AsyncResult, None, Ok, Option, Result } from "ts-results-es";
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
import { prismaToken } from "#lib/typediTokens.js";
import { personModelToResource } from "#repositories/person/personModelToResource.js";
import { PersonRepository } from "#repositories/person/PersonRepository.js";
import { RepositoryError } from "#repositories/shared.js";

import { NodeResolver } from "./NodeResolver.js";

@ObjectType("ListAuditLogsResponse", {
  implements: AbstractGraphQLPaginatedResponse<AuditLogNode>,
})
export class ListAuditLogsResponse extends AbstractGraphQLPaginatedResponse<AuditLogNode> {
  @Field(() => [AuditLogNode])
  data!: AuditLogNode[];
}

@Resolver(() => AuditLogNode)
@Service([prismaToken, PersonRepository, NodeResolver])
export class AuditLogResolver {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly personRepository: PersonRepository,
    private readonly nodeResolver: NodeResolver
  ) {}

  @AccessControlAuthorized("read", ["every", "AuditLogNode"])
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
    @Arg("textSearch", () => GraphQLNonEmptyString, { nullable: true })
    search?: string,
    @Arg("typenameSearch", () => GraphQLNonEmptyString, { nullable: true })
    typename?: string,
    @Arg("idSearch", () => GraphQLNonEmptyString, { nullable: true })
    id?: string
  ): Promise<ListAuditLogsResponse> {
    const where: Prisma.AuditLogWhereInput[] = [];
    if (search)
      where.push({
        OR: [
          { summary: { contains: search } },
          ...[
            "name",
            "title",
            "comment",
            "key",
            "value",
            "year",
            "combinedDonorName",
            "donatedToOverride",
            "donatedByOverride",
            "notes",
          ].map((field) => ({
            details: { path: ["input", field], string_contains: search },
          })),
        ],
      });
    if (typename)
      where.push({
        details: {
          path: ["id", "typename"],
          string_contains: typename,
        },
      });
    if (id)
      where.push({
        details: {
          path: ["id", "id"],
          string_contains: id,
        },
      });

    const logs = await this.prisma.auditLog.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: {
        AND: where,
      },
      orderBy: { createdAt: "desc" },
    });
    const total = await this.prisma.auditLog.count({
      where: {
        AND: where,
      },
    });

    return ListAuditLogsResponse.newPaginated({
      data: logs.map((log) =>
        AuditLogNode.init({
          id: log.uuid,
          summary: log.summary,
          details: (typeof log.details !== "object"
            ? { val: log.details }
            : log.details) as PrimitiveObject | null,
          createdAt: DateTime.fromJSDate(log.createdAt),
          userId: log.userId,
          subjectGlobalId: log.subjectGlobalId,
        })
      ),
      total,
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

  @AccessControlAuthorized("read", "all")
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
      return await new AsyncResult(
        this.nodeResolver.node(globalId.value, ctx)
      ).or<ExtendedError>(Ok(None)).promise;
    } catch {
      return Ok(None);
    }
  }

  @AccessControlAuthorized("read", "all")
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
