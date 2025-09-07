import { db } from './neon-db';
import { users, eduscores, verificationDocuments } from './schema';
import { eq, desc, and } from 'drizzle-orm';
import { hashPassword } from './auth';

export interface UserProfile {
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

export interface EduscoreData {
  id: string;
  userId: string;
  score: number;
  reasoning: string;
  surveyData: any;
  documentUrls: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  type: string;
  name: string;
  fileUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

// User Profile Functions
export async function createUserProfile(userData: {
  email: string;
  name: string;
  password: string;
  role?: 'student' | 'admin';
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
}): Promise<UserProfile> {
  try {
    const passwordHash = await hashPassword(userData.password);
    
    const result = await db.insert(users).values({
      email: userData.email,
      name: userData.name,
      passwordHash,
      role: userData.role || (userData.email === 'admin@hyhan.vn' ? 'admin' : 'student'),
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
    }).returning();
    
    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'admin',
      dateOfBirth: user.dateOfBirth,
      gender: user.gender as 'male' | 'female' | 'other',
      verificationStatus: user.verificationStatus as 'unverified' | 'pending' | 'verified',
      accountLevel: user.accountLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'admin',
      dateOfBirth: user.dateOfBirth,
      gender: user.gender as 'male' | 'female' | 'other',
      verificationStatus: user.verificationStatus as 'unverified' | 'pending' | 'verified',
      accountLevel: user.accountLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    const user = result[0];
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'admin',
      dateOfBirth: user.dateOfBirth,
      gender: user.gender as 'male' | 'female' | 'other',
      verificationStatus: user.verificationStatus as 'unverified' | 'pending' | 'verified',
      accountLevel: user.accountLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// EDUSCORE Functions
export async function saveEduscoreResult(eduscoreData: {
  userId: string;
  score: number;
  reasoning: string;
  surveyData: any;
  documentUrls: any;
}): Promise<string> {
  try {
    const result = await db.insert(eduscores).values(eduscoreData).returning();
    
    // Update user's account level based on score
    const accountLevel = calculateAccountLevel(eduscoreData.score);
    await updateUserProfile(eduscoreData.userId, { accountLevel });
    
    return result[0].id;
  } catch (error) {
    console.error('Error saving EDUSCORE result:', error);
    throw error;
  }
}

export async function getEduscoreByUserId(userId: string): Promise<EduscoreData | null> {
  try {
    const result = await db
      .select()
      .from(eduscores)
      .where(eq(eduscores.userId, userId))
      .orderBy(desc(eduscores.createdAt))
      .limit(1);
    
    if (result.length === 0) {
      return null;
    }
    
    const record = result[0];
    return {
      id: record.id,
      userId: record.userId,
      score: record.score,
      reasoning: record.reasoning,
      surveyData: record.surveyData,
      documentUrls: record.documentUrls,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  } catch (error) {
    console.error('Error getting EDUSCORE:', error);
    throw error;
  }
}

// Verification Document Functions
export async function createVerificationDocument(docData: {
  userId: string;
  type: string;
  name: string;
  fileUrl: string;
}): Promise<string> {
  try {
    const result = await db.insert(verificationDocuments).values(docData).returning();
    return result[0].id;
  } catch (error) {
    console.error('Error creating verification document:', error);
    throw error;
  }
}

export async function getVerificationDocuments(userId: string): Promise<VerificationDocument[]> {
  try {
    const result = await db
      .select()
      .from(verificationDocuments)
      .where(eq(verificationDocuments.userId, userId))
      .orderBy(desc(verificationDocuments.createdAt));
    
    return result.map(doc => ({
      id: doc.id,
      userId: doc.userId,
      type: doc.type,
      name: doc.name,
      fileUrl: doc.fileUrl,
      status: doc.status as 'pending' | 'verified' | 'rejected',
      verifiedBy: doc.verifiedBy,
      verifiedAt: doc.verifiedAt,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error('Error getting verification documents:', error);
    throw error;
  }
}

export async function getPendingVerificationDocuments(): Promise<VerificationDocument[]> {
  try {
    const result = await db
      .select()
      .from(verificationDocuments)
      .where(eq(verificationDocuments.status, 'pending'))
      .orderBy(desc(verificationDocuments.createdAt));
    
    return result.map(doc => ({
      id: doc.id,
      userId: doc.userId,
      type: doc.type,
      name: doc.name,
      fileUrl: doc.fileUrl,
      status: doc.status as 'pending' | 'verified' | 'rejected',
      verifiedBy: doc.verifiedBy,
      verifiedAt: doc.verifiedAt,
      createdAt: doc.createdAt,
    }));
  } catch (error) {
    console.error('Error getting pending verification documents:', error);
    throw error;
  }
}

export async function updateVerificationStatus(
  documentId: string, 
  status: 'verified' | 'rejected', 
  verifiedBy: string
): Promise<void> {
  try {
    await db
      .update(verificationDocuments)
      .set({
        status,
        verifiedBy,
        verifiedAt: new Date(),
      })
      .where(eq(verificationDocuments.id, documentId));
    
    // If verified, update user's verification status
    if (status === 'verified') {
      const doc = await db
        .select()
        .from(verificationDocuments)
        .where(eq(verificationDocuments.id, documentId))
        .limit(1);
      
      if (doc.length > 0) {
        await updateUserProfile(doc[0].userId, { 
          verificationStatus: 'verified' 
        });
      }
    }
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw error;
  }
}

// Admin Functions
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const result = await db
      .select()
      .from(users)
      .orderBy(desc(users.createdAt));
    
    return result.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'student' | 'admin',
      dateOfBirth: user.dateOfBirth,
      gender: user.gender as 'male' | 'female' | 'other',
      verificationStatus: user.verificationStatus as 'unverified' | 'pending' | 'verified',
      accountLevel: user.accountLevel,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

export async function getUserStats() {
  try {
    const allUsers = await getAllUsers();
    
    const verifiedCount = allUsers.filter(user => user.verificationStatus === 'verified').length;
    const pendingCount = allUsers.filter(user => user.verificationStatus === 'pending').length;
    
    return {
      totalUsers: allUsers.length,
      verifiedUsers: verifiedCount,
      pendingVerification: pendingCount,
      unverifiedUsers: allUsers.length - verifiedCount - pendingCount,
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
}

// Utility Functions
function calculateAccountLevel(eduscore: number): number {
  if (eduscore >= 90) return 5; // Platinum
  if (eduscore >= 80) return 4; // Gold
  if (eduscore >= 70) return 3; // Silver
  if (eduscore >= 60) return 2; // Bronze
  return 1; // Basic
}

export function getAccountLevelName(level: number): string {
  const levels = {
    1: 'Basic',
    2: 'Bronze',
    3: 'Silver',
    4: 'Gold',
    5: 'Platinum'
  };
  return levels[level as keyof typeof levels] || 'Basic';
}

// Authentication helpers for password verification
export async function getUserForLogin(email: string): Promise<{ id: string; passwordHash: string } | null> {
  try {
    const result = await db
      .select({
        id: users.id,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error getting user for login:', error);
    throw error;
  }
}