import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Check if DATABASE_URL is provided
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Database operations will fail.');
}

// Create the connection only if DATABASE_URL is available
let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

if (databaseUrl) {
  try {
    const sql = neon(databaseUrl);
    db = drizzle(sql, { schema });
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
  }
}

// Export the database instance or null
export { db };

// Helper function to check if database is available
export function isDatabaseAvailable(): boolean {
  return db !== null;
}