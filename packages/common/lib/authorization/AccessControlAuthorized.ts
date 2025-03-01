import { Err } from "ts-results-es";
import * as TypeGraphql from "type-graphql";

import { assertGlobalId } from "../api/scalars/GlobalId.js";
import { InvalidArgumentError } from "../error/index.js";
import type { Subject } from "./accessControl.js";
import {
  type AccessControlParam,
  addAclSummary,
} from "./AccessControlParam.js";

export function AccessControlAuthorized<
  S extends Exclude<Extract<Subject, string>, "all">,
>(
  action: AccessControlParam<S>[0],
  subjectOrMacro:
    | AccessControlParam<S>[1]
    | ["all"]
    | ["getId", S, string]
    | ["getIdFromRoot", S, string]
    | ["every", S],
  field: AccessControlParam<S>[2] = "."
): PropertyDecorator & MethodDecorator & ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!TypeGraphql.getMetadataStorage) {
    return () => undefined;
  }

  const fieldText = field === "." ? "" : field;

  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    target: Function | object,
    propertyKey?: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _descriptor?: TypedPropertyDescriptor<any>
  ) => {
    let subject: AccessControlParam<S>[1];
    let authDescription: string | undefined = undefined;

    if (Array.isArray(subjectOrMacro)) {
      // We need to add a util handler
      switch (subjectOrMacro[0]) {
        case "getId": {
          const kind = subjectOrMacro[1];
          const idField = subjectOrMacro[2];
          subject = (_: unknown, args: Record<string, unknown>) => {
            const id = assertGlobalId(args[idField]);
            return id.map(({ id }) => ({ id, kind }));
          };
          addAclSummary(
            target.constructor.name,
            String(propertyKey),
            action,
            `${kind}${fieldText}`,
            ` with an id of _args.${idField}_`
          );
          authDescription = `**${action}** any **${kind}${fieldText}** with an id of **args.${idField}**`;
          break;
        }
        case "getIdFromRoot": {
          const kind = subjectOrMacro[1];
          const idField = subjectOrMacro[2];
          subject = (
            _1: unknown,
            _2: unknown,
            root?: Record<string, unknown>
          ) => {
            if (root == null) {
              return Err(new InvalidArgumentError("Root is missing"));
            }
            const id = assertGlobalId(root[idField]);
            return id.map(({ id }) => ({ id, kind }));
          };
          addAclSummary(
            target.constructor.name,
            String(propertyKey),
            action,
            `${kind}${fieldText}`,
            ` with an id of root.${idField}`
          );
          authDescription = `**${action}** any **${kind}${fieldText}** with an id of **root.${idField}**`;
          break;
        }
        case "every": {
          const kind = subjectOrMacro[1];
          subject = { kind };
          addAclSummary(
            target.constructor.name,
            String(propertyKey),
            action,
            `every ${kind}${fieldText}`
          );

          authDescription =
            action === "create"
              ? `**${action} ${kind}${fieldText}s**`
              : `**${action}** **every ${kind}${fieldText}**`;

          break;
        }
        case "all": {
          subject = "all";
          addAclSummary(
            target.constructor.name,
            String(propertyKey),
            action,
            "all subjects"
          );
          authDescription = `**${action} everything**`;
          break;
        }
        default: {
          subjectOrMacro[0] satisfies never;
          throw new Error("Invalid macro");
        }
      }
    } else {
      subject = subjectOrMacro === "all" ? "all" : subjectOrMacro;
      addAclSummary(
        target.constructor.name,
        String(propertyKey),
        action,
        typeof subjectOrMacro === "function"
          ? `custom function (${fieldText}):\n\`\`\`js\n${String(subjectOrMacro)}\n\`\`\``
          : String(subjectOrMacro)
      );
      authDescription =
        typeof subjectOrMacro === "function"
          ? `[**custom subject function** (${fieldText})]`
          : String(subjectOrMacro);
    }

    const role: AccessControlParam<S> = [action, subject, field];

    const metadataStorage = TypeGraphql.getMetadataStorage();
    if (propertyKey == null) {
      metadataStorage.collectAuthorizedResolverMetadata({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        target: target as Function,
        roles: [role],
      });
    } else if (typeof propertyKey === "symbol") {
      throw new TypeGraphql.SymbolKeysNotSupportedError();
    } else {
      metadataStorage.collectAuthorizedFieldMetadata({
        target: target.constructor,
        fieldName: propertyKey,
        roles: [role],
      });

      let field:
        | (typeof metadataStorage)[
            | "queries"
            | "mutations"
            | "fields"
            | "fieldResolvers"][number]
        | undefined = metadataStorage.queries.find(
        (f) => f.target === target.constructor && f.methodName === propertyKey
      );
      let fieldType = "query";
      if (!field) {
        field = metadataStorage.mutations.find(
          (f) => f.target === target.constructor && f.methodName === propertyKey
        );
        fieldType = "mutation";
      }
      if (field) {
        field.returnTypeOptions.nullable = true;
      }
      if (!field) {
        field =
          metadataStorage.fieldResolvers.find(
            (f) =>
              f.target === target.constructor && f.methodName === propertyKey
          ) ??
          metadataStorage.fields.find(
            (f) => f.target === target.constructor && f.name === propertyKey
          );
        fieldType = "field";
        if (field) {
          if (field.typeOptions) {
            field.typeOptions.nullable = true;
          } else {
            field.typeOptions = { nullable: true };
          }
        }
      }

      if (field) {
        const fieldDescription = `This ${fieldType} is only accessible to users who are allowed to ${authDescription}.`;
        if (field.description) {
          field.description += `\n\n${fieldDescription}`;
        } else {
          field.description = fieldDescription;
        }
      }
    }
  };
}
