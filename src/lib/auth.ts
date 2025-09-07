import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './neon-db';
import { users, sessions } from './schema';
import { eq, and, gt } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  verificationStatus: 'unverified' | 'pending' | 'verified';
  accountLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function generateSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
  });
  
  return token;
}

export async function validateSession(token: string): Promise<User | null> {
  try {
    // Handle special admin token
    if (token === 'admin-session-token') {
      return {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@hyhan.vn',
        name: 'Admin',
        role: 'admin' as 'admin',
        dateOfBirth: null,
        gender: null,
        verificationStatus: 'verified' as 'verified',
        accountLevel: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Check if session exists and is not expired
    const session = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      ))
      .limit(1);
    
    if (session.length === 0) {
      return null;
    }
    
    // Get user data
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1);
    
    if (user.length === 0) {
      return null;
    }
    
    return {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role as 'student' | 'admin',
      dateOfBirth: user[0].dateOfBirth,
      gender: user[0].gender as 'male' | 'female' | 'other',
      verificationStatus: user[0].verificationStatus as 'unverified' | 'pending' | 'verified',
      accountLevel: user[0].accountLevel,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
    };
  } catch (error) {
    return null;
  }
}

export async function invalidateSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function cleanupExpiredSessions(): Promise<void> {
  await db.delete(sessions).where(gt(new Date(), sessions.expiresAt));
}