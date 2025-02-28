import { GraphQLNonEmptyString, GraphQLURL } from "graphql-scalars";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";

import { FilteredListQueryArgs } from "../filtering/FilteredListQueryArgs.js";
import { ImageNode } from "../resources/Image.js";
import { AbstractGraphQLPaginatedResponse } from "./PaginatedResponse.js";

@InputType()
export class CreateImageInput implements Partial<ImageNode> {
  @Field(() => GraphQLNonEmptyString, { nullable: true })
  alt?: string | undefined | null;

  @Field(() => GraphQLURL, { nullable: true })
  url?: URL | undefined | null;
}

@ArgsType()
export class ListImagesArgs extends FilteredListQueryArgs("ImageResolver", [
  "alt",
  "width",
  "height",
  "createdAt",
  "updatedAt",
]) {}

@ObjectType("ListImagesResponse", {
  implements: AbstractGraphQLPaginatedResponse<ImageNode[]>,
})
export class ListImagesResponse extends AbstractGraphQLPaginatedResponse<ImageNode> {
  @Field(() => [ImageNode], { nullable: false })
  data!: ImageNode[];
}
