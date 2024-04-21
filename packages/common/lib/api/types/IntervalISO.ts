import { DateTimeISOResolver } from "graphql-scalars";
import { DateTime, Interval } from "luxon";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class IntervalISO {
  @Field(() => DateTimeISOResolver)
  readonly start!: Date;
  @Field(() => DateTimeISOResolver)
  readonly end!: Date;

  get interval(): Interval {
    return Interval.fromDateTimes(
      DateTime.fromJSDate(this.start),
      DateTime.fromJSDate(this.end)
    );
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
}
