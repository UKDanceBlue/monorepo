export interface StandingType {
  id: string;
  name: string;
  points: number;
  highlighted: boolean;
}

export function isStandingType(standing?: object): standing is StandingType {
  // If standing is nullish, return false
  if (standing == null) {
    return false;
  }

  // If id is not defined, return false
  const { id } = standing as Partial<StandingType>;
  if (id == null) {
    return false;
  } else if (typeof id !== "string") {
    return false;
  } else if (id.length === 0) {
    return false;
  }

  // If name is not defined, return false
  const { name } = standing as Partial<StandingType>;
  if (name == null) {
    return false;
  } else if (typeof name !== "string") {
    return false;
  } else if (name.length === 0) {
    return false;
  }

  // If points is not defined, return false
  const { points } = standing as Partial<StandingType>;
  if (points == null) {
    return false;
  } else if (typeof points !== "number") {
    return false;
  } else if (points < 0) {
    return false;
  }

  // If highlighted is not defined, return false
  const { highlighted } = standing as Partial<StandingType>;
  if (highlighted == null) {
    return false;
  } else if (typeof highlighted !== "boolean") {
    return false;
  }

  // If all checks pass, return true
  return true;
}
