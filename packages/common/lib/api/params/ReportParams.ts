import { GraphQLDateTimeISO, GraphQLNonEmptyString } from "graphql-scalars";
import { ArgsType, Field, ObjectType } from "type-graphql";

import { Primitive } from "../../utility/primitive/TypeUtils.js";

@ObjectType()
export class ReportPage {
  @Field(() => GraphQLNonEmptyString)
  title!: string;

  @Field(() => [String])
  header!: string[];

  @Field(() => [[String]])
  rows!: string[][];

  static newEmpty(title: string): ReportPage {
    const page = new ReportPage();
    page.title = title;
    page.header = [];
    page.rows = [];
    return page;
  }

  static fromJson<K extends string>(
    title: string,
    keys: K[],
    data: Record<K, Primitive>[]
  ): ReportPage {
    const page = ReportPage.newEmpty(title);
    page.header = keys;
    page.rows = data.map((row) =>
      keys.map((key) => (row[key] != null ? String(row[key]) : ""))
    );
    return page;
  }
}

@ObjectType()
export class Report {
  @Field(() => [ReportPage])
  pages!: ReportPage[];

  static newEmpty(): Report {
    const report = new Report();
    report.pages = [];
    return report;
  }

  static fromJson<K extends string>(
    keys: K[],
    data: { data: Record<K, Primitive>[]; title: string }[]
  ): Report {
    const report = Report.newEmpty();
    report.pages = data.map(({ data, title }) =>
      ReportPage.fromJson(title, keys, data)
    );
    return report;
  }
}

@ArgsType()
export class ReportArgs {
  @Field(() => GraphQLDateTimeISO, { nullable: true })
  from?: Date | null | undefined;

  @Field(() => GraphQLDateTimeISO, { nullable: true })
  to?: Date | null | undefined;

  @Field(() => GraphQLNonEmptyString)
  report!: string;
}
