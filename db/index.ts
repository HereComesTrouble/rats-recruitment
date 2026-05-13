import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ?? "postgres://build:build@localhost:5432/build";

const client = neon(connectionString);

export const db = drizzle(client, { schema });
export { schema };
