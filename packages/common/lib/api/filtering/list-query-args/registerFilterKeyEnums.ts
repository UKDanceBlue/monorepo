import { registerEnumType } from "type-graphql";

export function registerFilterKeyEnums<
  AllKeys extends string,
  StringFilterKeys extends AllKeys,
  OneOfFilterKeys extends AllKeys,
  NumericFilterKeys extends AllKeys,
  DateFilterKeys extends AllKeys,
  BooleanFilterKeys extends AllKeys,
>(
  allKeys: AllKeys[],
  resolverName: string,
  stringFilterKeys: StringFilterKeys[],
  oneOfFilterKeys: OneOfFilterKeys[],
  numericFilterKeys: NumericFilterKeys[],
  dateFilterKeys: DateFilterKeys[],
  booleanFilterKeys: BooleanFilterKeys[]
) {
  const AllKeysEnum = Object.fromEntries(allKeys.map((key) => [key, key])) as {
    [key in AllKeys]: key;
  };
  if (allKeys.length > 0) {
    registerEnumType(AllKeysEnum, { name: `${resolverName}AllKeys` });
  }

  const StringFilterKeysEnum = Object.fromEntries(
    stringFilterKeys.map((key) => [key, key])
  ) as {
    [key in StringFilterKeys]: key;
  };
  if (stringFilterKeys.length > 0) {
    registerEnumType(StringFilterKeysEnum, {
      name: `${resolverName}StringFilterKeys`,
    });
  }

  const OneOfFilterKeysEnum = Object.fromEntries(
    oneOfFilterKeys.map((key) => [key, key])
  ) as {
    [key in OneOfFilterKeys]: key;
  };
  if (oneOfFilterKeys.length > 0) {
    registerEnumType(OneOfFilterKeysEnum, {
      name: `${resolverName}OneOfFilterKeys`,
    });
  }

  const NumericFilterKeysEnum = Object.fromEntries(
    numericFilterKeys.map((key) => [key, key])
  ) as {
    [key in NumericFilterKeys]: key;
  };
  if (numericFilterKeys.length > 0) {
    registerEnumType(NumericFilterKeysEnum, {
      name: `${resolverName}NumericFilterKeys`,
    });
  }

  const DateFilterKeysEnum = Object.fromEntries(
    dateFilterKeys.map((key) => [key, key])
  ) as {
    [key in DateFilterKeys]: key;
  };
  if (dateFilterKeys.length > 0) {
    registerEnumType(DateFilterKeysEnum, {
      name: `${resolverName}DateFilterKeys`,
    });
  }

  const BooleanFilterKeysEnum = Object.fromEntries(
    booleanFilterKeys.map((key) => [key, key])
  ) as {
    [key in BooleanFilterKeys]: key;
  };
  if (booleanFilterKeys.length > 0) {
    registerEnumType(BooleanFilterKeysEnum, {
      name: `${resolverName}BooleanFilterKeys`,
    });
  }
  return {
    StringFilterKeysEnum,
    OneOfFilterKeysEnum,
    NumericFilterKeysEnum,
    DateFilterKeysEnum,
    BooleanFilterKeysEnum,
    AllKeysEnum,
  };
}
