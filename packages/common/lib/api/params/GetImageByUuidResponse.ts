import { NonEmptyStringResolver, URLResolver } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/list-query-args/FilteredListQueryArgs.js";
import { ImageNode } from "../resources/Image.js";
import { AbstractGraphQLPaginatedResponse } from "./ApiResponse.js";

@InputType()
export class CreateImageInput implements Partial<ImageNode> {
  @Field(() => NonEmptyStringResolver, { nullable: true })
  alt?: string | undefined | null;

  @Field(() => URLResolver, { nullable: true })
  url?: URL | undefined | null;
}

@ArgsType()
export class ListImagesArgs extends FilteredListQueryArgs<
  "alt" | "width" | "height" | "createdAt" | "updatedAt",
  "alt",
  never,
  "width" | "height",
  "createdAt" | "updatedAt",
  never
>("ImageResolver", {
  all: ["alt", "width", "height", "createdAt", "updatedAt"],
  string: ["alt"],
  numeric: ["width", "height"],
  date: ["createdAt", "updatedAt"],
}) {}

@ObjectType("ListImagesResponse", {
  implements: AbstractGraphQLPaginatedResponse<ImageNode[]>,
})
export class ListImagesResponse extends AbstractGraphQLPaginatedResponse<ImageNode> {
  @Field(() => [ImageNode])
  data!: ImageNode[];
}
