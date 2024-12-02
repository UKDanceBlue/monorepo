import type {
  BooleanFilterItemInterface,
  DateFilterItemInterface,
  FilterItem as FilterItemInterface,
  IsNullFilterItemInterface,
  NumericFilterItemInterface,
  OneOfFilterItemInterface,
  StringFilterItemInterface,
} from "@ukdanceblue/common";
import { DateTimeISOResolver, VoidResolver } from "graphql-scalars";
import { Field, InputType } from "type-graphql";

import type { Comparator } from "../ListQueryTypes.js";
import {
  IsComparator,
  NumericComparator,
  StringComparator,
} from "../ListQueryTypes.js";

@InputType()
export abstract class FilterItem<Field extends string, V>
  implements FilterItemInterface<Field, V>
{
  @Field(() => String, { description: "The field to filter on" })
  field!: Field;

  value!: V;

  comparison!: Comparator;

  /**
   * Should the comparator be negated?
   * WARNING: This will throw if used on a comparator that does not support negation.
   * @default false
   */
  @Field(() => Boolean, {
    description:
      "Should the comparator be negated? WARNING: This will throw if used on a comparator that does not support negation.",
    defaultValue: false,
    nullable: true,
  })
  negate?: boolean;
}

@InputType()
export abstract class AbstractStringFilterItem<Field extends string>
  extends FilterItem<Field, string>
  implements StringFilterItemInterface<Field>
{
  @Field(() => String)
  value!: string;

  @Field(() => StringComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: StringComparator;
}

export function StringFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class StringFilterItem extends AbstractStringFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return StringFilterItem;
}

@InputType()
export abstract class AbstractNumericFilterItem<Field extends string>
  extends FilterItem<Field, number>
  implements NumericFilterItemInterface<Field>
{
  @Field(() => Number)
  value!: number;

  @Field(() => NumericComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: NumericComparator;
}

export function NumericFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class NumericFilterItem extends AbstractNumericFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return NumericFilterItem;
}

@InputType()
export abstract class AbstractDateFilterItem<Field extends string>
  extends FilterItem<Field, string>
  implements DateFilterItemInterface<Field>
{
  @Field(() => DateTimeISOResolver)
  value!: string;

  @Field(() => NumericComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: NumericComparator;
}

export function DateFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class DateFilterItem extends AbstractDateFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return DateFilterItem;
}

@InputType()
export abstract class AbstractBooleanFilterItem<Field extends string>
  extends FilterItem<Field, boolean>
  implements BooleanFilterItemInterface<Field>
{
  @Field(() => Boolean)
  value!: boolean;

  @Field(() => IsComparator, {
    description: "The comparator to use for the filter",
  })
  comparison!: IsComparator;
}

export function BooleanFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class BooleanFilterItem extends AbstractBooleanFilterItem<Field> {
    @Field(() => fieldEnum, {
      description: "The field to filter on",
    })
    field!: Field;
  }

  return BooleanFilterItem;
}

@InputType()
export abstract class AbstractOneOfFilterItem<
    Field extends string,
    ValueEnum extends string = string,
  >
  extends FilterItem<Field, ValueEnum[]>
  implements OneOfFilterItemInterface<Field>
{
  @Field(() => [String])
  value!: ValueEnum[];

  comparison!: never;
}

export function OneOfFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class OneOfFilterItem extends AbstractOneOfFilterItem<Field> {
    @Field(
      () => (Object.keys(fieldEnum).length > 0 ? fieldEnum : VoidResolver),
      { description: "The field to filter on" }
    )
    field!: Field;
  }

  return OneOfFilterItem;
}

@InputType()
export abstract class AbstractIsNullFilterItem<Field extends string>
  extends FilterItem<Field, null>
  implements IsNullFilterItemInterface<Field>
{
  value!: never;
  comparison!: never;
}

export function IsNullFilterItem<Field extends string>(fieldEnum: {
  [key in Field]: key;
}) {
  @InputType()
  abstract class IsNullFilterItem extends AbstractIsNullFilterItem<Field> {
    @Field(() => fieldEnum, { description: "The field to filter on" })
    field!: Field;
  }

  return IsNullFilterItem;
}
