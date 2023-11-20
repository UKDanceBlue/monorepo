import {
  DateTimeScalar,
  ErrorCode,
  EventResource,
  PointOpportunityResource,
  TeamType,
} from "@ukdanceblue/common";
import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { PointOpportunityModel } from "../models/PointOpportunity.js";

import { DateTime } from "luxon";
import { EventModel } from "../models/Event.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
  DetailedError,
} from "./ApiResponse.js";
import type {
  ResolverInterface,
  ResolverInterfaceWithFilteredList,
} from "./ResolverInterface.js";
import { FilteredListQueryArgs } from "./list-query-args/FilteredListQueryArgs.js";

@ObjectType("SinglePointOpportunityResponse", {
  implements: AbstractGraphQLOkResponse<PointOpportunityResource>,
})
class SinglePointOpportunityResponse extends AbstractGraphQLOkResponse<PointOpportunityResource> {
  @Field(() => PointOpportunityResource)
  data!: PointOpportunityResource;
}
@ObjectType("ListPointOpportunitiesResponse", {
  implements: AbstractGraphQLPaginatedResponse<PointOpportunityResource>,
})
class ListPointOpportunitiesResponse extends AbstractGraphQLPaginatedResponse<PointOpportunityResource> {
  @Field(() => [PointOpportunityResource])
  data!: PointOpportunityResource[];
}
@ObjectType("CreatePointOpportunityResponse", {
  implements: AbstractGraphQLCreatedResponse<PointOpportunityResource>,
})
class CreatePointOpportunityResponse extends AbstractGraphQLCreatedResponse<PointOpportunityResource> {
  @Field(() => PointOpportunityResource)
  data!: PointOpportunityResource;
}
@ObjectType("DeletePointOpportunityResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
class DeletePointOpportunityResponse extends AbstractGraphQLOkResponse<never> {}

@InputType()
class CreatePointOpportunityInput {
  @Field(() => String)
  name!: string;

  @Field(() => DateTimeScalar, { nullable: true })
  opportunityDate!: DateTime | null;

  @Field(() => TeamType)
  type!: TeamType;

  @Field(() => ID, { nullable: true })
  eventUuid!: string | null;
}

@InputType()
class SetPointOpportunityInput {
  @Field(() => String, { nullable: true })
  name!: string | null;

  @Field(() => DateTimeScalar, { nullable: true })
  opportunityDate!: DateTime | null;

  @Field(() => TeamType, { nullable: true })
  type!: TeamType | null;

  @Field(() => ID, { nullable: true })
  eventUuid!: string | null;
}

@ArgsType()
class ListPointOpportunitiesArgs extends FilteredListQueryArgs(
  "PointOpportunityResolver",
  {
    all: ["name", "opportunityDate", "type", "createdAt", "updatedAt"],
    string: ["name", "type"],
    date: ["opportunityDate", "createdAt", "updatedAt"],
  }
) {}

@Resolver(() => PointOpportunityResource)
export class PointOpportunityResolver
  implements
    ResolverInterface<PointOpportunityResource>,
    ResolverInterfaceWithFilteredList<
      PointOpportunityResource,
      ListPointOpportunitiesArgs
    >
{
  @Query(() => SinglePointOpportunityResponse, { name: "pointOpportunity" })
  async getByUuid(
    @Arg("uuid") uuid: string
  ): Promise<SinglePointOpportunityResponse> {
    const row = await PointOpportunityModel.findOne({ where: { uuid } });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    return SinglePointOpportunityResponse.newOk(row.toResource());
  }

  @Query(() => ListPointOpportunitiesResponse, { name: "pointOpportunities" })
  async list(
    @Args(() => ListPointOpportunitiesArgs) query: ListPointOpportunitiesArgs
  ): Promise<ListPointOpportunitiesResponse> {
    const findOptions = query.toSequelizeFindOptions(
      {
        name: "name",
        type: "type",
        opportunityDate: "opportunityDate",
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
      PointOpportunityModel
    );

    const { rows, count } =
      await PointOpportunityModel.findAndCountAll(findOptions);

    return ListPointOpportunitiesResponse.newPaginated({
      data: rows.map((row) => row.toResource()),
      total: count,
      page: query.page,
      pageSize: query.pageSize,
    });
  }

  @Mutation(() => CreatePointOpportunityResponse, {
    name: "createPointOpportunity",
  })
  async create(
    @Arg("input") input: CreatePointOpportunityInput
  ): Promise<CreatePointOpportunityResponse> {
    let eventId: number | null = null;
    if (input.eventUuid != null) {
      const event = await EventModel.findByUuid(input.eventUuid, {
        attributes: ["id"],
      });
      if (!event) {
        throw new DetailedError(ErrorCode.NotFound, "Event not found");
      }
      eventId = event.id;
    }
    const row = await PointOpportunityModel.create({
      name: input.name,
      opportunityDate: input.opportunityDate?.toJSDate() ?? null,
      type: input.type,
      eventId,
    });

    return CreatePointOpportunityResponse.newCreated(
      row.toResource(),
      row.uuid
    );
  }

  @Mutation(() => SinglePointOpportunityResponse, {
    name: "setPointOpportunity",
  })
  async set(
    @Arg("uuid") uuid: string,
    @Arg("input") input: SetPointOpportunityInput
  ): Promise<SinglePointOpportunityResponse> {
    const row = await PointOpportunityModel.findByUuid(uuid, {
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    let eventId: number | null = null;
    if (input.eventUuid != null) {
      const event = await EventModel.findByUuid(input.eventUuid, {
        attributes: ["id"],
      });
      if (!event) {
        throw new DetailedError(ErrorCode.NotFound, "Event not found");
      }
      eventId = event.id;
    }

    let rowParam: Partial<PointOpportunityModel> = {};
    if (input.name != null) {
      rowParam.name = input.name;
    }
    if (input.opportunityDate != null) {
      rowParam.opportunityDate = input.opportunityDate.toJSDate();
    }
    if (input.type != null) {
      rowParam.type = input.type;
    }
    if (eventId != null) {
      rowParam.eventId = eventId;
    }

    await row.update(rowParam);

    return SinglePointOpportunityResponse.newOk(row.toResource());
  }

  @Mutation(() => DeletePointOpportunityResponse, {
    name: "deletePointOpportunity",
  })
  async delete(
    @Arg("uuid") id: string
  ): Promise<DeletePointOpportunityResponse> {
    const row = await PointOpportunityModel.findOne({
      where: { uuid: id },
      attributes: ["id"],
    });

    if (row == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    await row.destroy();

    return DeletePointOpportunityResponse.newOk(true);
  }

  @FieldResolver(() => EventResource, { nullable: true })
  async event(
    @Root() pointOpportunity: PointOpportunityResource
  ): Promise<EventResource | null> {
    const model = await PointOpportunityModel.findByUuid(
      pointOpportunity.uuid,
      {
        include: { model: EventModel, as: "event" },
      }
    );

    if (model == null) {
      throw new DetailedError(ErrorCode.NotFound, "PointOpportunity not found");
    }

    return model.event?.toResource() ?? null;
  }
}
