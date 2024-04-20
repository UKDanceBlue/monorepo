import { Field, InterfaceType, ObjectType } from "type-graphql";

import { Errorable, ResourceError } from "./resourceError.js";
import { CursorScalar } from "./scalars/Cursor.js";
import { NodeIDScalar } from "./scalars/NodeID.js";

@InterfaceType()
export class Node {
  @Field(() => NodeIDScalar)
  id!: string;
}
@InterfaceType()
export class Edge {
  @Field(() => CursorScalar)
  cursor!: string;

  @Field(() => Node)
  node!: string;
}

@InterfaceType({ implements: [Errorable] })
export class Connection implements Errorable {
  @Field(() => Number, { name: "totalCount" })
  totalCount!: number;

  @Field(() => [Edge], { name: "edges" })
  edges!: Edge[];

  @Field(() => PageInfo, { name: "pageInfo" })
  pageInfo!: PageInfo;

  @Field(() => [ResourceError], { name: "errors" })
  errors!: ResourceError[];
}

@InterfaceType({ implements: [Errorable] })
export class Resource implements Errorable {
  @Field(() => Node, { name: "node" })
  node!: Node;

  @Field(() => [ResourceError], { name: "errors" })
  errors!: ResourceError[];
}

@InterfaceType({ implements: [Errorable] })
export class Result implements Errorable {
  @Field(() => Node, { name: "node" })
  node!: Node;

  @Field(() => [ResourceError], { name: "errors" })
  errors!: ResourceError[];
}

@ObjectType()
export class PageInfo {
  @Field(() => Boolean, {
    name: "hasPreviousPage",
    description:
      "hasPreviousPage is used to indicate whether more edges exist prior to the set defined by the clients arguments. If the client is paginating with last/before, then the server must return true if prior edges exist, otherwise false. If the client is paginating with first/after, then the client may return true if edges prior to after exist, if it can do so efficiently, otherwise may return false.",
  })
  hasPreviousPage!: boolean;

  @Field(() => Boolean, {
    name: "hasNextPage",
    description:
      "hasNextPage is used to indicate whether more edges exist following the set defined by the clients arguments. If the client is paginating with first/after, then the server must return true if further edges exist, otherwise false. If the client is paginating with last/before, then the client may return true if edges further from before exist, if it can do so efficiently, otherwise may return false.",
  })
  hasNextPage!: boolean;

  @Field(() => CursorScalar, {
    name: "startCursor",
    description:
      "startCursor is simply an opaque value that refers to the first position in a connection. It is used by the client to request the first set of edges in a connection. The server must return the cursor that corresponds to the first element in the connection.",
  })
  startCursor!: string;

  @Field(() => CursorScalar, {
    name: "endCursor",
    description:
      "endCursor is simply an opaque value that refers to the last position in a connection. It is used by the client to request the last set of edges in a connection. The server must return the cursor that corresponds to the last element in the connection.",
  })
  endCursor!: string;
}
