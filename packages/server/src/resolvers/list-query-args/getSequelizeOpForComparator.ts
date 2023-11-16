import { Op } from "@sequelize/core";
import { Comparator } from "@ukdanceblue/common";

export function getSequelizeOpForComparator(
  comparator: Comparator,
  negated: boolean = false
): (typeof Op)[keyof typeof Op] {
  switch (comparator) {
    case Comparator.EQUALS: {
      return negated ? Op.ne : Op.eq;
    }
    case Comparator.GREATER_THAN: {
      return negated ? Op.lte : Op.gt;
    }
    case Comparator.GREATER_THAN_OR_EQUAL_TO: {
      return negated ? Op.lt : Op.gte;
    }
    case Comparator.LESS_THAN: {
      return negated ? Op.gte : Op.lt;
    }
    case Comparator.LESS_THAN_OR_EQUAL_TO: {
      return negated ? Op.gt : Op.lte;
    }
    case Comparator.SUBSTRING: {
      return negated ? Op.notSubstring : Op.substring;
    }
    case Comparator.LIKE: {
      return negated ? Op.notLike : Op.like;
    }
    case Comparator.ILIKE: {
      return negated ? Op.notLike : Op.like;
    }
    case Comparator.REGEX: {
      return negated ? Op.notRegexp : Op.regexp;
    }
    case Comparator.IREGEX: {
      return negated ? Op.notIRegexp : Op.iRegexp;
    }
    case Comparator.STARTS_WITH: {
      return negated ? Op.notLike : Op.startsWith;
    }
    case Comparator.ENDS_WITH: {
      return negated ? Op.notLike : Op.endsWith;
    }
    case Comparator.IS: {
      return negated ? Op.not : Op.is;
    }
    default: {
      throw new Error(`Unknown comparator: ${String(comparator)}`);
    }
  }
}
