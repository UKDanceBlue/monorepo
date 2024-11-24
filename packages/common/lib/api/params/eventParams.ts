import { NonEmptyStringResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { EventNode } from "../resources/Event.js";
import { ImageNode } from "../resources/Image.js";
import { GlobalId, GlobalIdScalar } from "../scalars/GlobalId.js";
import { IntervalISO } from "../types/IntervalISO.js";
import {
  AbstractGraphQLCreatedResponse,
  AbstractGraphQLOkResponse,
  AbstractGraphQLPaginatedResponse,
} from "./ApiResponse.js";

@ObjectType("GetEventByUuidResponse", {
  implements: AbstractGraphQLOkResponse<EventNode>,
})
export class GetEventByUuidResponse extends AbstractGraphQLOkResponse<EventNode> {
  @Field(() => EventNode)
  data!: EventNode;
}
@ObjectType("CreateEventResponse", {
  implements: AbstractGraphQLCreatedResponse<EventNode>,
})
export class CreateEventResponse extends AbstractGraphQLCreatedResponse<EventNode> {
  @Field(() => EventNode)
  data!: EventNode;
}
@ObjectType("SetEventResponse", {
  implements: AbstractGraphQLOkResponse<EventNode>,
})
export class SetEventResponse extends AbstractGraphQLOkResponse<EventNode> {
  @Field(() => EventNode)
  data!: EventNode;
}
@ObjectType("DeleteEventResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class DeleteEventResponse extends AbstractGraphQLOkResponse<never> {}

@ObjectType("RemoveEventImageResponse", {
  implements: AbstractGraphQLOkResponse<boolean>,
})
export class RemoveEventImageResponse extends AbstractGraphQLOkResponse<boolean> {
  @Field(() => Boolean)
  data!: boolean;
}

@ObjectType("AddEventImageResponse", {
  implements: AbstractGraphQLOkResponse<ImageNode>,
})
export class AddEventImageResponse extends AbstractGraphQLOkResponse<ImageNode> {
  @Field(() => ImageNode)
  data!: ImageNode;
}

@ObjectType("ListEventsResponse", {
  implements: AbstractGraphQLPaginatedResponse<EventNode[]>,
})
export class ListEventsResponse extends AbstractGraphQLPaginatedResponse<EventNode> {
  @Field(() => [EventNode])
  data!: EventNode[];
}

@InputType()
export class CreateEventOccurrenceInput {
  @Field(() => IntervalISO)
  interval!: IntervalISO;
  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
export class CreateEventInput {
  @Field(() => NonEmptyStringResolver)
  title!: string;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  summary!: string | null;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  location!: string | null;

  @Field(() => [CreateEventOccurrenceInput])
  occurrences!: CreateEventOccurrenceInput[];

  @Field(() => NonEmptyStringResolver, { nullable: true })
  description!: string | null;
}

@InputType()
export class SetEventOccurrenceInput {
  @Field(() => GlobalIdScalar, {
    nullable: true,
    description:
      "If updating an existing occurrence, the UUID of the occurrence to update",
  })
  uuid!: GlobalId | null;
  @Field(() => IntervalISO)
  interval!: IntervalISO;
  @Field(() => Boolean)
  fullDay!: boolean;
}

@InputType()
export class SetEventInput {
  @Field()
  title!: string;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  summary!: string | null;

  @Field(() => NonEmptyStringResolver, { nullable: true })
  location!: string | null;

  @Field(() => [SetEventOccurrenceInput])
  occurrences!: SetEventOccurrenceInput[];

  @Field(() => NonEmptyStringResolver, { nullable: true })
  description!: string | null;
}

@ArgsType()
export class ListEventsArgs extends FilteredListQueryArgs<
  | "title"
  | "description"
  | "summary"
  | "location"
  | "occurrence"
  | "occurrenceStart"
  | "occurrenceEnd"
  | "createdAt"
  | "updatedAt",
  "title" | "description" | "summary" | "location",
  never,
  never,
  | "occurrence"
  | "occurrenceStart"
  | "occurrenceEnd"
  | "createdAt"
  | "updatedAt",
  never
>("EventResolver", {
  all: [
    "title",
    "description",
    "summary",
    "location",
    "occurrence",
    "occurrenceStart",
    "occurrenceEnd",
    "createdAt",
    "updatedAt",
  ],
  string: ["title", "summary", "description", "location"],
  date: [
    "occurrence",
    "createdAt",
    "updatedAt",
    "occurrenceStart",
    "occurrenceEnd",
  ],
}) {}
