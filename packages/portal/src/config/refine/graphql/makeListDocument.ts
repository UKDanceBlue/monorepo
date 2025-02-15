import type {
  AbstractFilterGroup,
  AbstractSearchFilter,
  AbstractSortItem,
} from "@ukdanceblue/common";
import type { ResultOf, TadaDocumentNode } from "gql.tada";
import type { DefinitionNode } from "graphql";
import { Kind, OperationTypeNode } from "graphql";
import pluralize from "pluralize";

import { PaginationFragment } from "#documents/shared.js";

export function makeListDocument(
  pascalResource: string,
  resource: string,
  fragmentName: string,
  definitions: readonly DefinitionNode[]
): TadaDocumentNode<
  {
    data: unknown;
  } & ResultOf<typeof PaginationFragment>,
  {
    page?: number;
    pageSize?: number;
    sortBy?: AbstractSortItem<string>[];
    filters?: AbstractFilterGroup<string>;
    search?: AbstractSearchFilter<string>;
  }
> {
  return {
    kind: Kind.DOCUMENT,
    definitions: [
      {
        kind: Kind.OPERATION_DEFINITION,
        operation: OperationTypeNode.QUERY,
        name: { kind: Kind.NAME, value: `Get${pascalResource}List` },
        variableDefinitions: [
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "page" },
            },
            type: {
              kind: Kind.NAMED_TYPE,
              name: { kind: Kind.NAME, value: "PositiveInt" },
            },
          },
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "pageSize" },
            },
            type: {
              kind: Kind.NAMED_TYPE,
              name: { kind: Kind.NAME, value: "NonNegativeInt" },
            },
          },
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "sortBy" },
            },
            type: {
              kind: Kind.LIST_TYPE,
              type: {
                kind: Kind.NAMED_TYPE,
                name: {
                  kind: Kind.NAME,
                  value: `${pascalResource}ResolverSort!`,
                },
              },
            },
          },
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "filters" },
            },
            type: {
              kind: Kind.NAMED_TYPE,
              name: {
                kind: Kind.NAME,
                value: `${pascalResource}ResolverFilterGroup!`,
              },
            },
          },
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "search" },
            },
            type: {
              kind: Kind.NAMED_TYPE,
              name: {
                kind: Kind.NAME,
                value: `${pascalResource}ResolverSearchFilter`,
              },
            },
          },
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "sendAll" },
            },
            type: {
              kind: Kind.NAMED_TYPE,
              name: {
                kind: Kind.NAME,
                value: "Boolean",
              },
            },
          },
        ],
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [
            {
              kind: Kind.FIELD,
              name: { kind: Kind.NAME, value: pluralize(resource) },
              arguments: [
                {
                  kind: Kind.ARGUMENT,
                  name: { kind: Kind.NAME, value: "page" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "page" },
                  },
                },
                {
                  kind: Kind.ARGUMENT,
                  name: { kind: Kind.NAME, value: "pageSize" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "pageSize" },
                  },
                },
                {
                  kind: Kind.ARGUMENT,
                  name: { kind: Kind.NAME, value: "sortBy" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "sortBy" },
                  },
                },
                {
                  kind: Kind.ARGUMENT,
                  name: { kind: Kind.NAME, value: "filters" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "filters" },
                  },
                },
                {
                  kind: Kind.ARGUMENT,
                  name: { kind: Kind.NAME, value: "search" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "search" },
                  },
                },
                {
                  kind: Kind.ARGUMENT,
                  name: { kind: Kind.NAME, value: "sendAll" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "sendAll" },
                  },
                },
              ],
              selectionSet: {
                kind: Kind.SELECTION_SET,
                selections: [
                  {
                    kind: Kind.FRAGMENT_SPREAD,
                    name: {
                      kind: Kind.NAME,
                      value: "PaginationFragment",
                    },
                  },
                  {
                    kind: Kind.FIELD,
                    name: { kind: Kind.NAME, value: "data" },
                    selectionSet: {
                      kind: Kind.SELECTION_SET,
                      selections: [
                        {
                          kind: Kind.FRAGMENT_SPREAD,
                          name: {
                            kind: Kind.NAME,
                            value: fragmentName,
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      ...definitions,
      ...PaginationFragment.definitions,
    ],
  };
}
