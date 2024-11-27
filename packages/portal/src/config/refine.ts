/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type {
  BaseRecord,
  CreateManyParams,
  CreateParams,
  CustomParams,
  DeleteManyParams,
  DeleteOneParams,
  GetListParams,
  GetManyParams,
  GetOneParams,
  UpdateManyParams,
  UpdateParams,
} from "@refinedev/core";
import type {
  CrudFilter,
  CrudOperators,
  CrudSort,
  LogicalFilter,
  Pagination,
} from "@refinedev/core";
import createDataProvider from "@refinedev/graphql";
import { gql, type OperationResult } from "@urql/core";
import camelcase from "camelcase";
import {
  type DocumentNode,
  type FieldNode,
  type SelectionSetNode,
  visit,
} from "graphql";
import set from "lodash/set";
import { singular } from "pluralize";

import { urqlClient } from "./api";

export const dataProvider = createDataProvider(urqlClient, {
  create: {
    dataMapper: (response: OperationResult, params: CreateParams<any>) => {
      const key = `createOne${camelcase(singular(params.resource), {
        pascalCase: true,
      })}`;

      return response.data?.[key];
    },
    buildVariables: (params: CreateParams<any>) => {
      return {
        input: {
          [singular(params.resource)]:
            params.variables ?? params.meta?.gqlVariables,
        },
      };
    },
  },
  createMany: {
    dataMapper: (response: OperationResult, params: CreateManyParams<any>) => {
      const key = `createMany${camelcase(params.resource, {
        pascalCase: true,
      })}`;

      return response.data?.[key];
    },
    buildVariables: (params: CreateManyParams<any>) => {
      return {
        input: {
          [camelcase(params.resource)]:
            params.variables ?? params.meta?.gqlVariables,
        },
      };
    },
  },
  getOne: {
    dataMapper: (response: OperationResult, params: GetOneParams) => {
      const key = camelcase(singular(params.resource));

      return response.data?.[key];
    },
    buildVariables: (params: GetOneParams) => {
      return {
        id: params.id,
        ...params.meta?.gqlVariables,
      };
    },
    // Besides useOne hook, getOne hook is also consumed by `useForm`.
    // useForm hook has an optional gqlQuery field, we may only get `gqlMutation`.
    // For this reason, we need to convert mutation to query to get initial data on edit.
    convertMutationToQuery: (params: GetOneParams) => {
      const { resource, meta } = params;
      const gqlOperation = meta?.gqlQuery ?? meta?.gqlMutation;

      if (!gqlOperation) {
        throw new Error("Operation is required.");
      }

      const stringFields = getOperationFields(gqlOperation);

      const pascalCaseOperation = camelcase(singular(resource), {
        pascalCase: true,
      });

      const operation = camelcase(singular(resource));

      const query = gql`
        query Get${pascalCaseOperation}($id: ID!) {
          ${operation}(id: $id) {
            ${stringFields}
          }
        }
      `;

      return query;
    },
  },
  getList: {
    dataMapper: (response: OperationResult, params: GetListParams) => {
      return response.data?.[params.resource].nodes;
    },
    getTotalCount: (response: OperationResult, params: GetListParams) => {
      return response.data?.[params.resource].totalCount;
    },
    buildVariables: (params: GetListParams) => {
      return {
        sorting: buildSorters(params.sorters),
        filter: buildFilters(params.filters),
        paging: buildPagination(params.pagination),
        ...params.meta?.variables,
        ...params.meta?.gqlVariables,
      };
    },
  },
  getMany: {
    buildFilter: (params: GetManyParams) => {
      return { id: { in: params.ids }, ...params.meta?.gqlVariables };
    },
    dataMapper: (response: OperationResult, params: GetManyParams) => {
      const key = camelcase(params.resource);

      return response.data?.[key].nodes;
    },
  },
  update: {
    dataMapper: (response: OperationResult, params: UpdateParams<any>) => {
      const key = `updateOne${camelcase(singular(params.resource), {
        pascalCase: true,
      })}`;

      return response.data?.[key];
    },
    buildVariables: (params: UpdateParams<any>) => {
      return {
        input: {
          id: params.id,
          update: params.variables,
          ...params.meta?.gqlVariables,
        },
      };
    },
  },
  updateMany: {
    dataMapper: (
      _response: OperationResult,
      params: UpdateManyParams<any>
    ): any[] => {
      return params.ids.map((id) => ({ id }));
    },
    buildVariables: (params: UpdateManyParams<any>) => {
      const { ids, variables } = params;

      return {
        input: {
          filter: { id: { in: ids } },
          update: variables,
          ...params.meta?.gqlVariables,
        },
      };
    },
  },
  deleteOne: {
    dataMapper: (response: OperationResult, params: DeleteOneParams<any>) => {
      const pascalResource = camelcase(singular(params.resource), {
        pascalCase: true,
      });

      const key = `deleteOne${pascalResource}`;

      return response.data?.[key];
    },
    buildVariables: (params: DeleteOneParams<any>) => {
      return {
        input: { id: params.id, ...params.meta?.gqlVariables },
      };
    },
  },
  deleteMany: {
    dataMapper: (
      _response: OperationResult,
      params: DeleteManyParams<any>
    ): any[] => {
      return params.ids.map((id) => ({ id }));
    },
    buildVariables: (params: DeleteManyParams<any>) => {
      const { ids } = params;

      return {
        input: {
          filter: {
            id: { in: ids },
          },
          ...params.meta?.gqlVariables,
        },
      };
    },
  },
  custom: {
    dataMapper: (response: OperationResult, params: CustomParams) =>
      response.data ?? response.error?.message,
    buildVariables: (params: CustomParams) => ({
      ...params.meta?.variables,
      ...params.meta?.gqlVariables,
    }),
  },
});

export const buildSorters = (sorters: CrudSort[] = []) => {
  return sorters.map((s) => ({
    field: s.field,
    direction: s.order.toUpperCase(),
  }));
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

  return { [operatorMap[operator]]: value };
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

const getChildNodesField = (node: FieldNode): FieldNode | undefined => {
  return node.selectionSet?.selections.find(
    (node) => node.kind === "Field" && node.name.value === "nodes"
  ) as FieldNode;
};

export const getOperationFields = (documentNode: DocumentNode) => {
  const fieldLines: string[] = [];
  let isInitialEnter = true;
  let depth = 0;
  let isNestedField = false;

  visit(documentNode, {
    Field: {
      enter(node): SelectionSetNode | void {
        if (isInitialEnter) {
          isInitialEnter = false;

          const childNodesField = getChildNodesField(node);

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
        if (node.operation === "mutation") {
          isMutation = true;
        }
      },
    },
  });

  return isMutation;
};
