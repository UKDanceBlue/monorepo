import { Service } from "@freshgum/typedi";
import type { GlobalId } from "@ukdanceblue/common";
import {
  AccessLevel,
  DailyDepartmentNotificationBatchNode,
  DailyDepartmentNotificationNode,
  fundraisingAccess,
  GlobalIdScalar,
  MutationAccessControl,
  QueryAccessControl,
  SortDirection,
} from "@ukdanceblue/common";
import {
  DailyDepartmentNotificationInput,
  ListDailyDepartmentNotificationsArgs,
  ListDailyDepartmentNotificationsResponse,
} from "@ukdanceblue/common";
import { ConcreteError, ConcreteResult } from "@ukdanceblue/common/error";
import { AsyncResult, Ok, Result } from "ts-results-es";
import {
  Arg,
  Args,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import {
  dailyDepartmentNotificationBatchModelToResource,
  dailyDepartmentNotificationModelToResource,
} from "@/repositories/dailyDepartmentNotification/ddnModelToResource.js";
import { DailyDepartmentNotificationRepository } from "@/repositories/dailyDepartmentNotification/DDNRepository.js";

@Resolver(() => DailyDepartmentNotificationNode)
@Service([DailyDepartmentNotificationRepository])
export class DailyDepartmentNotificationResolver {
  constructor(
    private readonly dailyDepartmentNotificationRepository: DailyDepartmentNotificationRepository
  ) {}

  @QueryAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Query(() => DailyDepartmentNotificationNode)
  async dailyDepartmentNotification(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<DailyDepartmentNotificationNode>> {
    const dailyDepartmentNotification =
      await this.dailyDepartmentNotificationRepository.findDDNByUnique({
        idSorter: id,
      });
    return dailyDepartmentNotification.map(
      dailyDepartmentNotificationModelToResource
    );
  }

  @QueryAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Query(() => ListDailyDepartmentNotificationsResponse)
  async dailyDepartmentNotifications(
    @Args() args: ListDailyDepartmentNotificationsArgs
  ): Promise<ConcreteResult<ListDailyDepartmentNotificationsResponse>> {
    const dailyDepartmentNotificationsResult =
      await this.dailyDepartmentNotificationRepository.listDDNs({
        filters: args.filters,
        order:
          args.sortBy?.map((key, i) => [
            key,
            args.sortDirection?.[i] ?? SortDirection.desc,
          ]) ?? [],
        skip:
          args.page != null && args.actualPageSize != null
            ? (args.page - 1) * args.actualPageSize
            : null,
        take: args.actualPageSize,
      });
    const dailyDepartmentNotificationCountResult =
      await this.dailyDepartmentNotificationRepository.countDDNs({
        filters: args.filters,
      });
    const combinedResult = Result.all([
      dailyDepartmentNotificationsResult,
      dailyDepartmentNotificationCountResult,
    ]);
    if (combinedResult.isErr()) {
      return combinedResult;
    }
    const [dailyDepartmentNotifications, dailyDepartmentNotificationCount] =
      combinedResult.value;

    return Ok(
      ListDailyDepartmentNotificationsResponse.newPaginated({
        data: dailyDepartmentNotifications.map(
          dailyDepartmentNotificationModelToResource
        ),
        total: dailyDepartmentNotificationCount,
        page: args.page,
        pageSize: args.actualPageSize,
      })
    );
  }

  @MutationAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Mutation(() => DailyDepartmentNotificationNode)
  async createDailyDepartmentNotification(
    @Arg("input") input: DailyDepartmentNotificationInput
  ) {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.createDDN(input)
    ).map(dailyDepartmentNotificationModelToResource).promise;
  }

  @MutationAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Mutation(() => DailyDepartmentNotificationNode)
  async setDailyDepartmentNotification(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId,
    @Arg("input") input: DailyDepartmentNotificationInput
  ) {
    const dailyDepartmentNotification =
      await this.dailyDepartmentNotificationRepository.updateDDN(
        { idSorter: id },
        input
      );
    return dailyDepartmentNotification.map((dailyDepartmentNotification) =>
      dailyDepartmentNotification.map(
        dailyDepartmentNotificationModelToResource
      )
    );
  }

  @MutationAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Mutation(() => [DailyDepartmentNotificationNode])
  async batchUploadDailyDepartmentNotifications(
    @Arg("input", () => [DailyDepartmentNotificationInput])
    input: DailyDepartmentNotificationInput[]
  ) {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.batchLoadDDNs(input)
    ).map((dailyDepartmentNotifications) =>
      dailyDepartmentNotifications.map(
        dailyDepartmentNotificationModelToResource
      )
    ).promise;
  }

  @MutationAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Mutation(() => DailyDepartmentNotificationNode)
  async deleteDailyDepartmentNotification(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ) {
    const dailyDepartmentNotification =
      await this.dailyDepartmentNotificationRepository.deleteDDN({
        idSorter: id,
      });
    return dailyDepartmentNotification.map((dailyDepartmentNotification) =>
      dailyDepartmentNotification.map(
        dailyDepartmentNotificationModelToResource
      )
    );
  }

  @FieldResolver(() => DailyDepartmentNotificationBatchNode)
  async batch(
    @Root() dailyDepartmentNotification: DailyDepartmentNotificationNode
  ): Promise<Result<DailyDepartmentNotificationBatchNode, ConcreteError>> {
    return new AsyncResult(
      this.dailyDepartmentNotificationRepository.findBatchForDDN({
        idSorter: dailyDepartmentNotification.id.id,
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

  @QueryAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Query(() => DailyDepartmentNotificationBatchNode)
  async dailyDepartmentNotificationBatch(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ): Promise<ConcreteResult<DailyDepartmentNotificationBatchNode>> {
    const dailyDepartmentNotificationBatch =
      await this.dailyDepartmentNotificationRepository.findBatchByBatchId(id);
    return dailyDepartmentNotificationBatch.map(
      dailyDepartmentNotificationBatchModelToResource
    );
  }

  @MutationAccessControl(
    {
      accessLevel: AccessLevel.SuperAdmin,
    },
    fundraisingAccess
  )
  @Mutation(() => DailyDepartmentNotificationBatchNode)
  async deleteDailyDepartmentNotificationBatch(
    @Arg("id", () => GlobalIdScalar) { id }: GlobalId
  ) {
    const dailyDepartmentNotificationBatch =
      await this.dailyDepartmentNotificationRepository.deleteDDNBatch(id);
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
      this.dailyDepartmentNotificationRepository.findDDNsByBatchId(
        dailyDepartmentNotificationBatch.id.id
      )
    ).map((dailyDepartmentNotifications) =>
      dailyDepartmentNotifications.map(
        dailyDepartmentNotificationModelToResource
      )
    ).promise;
  }
}
