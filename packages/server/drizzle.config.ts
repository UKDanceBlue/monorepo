// import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/**/*.sql.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ["danceblue"],
  casing: "camelCase",
  introspect: {
    casing: "camel",
  },
  migrations: {
    schema: "danceblue",
  },
});
