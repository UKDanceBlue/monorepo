/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access */
import type { DataProvider } from "@refinedev/core";
import type {
  CrudFilter,
  CrudOperators,
  LogicalFilter,
  Pagination,
} from "@refinedev/core";
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
import set from "lodash/set";
import { singular } from "pluralize";

import { API_BASE_URL, urqlClient } from "../api";

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

    const key = `createOne${camelcase(singular(resource), { pascalCase: true })}`;
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
          query Get${camelcase(singular(resource), { pascalCase: true })}($id: ID!) {
            ${camelcase(singular(resource))}(id: $id) {
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

    const key = camelcase(singular(resource));
    const data = response.data?.[key];

    return { data };
  },

  getList: async (params) => {
    const { meta, sorters, filters, pagination, resource } = params;

    if (!meta?.gqlQuery) {
      throw new Error("Operation is required.");
    }

    const response = await urqlClient
      .query(meta.gqlQuery, {
        sorting: sorters?.map((s) => ({
          field: s.field,
          direction: s.order.toUpperCase(),
        })),
        filter: buildFilters(filters),
        paging: buildPagination(pagination),
        ...meta.variables,
        ...meta.gqlVariables,
      })
      .toPromise();

    console.log(response);
    const data = response.data?.[resource].nodes;
    const total = response.data?.[resource].totalCount;

    return { data, total };
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
        input: {
          id,
          update: variables,
          ...meta?.gqlVariables,
        },
      })
      .toPromise();

    const key = `updateOne${camelcase(singular(resource), { pascalCase: true })}`;
    const data = response.data?.[key];

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

    const key = `deleteOne${camelcase(singular(resource), { pascalCase: true })}`;
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

const operatorMap: Record<string, string> = {
  eq: "eq",
  ne: "neq",
  lt: "lt",
  gt: "gt",
  lte: "lte",
  gte: "gte",
  in: "in",
  nin: "notIn",
};

const operatorMapper = (
  operator: CrudOperators,
  value: any
): Record<string, any> => {
  if (operator === "contains") {
    return { iLike: `%${value}%` };
  }

  if (operator === "ncontains") {
    return { notILike: `%${value}%` };
  }

  if (operator === "containss") {
    return { like: `%${value}%` };
  }

  if (operator === "ncontainss") {
    return { notLike: `%${value}%` };
  }

  if (operator === "startswith") {
    return { iLike: `${value}%` };
  }

  if (operator === "nstartswith") {
    return { notILike: `${value}%` };
  }

  if (operator === "startswiths") {
    return { like: `${value}%` };
  }

  if (operator === "nstartswiths") {
    return { notLike: `${value}%` };
  }

  if (operator === "endswith") {
    return { iLike: `%${value}` };
  }

  if (operator === "nendswith") {
    return { notILike: `%${value}` };
  }

  if (operator === "endswiths") {
    return { like: `%${value}` };
  }

  if (operator === "nendswiths") {
    return { notLike: `%${value}` };
  }

  if (operator === "null") {
    return { is: null };
  }

  if (operator === "nnull") {
    return { isNot: null };
  }

  if (operator === "between") {
    if (!Array.isArray(value)) {
      throw new TypeError("Between operator requires an array");
    }

    if (value.length !== 2) {
      return {};
    }

    return { between: { lower: value[0], upper: value[1] } };
  }

  if (operator === "nbetween") {
    if (!Array.isArray(value)) {
      throw new TypeError("NBetween operator requires an array");
    }

    if (value.length !== 2) {
      return {};
    }

    return { notBetween: { lower: value[0], upper: value[1] } };
  }

  return { [operatorMap[operator]!]: value };
};

export const buildFilters = (filters: LogicalFilter[] | CrudFilter[] = []) => {
  const result: Record<string, Record<string, string | number>> = {};

  filters
    .filter((f) => {
      if (Array.isArray(f.value) && f.value.length === 0) {
        return false;
      }
      if (typeof f.value === "number") {
        return Number.isFinite(f.value);
      }

      // If the value is null or undefined, it returns false.
      return !(f.value == null);
    })
    .map((filter: LogicalFilter | CrudFilter) => {
      if (filter.operator === "and" || filter.operator === "or") {
        return set(result, filter.operator, [
          buildFilters(filter.value as LogicalFilter[]),
        ]);
      }
      if ("field" in filter) {
        return set(
          result,
          filter.field,
          operatorMapper(filter.operator, filter.value)
        );
      }

      return {};
    });

  return result;
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
