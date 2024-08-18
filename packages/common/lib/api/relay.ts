
import { Errorable, ResourceError } from "./resourceError.js";
import { CursorScalar } from "./scalars/Cursor.js";
import { GlobalIdScalar } from "./scalars/GlobalId.js";

import { Field, InterfaceType, ObjectType } from "type-graphql";

import type { GlobalId } from "./scalars/GlobalId.js";

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

@InterfaceType()
export abstract class Node {
  @Field(() => GlobalIdScalar)
  id!: GlobalId;
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

export function createNodeClasses<T extends Node, Name extends string>(
  cls: new () => T,
  name: Name
) {
  const edgeClassName = `${name}Edge` as const;
  @ObjectType(edgeClassName, { implements: Edge })
  class EdgeClass extends Edge {
    @Field(() => cls)
    node!: T;
  }

  const connectionClassName = `${name}Connection` as const;
  @ObjectType(connectionClassName, { implements: Connection })
  class ConnectionClass extends Connection {
    @Field(() => [EdgeClass])
    edges!: EdgeClass[];
  }

  const resultClassName = `${name}Result` as const;
  @ObjectType(resultClassName, { implements: Result })
  class ResultClass extends Result {
    @Field(() => cls, { nullable: true })
    node?: T;
  }

  return {
    [edgeClassName]: EdgeClass,
    [connectionClassName]: ConnectionClass,
    [resultClassName]: ResultClass,
  } as {
    // Type magic to let autocomplete work
    [K in
      | `${Name}Edge`
      | `${Name}Connection`
      | `${Name}Result`]: K extends `${Name}Edge`
      ? typeof EdgeClass
      : K extends `${Name}Connection`
        ? typeof ConnectionClass
        : K extends `${Name}Result`
          ? typeof ResultClass
          : never;
  };
}
