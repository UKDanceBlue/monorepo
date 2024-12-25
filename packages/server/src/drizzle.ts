import { Container } from "@freshgum/typedi";
import { drizzle } from "drizzle-orm/node-postgres";

import { drizzleToken } from "#lib/typediTokens.js";
import { sqlLogger } from "#logging/sqlLogging.js";
import * as core from "#schema/core.sql.js";
import * as enums from "#schema/enums.sql.js";
import * as fields from "#schema/fields.sql.js";
import * as tablesAudit from "#schema/tables/audit.sql.js";
import * as tablesDevice from "#schema/tables/device.sql.js";
import * as tablesEvent from "#schema/tables/event.sql.js";
import * as tablesFeed from "#schema/tables/feed.sql.js";
import * as tablesFile from "#schema/tables/file.sql.js";
import * as tablesFundraisingDbFunds from "#schema/tables/fundraising/dbFunds.sql.js";
import * as tablesFundraisingDdn from "#schema/tables/fundraising/ddn.sql.js";
import * as tablesFundraisingEntry from "#schema/tables/fundraising/entry.sql.js";
import * as tablesMarathon from "#schema/tables/marathon.sql.js";
import * as tablesMisc from "#schema/tables/misc.sql.js";
import * as tablesNotification from "#schema/tables/notification.sql.js";
import * as tablesPerson from "#schema/tables/person.sql.js";
import * as tablesPoints from "#schema/tables/points.sql.js";
import * as tablesTeam from "#schema/tables/team.sql.js";
import * as types from "#schema/types.sql.js";
import * as views from "#schema/views.sql.js";

export const schema = {
  ...views,
  ...types,
  ...tablesTeam,
  ...tablesPoints,
  ...tablesPerson,
  ...tablesNotification,
  ...tablesMisc,
  ...tablesMarathon,
  ...tablesFundraisingEntry,
  ...tablesFundraisingDdn,
  ...tablesFundraisingDbFunds,
  ...tablesFile,
  ...tablesFeed,
  ...tablesEvent,
  ...tablesDevice,
  ...tablesAudit,
  ...fields,
  ...enums,
  ...core,
};

const db = drizzle(process.env.DATABASE_URL!, {
  schema,
  logger: {
    logQuery(query, params) {
      sqlLogger.sql(query, { params });
    },
  },
});

export type Drizzle = typeof db;
Container.setValue(drizzleToken, db);

// console.log(await db.select().from(views.fundraisingEntryWithMeta).limit(4));

db.$client.addListener("error", (e: Error) => {
  sqlLogger.error(e);
});

db.$client.addListener("notice", (msg: string) => {
  sqlLogger.info(String(msg));
});
