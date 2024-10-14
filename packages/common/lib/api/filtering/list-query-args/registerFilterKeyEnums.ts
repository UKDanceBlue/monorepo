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
  const allKeysSet = new Set<string>(allKeys);

  function register<K extends AllKeys>(keys: K[], typeName: string) {
    const FilterKeysEnum: {
      [key in K]: key;
    } = {} as {
      [key in K]: key;
    };
    if (keys.length > 0) {
      for (const key of keys) {
        if (!allKeysSet.has(key)) {
          throw new Error(`${typeName} filter key ${key} not in all keys`);
        }
        FilterKeysEnum[key] = key;
      }
      registerEnumType(FilterKeysEnum, {
        name: `${resolverName}${typeName}FilterKeys`,
      });
    }
    return FilterKeysEnum;
  }

  return {
    StringFilterKeysEnum: register(stringFilterKeys, "String"),
    OneOfFilterKeysEnum: register(oneOfFilterKeys, "OneOf"),
    NumericFilterKeysEnum: register(numericFilterKeys, "Numeric"),
    DateFilterKeysEnum: register(dateFilterKeys, "Date"),
    BooleanFilterKeysEnum: register(booleanFilterKeys, "Boolean"),
    AllKeysEnum,
  };
}
