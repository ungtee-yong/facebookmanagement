import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var __db: PrismaClient | undefined;
  var __pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = global.__pgPool ?? new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const db = global.__db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.__db = db;
  global.__pgPool = pool;
}
