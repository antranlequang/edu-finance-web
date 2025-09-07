import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // load từ .env.local
dotenv.config(); // fallback sang .env

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env.local or .env");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});