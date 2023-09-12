export type HourInstructionsType = string | (string | string[])[];

export interface SpecialComponentType {
  id: string;
  uniqueOptions: Record<string, string>;
}

export function isSpecialComponentType(specialComponent?: object): specialComponent is SpecialComponentType {
  // If specialComponent is nullish, return false
  if (specialComponent == null) {
    return false;
  }

  // If id is not defined, return false
  const { id } = specialComponent as Partial<SpecialComponentType>;
  if (id == null) {
    return false;
  } else if (typeof id !== "string") {
    return false;
  } else if (id.length === 0) {
    return false;
  }

  // If uniqueOptions is not defined, return false
  const { uniqueOptions } = specialComponent as Partial<SpecialComponentType>;
  if (uniqueOptions == null) {
    return false;
  } else if (typeof uniqueOptions !== "object") {
    return false;
  } else if (Object.keys(uniqueOptions).length === 0) {
    return false;
  }

  // If all checks pass, return true
  return true;
}
