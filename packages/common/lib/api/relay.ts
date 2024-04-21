import { Field, ID, InterfaceType, ObjectType } from "type-graphql";

import { Errorable, ResourceError } from "./resourceError.js";
import { CursorScalar } from "./scalars/Cursor.js";

@InterfaceType()
export abstract class Node {
  @Field(() => ID)
  id!: string;
}
@InterfaceType()
export abstract class Edge<N extends Node = Node> {
  @Field(() => CursorScalar)
  cursor!: string;

  @Field(() => Node)
  node!: N;
}
@InterfaceType({ implements: [Errorable] })
export abstract class Connection<E extends Edge = Edge> implements Errorable {
  @Field(() => Number, { name: "totalCount" })
  totalCount!: number;

  @Field(() => [Edge], { name: "edges" })
  edges!: E[];

  @Field(() => PageInfo, { name: "pageInfo" })
  pageInfo!: PageInfo;

  @Field(() => [ResourceError], { name: "errors" })
  errors!: ResourceError[];
}
@InterfaceType({ implements: [Errorable] })
export abstract class Resource<N extends Node = Node> implements Errorable {
  @Field(() => Node, { name: "node" })
  node!: N;

  @Field(() => [ResourceError], { name: "errors" })
  errors!: ResourceError[];
}
@InterfaceType({ implements: [Errorable] })
export abstract class Result<N extends Node = Node> implements Errorable {
  @Field(() => Node, { name: "node", nullable: true })
  node?: N;

  @Field(() => [ResourceError], { name: "errors" })
  errors!: ResourceError[];
}

export function createNodeClasses<T extends Node>(
  cls: new () => T,
  name: string
): {
  EdgeClass: new () => Edge<T>;
  ConnectionClass: new () => Connection<Edge<T>>;
  ResultClass: new () => Result<T>;
} {
  @ObjectType(`Node${name}`, { implements: Edge })
  class EdgeClass extends Edge {
    @Field(() => cls)
    node!: T;
  }

  @ObjectType(`${name}Connection`, { implements: Connection })
  class ConnectionClass extends Connection {
    @Field(() => [EdgeClass])
    edges!: EdgeClass[];
  }

  @ObjectType(`${name}Result`, { implements: Result })
  class ResultClass extends Result {
    @Field(() => cls, { nullable: true })
    node?: T;
  }

  return {
    EdgeClass,
    ConnectionClass,
    ResultClass,
  };
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
