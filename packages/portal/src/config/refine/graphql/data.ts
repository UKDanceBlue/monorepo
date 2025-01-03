/* eslint-disable @typescript-eslint/only-throw-error */
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import type { DataProvider, HttpError } from "@refinedev/core";
import type { Pagination } from "@refinedev/core";
import type {
  AbstractFilteredListQueryArgs,
  AbstractSortItem,
} from "@ukdanceblue/common";
import { getCrudOperationNames } from "@ukdanceblue/common";
import type { CombinedError } from "@urql/core";
import { gql } from "@urql/core";
import camelcase from "camelcase";
import {
  type DocumentNode,
  type FieldNode,
  Kind,
  OperationTypeNode,
  type SelectionSetNode,
  visit,
} from "graphql";
import pluralize, { singular } from "pluralize";

import { API_BASE_URL, urqlClient } from "../../api";
import {
  crudFiltersToFilterObject,
  type FilterGroup,
} from "./crudFiltersToFilterObject";
import { makeListDocument } from "./makeListDocument";

function getOperationName(
  resource: string,
  operation: keyof ReturnType<typeof getCrudOperationNames>
) {
  return getCrudOperationNames(resource, pluralize(resource))[operation];
}

export type FieldTypes = Record<string, "string" | "number" | "date" | "oneOf">;

function combinedToHttpError(error: CombinedError): HttpError {
  if (error.networkError) {
    return {
      statusCode: 0,
      message: error.networkError.message,
      cause: error.networkError,
    };
  } else {
    const { code } =
      error.graphQLErrors.find((e) => e.extensions.code)?.extensions ?? {};
    return {
      statusCode:
        typeof code === "number"
          ? code
          : code === "BAD_USER_INPUT"
            ? 400
            : code === "UNAUTHORIZED"
              ? 401
              : 500,
      message: error.message,
      cause: error,
    };
  }
}

// We alias gql to gqlButDifferentName to avoid the GraphQL plugin giving us an error about the invalid syntax
const gqlButDifferentName = gql;
export const dataProvider: Required<DataProvider> = {
  create: async (params) => {
    const { meta, variables, resource } = params;
    const gqlOperation = meta?.gqlMutation ?? meta?.gqlQuery;

    if (!gqlOperation) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .mutation(gqlOperation, {
        input: {
          ...variables,
          ...meta?.gqlVariables?.input,
        },
        ...meta?.gqlVariables,
      })
      .toPromise();

    if (response.error) {
      throw combinedToHttpError(response.error);
    }

    const key = getOperationName(resource, "createOne");
    const data = response.data?.[key];

    return { data };
  },

  createMany: async (params) => {
    const response = await Promise.all(
      params.variables.map(async (variables) =>
        dataProvider.create({ ...params, variables })
      )
    );

    return { data: response.map((r) => r.data) as any[] };
  },

  getOne: async (params) => {
    const { meta, id, resource } = params;

    let query;
    if (meta?.gqlQuery) {
      query = meta.gqlQuery;
    } else if (meta?.gqlFragment) {
      const fragmentDefinition = (meta.gqlFragment as Partial<DocumentNode>)
        .definitions?.[0];
      if (fragmentDefinition?.kind === Kind.FRAGMENT_DEFINITION) {
        query = gqlButDifferentName`
        query Get${camelcase(singular(resource), { pascalCase: true })}($id: GlobalId!) {
          ${getOperationName(resource, "getOne")}(id: $id) {
            ...${fragmentDefinition.name.value}
          }
        }
        ${meta.gqlFragment as DocumentNode}
      `;
      }
    } else if (meta?.gqlMutation) {
      query = gqlButDifferentName`
          query Get${camelcase(singular(resource), { pascalCase: true })}($id: GlobalId!) {
            ${getOperationName(resource, "getOne")}(id: $id) {
              ${getOperationFields(meta.gqlMutation)}
            }
          }
        `;
    }

    if (!query) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .query(query, {
        id,
        ...meta?.gqlVariables,
      })
      .toPromise();

    if (response.error) {
      throw combinedToHttpError(response.error);
    }

    const key = getOperationName(resource, "getOne");
    const data = response.data?.[key];

    return { data };
  },

  getList: async (params) => {
    const { meta, sorters, filters, pagination, resource } = params;

    const filterObj =
      filters &&
      crudFiltersToFilterObject(
        {
          operator: "and",
          value: filters,
        },
        meta?.fieldTypes as FieldTypes | undefined
      );

    let query: DocumentNode | undefined;
    if (meta?.gqlQuery) {
      query = meta.gqlQuery;
    } else if (meta?.gqlFragment) {
      const fragmentDefinition = (meta.gqlFragment as Partial<DocumentNode>)
        .definitions?.[0];
      if (fragmentDefinition?.kind === Kind.FRAGMENT_DEFINITION) {
        const pascalResource = camelcase(singular(resource), {
          pascalCase: true,
        });

        query = makeListDocument(pascalResource, resource, fragmentDefinition);
      }
    }

    if (!query) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .query(query, {
        sortBy:
          sorters?.map(
            (sorter): AbstractSortItem<string> => ({
              field: sorter.field,
              direction: sorter.order,
            })
          ) ?? undefined,
        page: pagination?.current ?? undefined,
        pageSize: pagination?.pageSize ?? undefined,
        filters: filterObj,
        ...meta?.variables,
        ...meta?.gqlVariables,
      } satisfies Partial<
        Omit<AbstractFilteredListQueryArgs<string>, "filters"> & {
          filters: FilterGroup;
        }
      >)
      .toPromise();

    if (response.error) {
      throw combinedToHttpError(response.error);
    }

    const val = response.data[getOperationName(resource, "getList")];
    let total: number;
    let data;
    if (Array.isArray(val)) {
      total = val.length;
      data = val;
    } else if ("total" in val) {
      total = val.total;
      data = val.data;
    } else {
      throw new Error("Invalid response");
    }
    return {
      data,
      total,
    };
  },

  getMany: async (params) => {
    const response = await Promise.all(
      params.ids.map(async (id) => dataProvider.getOne({ ...params, id }))
    );

    return { data: response.map((r) => r.data) as any[] };
  },

  update: async (params) => {
    const { meta, id, variables, resource } = params;
    const gqlOperation = meta?.gqlMutation ?? meta?.gqlQuery;

    if (!gqlOperation) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .mutation(gqlOperation, {
        id,
        input: {
          ...variables,
          ...meta?.gqlVariables?.input,
        },
        ...meta?.gqlVariables,
      })
      .toPromise();

    const key = getOperationName(resource, "setOne");
    const data = response.data?.[key];

    if (response.error) {
      throw combinedToHttpError(response.error);
    }

    return { data };
  },

  updateMany: async (params) => {
    const response = await Promise.all(
      params.ids.map(async (id) => dataProvider.update({ ...params, id }))
    );

    return { data: response.map((r) => r.data) as any[] };
  },

  deleteOne: async (params) => {
    const { meta, id, variables, resource } = params;

    let query;
    if (meta?.gqlMutation) {
      query = meta.gqlMutation;
    } else if (meta?.gqlFragment) {
      const fragmentDefinition = (meta.gqlFragment as Partial<DocumentNode>)
        .definitions?.[0];
      if (fragmentDefinition?.kind === Kind.FRAGMENT_DEFINITION) {
        query = gqlButDifferentName`
        mutation Delete${camelcase(singular(resource), { pascalCase: true })}($id: GlobalId!) {
          ${getOperationName(resource, "deleteOne")}(id: $id) {
            ...${fragmentDefinition.name.value}
          }
        }
        ${meta.gqlFragment as DocumentNode}
      `;
      }
    } else {
      query = gqlButDifferentName`
          mutation Delete${camelcase(singular(resource), { pascalCase: true })}($id: GlobalId!) {
            ${getOperationName(resource, "deleteOne")}(id: $id) {
              id
            }
          }
        `;
    }

    if (!query) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .mutation(query, {
        id,
        ...variables,
        ...meta?.gqlVariables,
      })
      .toPromise();

    if (response.error) {
      throw combinedToHttpError(response.error);
    }

    const key = getOperationName(resource, "deleteOne");
    const data = response.data?.[key];

    return { data };
  },

  deleteMany: async (params) => {
    const response = await Promise.all(
      params.ids.map(async (id) => dataProvider.deleteOne({ ...params, id }))
    );

    return { data: response.map((r) => r.data) as any[] };
  },

  custom: async (params) => {
    const { meta } = params;

    const variables = {
      ...meta?.variables,
      ...meta?.gqlVariables,
    };

    let response;
    if (meta?.gqlMutation) {
      response = await urqlClient
        .mutation(meta.gqlMutation, variables)
        .toPromise();
    } else if (meta?.gqlQuery) {
      response = await urqlClient.query(meta.gqlQuery, variables).toPromise();
    } else {
      throw new Error("Operation is required.");
    }

    if (response.error) {
      throw combinedToHttpError(response.error);
    }

    const { data } = response;

    return { data };
  },

  getApiUrl: () => {
    return API_BASE_URL;
  },
};

export const buildPagination = (pagination: Pagination = {}) => {
  if (pagination.mode === "off") return { limit: 2_147_483_647 };

  const { pageSize = 10, current = 1 } = pagination;

  return {
    limit: pageSize,
    offset: (current - 1) * pageSize,
  };
};

export const getOperationFields = (documentNode: DocumentNode) => {
  const fieldLines: string[] = [];
  let isInitialEnter = true;
  let depth = 0;
  let isNestedField = false;

  visit(documentNode, {
    Field: {
      enter(node): SelectionSetNode | undefined {
        if (isInitialEnter) {
          isInitialEnter = false;

          const childNodesField = node.selectionSet?.selections.find(
            (node) => node.kind === Kind.FIELD && node.name.value === "nodes"
          ) as FieldNode | undefined;

          const nodeToReturn = childNodesField ?? node;

          if (nodeToReturn.selectionSet === undefined) {
            throw new TypeError("Operation must have a selection set");
          }

          return nodeToReturn.selectionSet;
        }

        fieldLines.push(
          `${depth > 0 ? "  ".repeat(isNestedField ? depth : depth - 1) : ""}${
            node.name.value
          }${node.selectionSet ? " {" : ""}`
        );

        if (node.selectionSet) {
          depth++;
          isNestedField = true;
        }

        return undefined;
      },
      leave(node) {
        if (node.selectionSet) {
          depth--;
          fieldLines.push(`${"  ".repeat(depth)}}`);
          isNestedField = false;
        }
      },
    },
  });

  return fieldLines.join("\n").trim();
};

export const isMutation = (documentNode: DocumentNode) => {
  let isMutation = false;

  visit(documentNode, {
    OperationDefinition: {
      enter(node) {
        if (node.operation === OperationTypeNode.MUTATION) {
          isMutation = true;
        }
      },
    },
  });

  return isMutation;
};
