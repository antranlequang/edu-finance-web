import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create the connection
const sql = neon(process.env.DATABASE_URL!);

// Create the drizzle instance
export const db = drizzle(sql, { schema });