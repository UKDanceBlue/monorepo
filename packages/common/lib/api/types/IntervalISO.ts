import { DateTimeISOResolver } from "graphql-scalars";
import { DateTime, Interval } from "luxon";
import { Field, ObjectType } from "type-graphql";

import { dateTimeFromSomething } from "../../utility/time/intervalTools.js";

@ObjectType()
export class IntervalISO {
  @Field(() => DateTimeISOResolver)
  start!: Date;
  get startDateTime(): DateTime {
    return dateTimeFromSomething(this.start);
  }

  @Field(() => DateTimeISOResolver)
  end!: Date;
  get endDateTime(): DateTime {
    return dateTimeFromSomething(this.end);
  }

  get interval(): Interval {
    return Interval.fromDateTimes(this.startDateTime, this.endDateTime);
  }

  @Field(() => String)
  iso8601(): string {
    return this.interval.toISO();
  }

  @Field(() => String, { nullable: true })
  duration(): string | null {
    return this.interval.toDuration().toISO();
  }

  @Field(() => Boolean)
  isEmpty(): boolean {
    return this.interval.isEmpty();
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
