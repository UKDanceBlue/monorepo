import { Service } from "@freshgum/typedi";
import type { CrudResolver, GlobalId } from "@ukdanceblue/common";
import {
  AccessControlAuthorized,
  DailyDepartmentNotificationBatchNode,
  DailyDepartmentNotificationNode,
  GlobalIdScalar,
} from "@ukdanceblue/common";
import {
  DailyDepartmentNotificationInput,
  ListDailyDepartmentNotificationsArgs,
  ListDailyDepartmentNotificationsResponse,
} from "@ukdanceblue/common";
import { ConcreteError, ConcreteResult } from "@ukdanceblue/common/error";
import { AsyncResult, Option, Result } from "ts-results-es";
import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import {
  dailyDepartmentNotificationBatchModelToResource,
  dailyDepartmentNotificationModelToResource,
} from "#repositories/dailyDepartmentNotification/ddnModelToResource.js";
import { DailyDepartmentNotificationRepository } from "#repositories/dailyDepartmentNotification/DDNRepository.js";

import type { GraphQLContext } from "../lib/auth/context.js";

@Resolver(() => DailyDepartmentNotificationNode)
@Service([DailyDepartmentNotificationRepository])
export class DailyDepartmentNotificationResolver
  implements
    CrudResolver<DailyDepartmentNotificationNode, "dailyDepartmentNotification">
{
  constructor(
    private readonly dailyDepartmentNotificationRepository: DailyDepartmentNotificationRepository
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => DailyDepartmentNotificationNode)
  async dailyDepartmentNotification(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<Option<DailyDepartmentNotificationNode>>> {
    const dailyDepartmentNotification =
      await this.dailyDepartmentNotificationRepository.findDDNByUnique({
        uuid: id,
      });
    return dailyDepartmentNotification.map((dailyDepartmentNotification) =>
      dailyDepartmentNotification.map(
        dailyDepartmentNotificationModelToResource
      )
    );
  }

  @AccessControlAuthorized("list", "DailyDepartmentNotificationNode")
  @Query(() => ListDailyDepartmentNotificationsResponse)
  dailyDepartmentNotifications(
    @Args() query: ListDailyDepartmentNotificationsArgs
  ) {
    return this.dailyDepartmentNotificationRepository
      .findAndCount({
        filters: query.filters,
        sortBy: query.sortBy,
        offset: query.offset,
        limit: query.limit,
      })
      .map(({ selectedRows, total }) => {
        return ListDailyDepartmentNotificationsResponse.newPaginated({
          data: selectedRows.map((row) =>
            dailyDepartmentNotificationModelToResource(row)
          ),
          total,
        });
      });
  }

  @AccessControlAuthorized("create")
  @Mutation(() => DailyDepartmentNotificationNode)
  async createDailyDepartmentNotification(
    @Ctx() { authenticatedUser }: GraphQLContext,
    @Arg("input") input: DailyDepartmentNotificationInput
  ) {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.createDDN(input, {
        enteredBy: authenticatedUser?.id
          ? { uuid: authenticatedUser.id.id }
          : null,
      })
    ).map(dailyDepartmentNotificationModelToResource).promise;
  }

  @AccessControlAuthorized("update")
  @Mutation(() => DailyDepartmentNotificationNode)
  async setDailyDepartmentNotification(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: DailyDepartmentNotificationInput
  ): Promise<ConcreteResult<DailyDepartmentNotificationNode>> {
    const dailyDepartmentNotification =
      await this.dailyDepartmentNotificationRepository.updateDDN(
        { uuid: id },
        input
      );
    return dailyDepartmentNotification.map(
      dailyDepartmentNotificationModelToResource
    );
  }

  @AccessControlAuthorized("create")
  @Mutation(() => [DailyDepartmentNotificationNode])
  async batchUploadDailyDepartmentNotifications(
    @Ctx() { authenticatedUser }: GraphQLContext,
    @Arg("input", () => [DailyDepartmentNotificationInput])
    input: DailyDepartmentNotificationInput[]
  ) {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.batchLoadDDNs(input, {
        enteredBy: authenticatedUser?.id
          ? { uuid: authenticatedUser.id.id }
          : null,
      })
    ).map((dailyDepartmentNotifications) =>
      dailyDepartmentNotifications.map(
        dailyDepartmentNotificationModelToResource
      )
    ).promise;
  }

  @AccessControlAuthorized("delete")
  @Mutation(() => DailyDepartmentNotificationNode)
  async deleteDailyDepartmentNotification(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ) {
    const dailyDepartmentNotification =
      await this.dailyDepartmentNotificationRepository.deleteDDN({
        uuid: id,
      });
    return dailyDepartmentNotification.map(
      dailyDepartmentNotificationModelToResource
    );
  }

  @FieldResolver(() => DailyDepartmentNotificationBatchNode)
  async batch(
    @Root() dailyDepartmentNotification: DailyDepartmentNotificationNode
  ): Promise<Result<DailyDepartmentNotificationBatchNode, ConcreteError>> {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.findBatchForDDN({
        uuid: dailyDepartmentNotification.id.id,
      })
    ).map(dailyDepartmentNotificationBatchModelToResource).promise;
  }
}

@Resolver(() => DailyDepartmentNotificationBatchNode)
@Service([DailyDepartmentNotificationRepository])
export class DailyDepartmentNotificationBatchResolver {
  constructor(
    private readonly dailyDepartmentNotificationRepository: DailyDepartmentNotificationRepository
  ) {}

  @AccessControlAuthorized("get")
  @Query(() => DailyDepartmentNotificationBatchNode)
  async dailyDepartmentNotificationBatch(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<DailyDepartmentNotificationBatchNode>> {
    const dailyDepartmentNotificationBatch =
      await this.dailyDepartmentNotificationRepository.findBatchByUnique({
        uuid: id,
      });
    return dailyDepartmentNotificationBatch.map(
      dailyDepartmentNotificationBatchModelToResource
    );
  }

  @AccessControlAuthorized("list", "DailyDepartmentNotificationBatchNode")
  @Mutation(() => DailyDepartmentNotificationBatchNode)
  async deleteDailyDepartmentNotificationBatch(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ) {
    const dailyDepartmentNotificationBatch =
      await this.dailyDepartmentNotificationRepository.deleteDDNBatch({
        uuid: id,
      });
    return dailyDepartmentNotificationBatch.map(
      (dailyDepartmentNotificationBatch) =>
        dailyDepartmentNotificationBatch.map(
          dailyDepartmentNotificationBatchModelToResource
        )
    );
  }

  @FieldResolver(() => [DailyDepartmentNotificationNode])
  async dailyDepartmentNotifications(
    @Root()
    dailyDepartmentNotificationBatch: DailyDepartmentNotificationBatchNode
  ): Promise<Result<DailyDepartmentNotificationNode[], ConcreteError>> {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.findDDNsByBatch({
        uuid: dailyDepartmentNotificationBatch.id.id,
      })
    ).map((dailyDepartmentNotifications) =>
      dailyDepartmentNotifications.map(
        dailyDepartmentNotificationModelToResource
      )
    ).promise;
  }
}
