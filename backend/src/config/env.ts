import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
const jwtSecret = process.env.JWT_SECRET?.trim() ?? "krushi-secret";
const port = Number(process.env.PORT ?? "5000");
const nodeEnv = (process.env.NODE_ENV as "development" | "production" | "test" | undefined) ?? "development";

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

export const env = {
  databaseUrl,
  jwtSecret,
  port,
  nodeEnv,
};
