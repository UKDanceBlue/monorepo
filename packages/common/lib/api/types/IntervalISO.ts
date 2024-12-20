import { GraphQLDateTimeISO } from "graphql-scalars";
import { DateTime, Interval } from "luxon";
import { Field, InputType, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";

@ObjectType()
@InputType("IntervalISOInput")
export class IntervalISO {
  @Field(() => GraphQLDateTimeISO)
  start!: Date;
  get startDateTime(): DateTime {
    return dateTimeFromSomething(this.start);
  }

  @Field(() => GraphQLDateTimeISO)
  end!: Date;
  get endDateTime(): DateTime {
    return dateTimeFromSomething(this.end);
  }

  get interval(): Interval {
    return Interval.fromDateTimes(this.startDateTime, this.endDateTime);
  }

  static init(start: Date, end: Date): IntervalISO {
    const self = new IntervalISO();
    self.start = start;
    self.end = end;
    return self;
  }

  static fromDateTimes(start: DateTime, end: DateTime): IntervalISO {
    return this.init(start.toJSDate(), end.toJSDate());
  }

  static fromInterval(interval: Interval<true>): IntervalISO {
    return this.fromDateTimes(interval.start, interval.end);
  }
}
