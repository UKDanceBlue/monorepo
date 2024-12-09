import type { DocumentNode, FragmentDefinitionNode } from "graphql";
import { Kind, OperationTypeNode } from "graphql";
import pluralize from "pluralize";

import { PaginationFragment } from "#documents/shared.ts";

export function makeListDocument(
  pascalResource: string,
  resource: string,
  fragmentDefinition: FragmentDefinitionNode,
  variableTypes: {
    isNull: boolean;
    date: boolean;
    numeric: boolean;
    oneOf: boolean;
    string: boolean;
    boolean: boolean;
  }
): DocumentNode {
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
              name: { kind: Kind.NAME, value: "Int" },
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
              name: { kind: Kind.NAME, value: "Int" },
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
                name: { kind: Kind.NAME, value: "String!" },
              },
            },
          },
          {
            kind: Kind.VARIABLE_DEFINITION,
            variable: {
              kind: Kind.VARIABLE,
              name: { kind: Kind.NAME, value: "sortDirection" },
            },
            type: {
              kind: Kind.LIST_TYPE,
              type: {
                kind: Kind.NAMED_TYPE,
                name: { kind: Kind.NAME, value: "SortDirection!" },
              },
            },
          },
          ...(variableTypes.date
            ? [
                {
                  kind: Kind.VARIABLE_DEFINITION,
                  variable: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "dateFilters" },
                  },
                  type: {
                    kind: Kind.LIST_TYPE,
                    type: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: `${pascalResource}ResolverKeyedDateFilterItem!`,
                      },
                    },
                  },
                } as const,
              ]
            : []),
          ...(variableTypes.isNull
            ? [
                {
                  kind: Kind.VARIABLE_DEFINITION,
                  variable: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "isNullFilters" },
                  },
                  type: {
                    kind: Kind.LIST_TYPE,
                    type: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: `${pascalResource}ResolverKeyedIsNullFilterItem!`,
                      },
                    },
                  },
                } as const,
              ]
            : []),
          ...(variableTypes.numeric
            ? [
                {
                  kind: Kind.VARIABLE_DEFINITION,
                  variable: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "numericFilters" },
                  },
                  type: {
                    kind: Kind.LIST_TYPE,
                    type: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: `${pascalResource}ResolverKeyedNumericFilterItem!`,
                      },
                    },
                  },
                } as const,
              ]
            : []),
          ...(variableTypes.oneOf
            ? [
                {
                  kind: Kind.VARIABLE_DEFINITION,
                  variable: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "oneOfFilters" },
                  },
                  type: {
                    kind: Kind.LIST_TYPE,
                    type: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: `${pascalResource}ResolverKeyedOneOfFilterItem!`,
                      },
                    },
                  },
                } as const,
              ]
            : []),
          ...(variableTypes.string
            ? [
                {
                  kind: Kind.VARIABLE_DEFINITION,
                  variable: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "stringFilters" },
                  },
                  type: {
                    kind: Kind.LIST_TYPE,
                    type: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: `${pascalResource}ResolverKeyedStringFilterItem!`,
                      },
                    },
                  },
                } as const,
              ]
            : []),
          ...(variableTypes.boolean
            ? [
                {
                  kind: Kind.VARIABLE_DEFINITION,
                  variable: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "booleanFilters" },
                  },
                  type: {
                    kind: Kind.LIST_TYPE,
                    type: {
                      kind: Kind.NAMED_TYPE,
                      name: {
                        kind: Kind.NAME,
                        value: `${pascalResource}ResolverKeyedBooleanFilterItem!`,
                      },
                    },
                  },
                } as const,
              ]
            : []),
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
                  name: { kind: Kind.NAME, value: "sortDirection" },
                  value: {
                    kind: Kind.VARIABLE,
                    name: { kind: Kind.NAME, value: "sortDirection" },
                  },
                },
                ...(variableTypes.date
                  ? [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: "dateFilters" },
                        value: {
                          kind: Kind.VARIABLE,
                          name: { kind: Kind.NAME, value: "dateFilters" },
                        },
                      } as const,
                    ]
                  : []),
                ...(variableTypes.isNull
                  ? [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: "isNullFilters" },
                        value: {
                          kind: Kind.VARIABLE,
                          name: { kind: Kind.NAME, value: "isNullFilters" },
                        },
                      } as const,
                    ]
                  : []),
                ...(variableTypes.numeric
                  ? [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: "numericFilters" },
                        value: {
                          kind: Kind.VARIABLE,
                          name: { kind: Kind.NAME, value: "numericFilters" },
                        },
                      } as const,
                    ]
                  : []),
                ...(variableTypes.oneOf
                  ? [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: "oneOfFilters" },
                        value: {
                          kind: Kind.VARIABLE,
                          name: { kind: Kind.NAME, value: "oneOfFilters" },
                        },
                      } as const,
                    ]
                  : []),
                ...(variableTypes.string
                  ? [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: "stringFilters" },
                        value: {
                          kind: Kind.VARIABLE,
                          name: { kind: Kind.NAME, value: "stringFilters" },
                        },
                      } as const,
                    ]
                  : []),
                ...(variableTypes.boolean
                  ? [
                      {
                        kind: Kind.ARGUMENT,
                        name: { kind: Kind.NAME, value: "booleanFilters" },
                        value: {
                          kind: Kind.VARIABLE,
                          name: { kind: Kind.NAME, value: "booleanFilters" },
                        },
                      } as const,
                    ]
                  : []),
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
                            value: fragmentDefinition.name.value,
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
      fragmentDefinition,
      ...PaginationFragment.definitions,
    ],
  };
}
