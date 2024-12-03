/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import type { DataProvider } from "@refinedev/core";
import type { Pagination } from "@refinedev/core";
import type { AbstractFilteredListQueryArgs } from "@ukdanceblue/common";
import { getCrudOperationNames } from "@ukdanceblue/common";
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

import { API_BASE_URL, urqlClient } from "../api";

function getOperationName(
  resource: string,
  operation: keyof ReturnType<typeof getCrudOperationNames>
) {
  return getCrudOperationNames(resource, pluralize(resource))[operation];
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
      .mutation(gqlOperation, variables ?? meta?.gqlVariables)
      .toPromise();

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
    const gqlOperation = meta?.gqlQuery ?? meta?.gqlMutation;

    if (!gqlOperation) {
      throw new Error("Operation is required.");
    }

    const query = isMutation(gqlOperation)
      ? gqlButDifferentName`
          query Get${camelcase(singular(resource), { pascalCase: true })}($id: GlobalID!) {
            ${getOperationName(resource, "getOne")}(id: $id) {
              ${getOperationFields(gqlOperation)}
            }
          }
        `
      : gqlOperation;

    const response = await urqlClient
      .query(query, {
        id,
        ...meta?.gqlVariables,
      })
      .toPromise();

    const key = getOperationName(resource, "getOne");
    const data = response.data?.[key];

    return { data };
  },

  getList: async (params) => {
    const { meta, sorters, filters, pagination, resource } = params;

    if (!meta?.gqlQuery) {
      throw new Error("Operation is required.");
    }

    if (filters && filters.length > 0) {
      throw new Error("Filters are not supported yet.");
    }

    const response = await urqlClient
      .query(meta.gqlQuery, {
        sortBy: sorters?.map((sorter) => sorter.field) ?? null,
        sortDirection: sorters?.map((sorter) => sorter.order) ?? null,
        page: pagination?.current ?? null,
        pageSize: pagination?.pageSize ?? null,
        ...meta?.variables,
        ...meta?.gqlVariables,
      } satisfies Partial<
        AbstractFilteredListQueryArgs<
          string,
          string,
          string,
          string,
          string,
          string
        >
      >)
      .toPromise();

    console.log(response);
    const val = response.data[getOperationName(resource, "getList")];
    if (Array.isArray(val)) {
      return { data: val, total: val.length };
    } else {
      return { data: val.data, total: val.total };
    }
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
      throw new Error(response.error.message);
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
    const { meta, id, resource } = params;

    if (!meta?.gqlMutation) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .mutation(meta.gqlMutation, {
        input: { id, ...meta.gqlVariables },
      })
      .toPromise();

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

    const data = response.data ?? response.error?.message;

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