import { DateTime, Interval } from "luxon";
import { Field, InputType, ObjectType } from "type-graphql";

import { DateTimeScalar } from "../scalars/DateTimeISO.js";
import {
  IsAfterDateTime,
  IsBeforeDateTime,
} from "../validation/beforeAfter.js";

@ObjectType()
@InputType("IntervalISOInput")
export class IntervalISO {
  @IsBeforeDateTime("end", true)
  @Field(() => DateTimeScalar, { nullable: false })
  start!: DateTime;

  @IsAfterDateTime("start", true)
  @Field(() => DateTimeScalar, { nullable: false })
  end!: DateTime;

  get interval(): Interval {
    return Interval.fromDateTimes(this.start, this.end);
  }

  static init(start: DateTime, end: DateTime): IntervalISO {
    const self = new IntervalISO();
    self.start = start;
    self.end = end;
    return self;
  }

  static fromInterval(interval: Interval<true>): IntervalISO {
    return this.init(interval.start, interval.end);
  }
}
