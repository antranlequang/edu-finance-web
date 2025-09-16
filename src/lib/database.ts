import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  createdAt: Date;
  updatedAt: Date;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  accountLevel: number;
}

export interface EduscoreData {
  id: string;
  userId: string;
  score: number;
  reasoning: string;
  surveyData: {
    academicInfoGPA: number;
    major: string;
    majorSpecialization?: string;
    technicalSkills: string;
    programmingLanguages?: string;
    certifications?: string;
    languageSkills?: string;
    workExperience?: string;
    currentYear: string;
    university: string;
    extracurricularActivities?: string;
    awards?: string;
    familyIncome: string;
    dependents: number;
    valuableAssets?: string;
    medicalExpenses?: string;
    specialCircumstances?: string;
    aspirations?: string;
    careerGoals?: string;
  };
  documentUrls: {
    transcript: string | null;
    recommendationLetter: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationDocument {
  id: string;
  userId: string;
  type: 'transcript' | 'certificate' | 'recommendation' | 'score_report';
  name: string;
  fileUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: Date;
  createdAt: Date;
}

// User Profile Functions
export const createUserProfile = async (userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'verificationStatus' | 'accountLevel'>) => {
  try {
    const userRef = doc(db, 'users', userData.email);
    const profileData = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      verificationStatus: 'unverified' as const,
      accountLevel: 1
    };
    await setDoc(userRef, profileData);
    return {
      ...userData,
      id: userData.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationStatus: 'unverified' as const,
      accountLevel: 1
    } as UserProfile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (email: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        email: data.email,
        name: data.name,
        role: data.role,
        dateOfBirth: data.dateOfBirth?.toDate(),
        gender: data.gender,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        verificationStatus: data.verificationStatus,
        accountLevel: data.accountLevel || 1
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (email: string, updates: Partial<UserProfile>) => {
  try {
    const userRef = doc(db, 'users', email);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Eduscore Functions
export const saveEduscoreResult = async (userId: string, eduscoreData: Omit<EduscoreData, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const eduscoreRef = collection(db, 'eduscores');
    const docRef = await addDoc(eduscoreRef, {
      ...eduscoreData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Update user's account level based on score
    const accountLevel = calculateAccountLevel(eduscoreData.score);
    await updateUserProfile(userId, { accountLevel });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving eduscore result:', error);
    throw error;
  }
};

export const getEduscoreByUserId = async (userId: string): Promise<EduscoreData | null> => {
  try {
    const q = query(
      collection(db, 'eduscores'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnap = await getDocs(q);
    
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        score: data.score,
        reasoning: data.reasoning,
        surveyData: data.surveyData,
        documentUrls: data.documentUrls,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting eduscore:', error);
    throw error;
  }
};

export const getEduscoreHistoryByUserId = async (userId: string): Promise<EduscoreData[]> => {
  try {
    const q = query(
      collection(db, 'eduscores'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnap = await getDocs(q);

    return querySnap.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        userId: data.userId,
        score: data.score,
        reasoning: data.reasoning,
        surveyData: data.surveyData,
        documentUrls: data.documentUrls,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as EduscoreData;
    });
  } catch (error) {
    console.error('Error getting eduscore history:', error);
    throw error;
  }
};

// Document Verification Functions
export const uploadVerificationDocument = async (
  userId: string, 
  file: File, 
  documentType: VerificationDocument['type']
): Promise<string> => {
  try {
    const fileRef = ref(storage, `verification-docs/${userId}/${documentType}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Save document record
    const docRef = collection(db, 'verification-documents');
    await addDoc(docRef, {
      userId,
      type: documentType,
      name: file.name,
      fileUrl: downloadURL,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading verification document:', error);
    throw error;
  }
};

export const getVerificationDocuments = async (userId: string): Promise<VerificationDocument[]> => {
  try {
    const q = query(
      collection(db, 'verification-documents'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnap = await getDocs(q);
    
    return querySnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        type: data.type,
        name: data.name,
        fileUrl: data.fileUrl,
        status: data.status,
        verifiedBy: data.verifiedBy,
        verifiedAt: data.verifiedAt?.toDate(),
        createdAt: data.createdAt?.toDate()
      };
    });
  } catch (error) {
    console.error('Error getting verification documents:', error);
    throw error;
  }
};

export const updateVerificationStatus = async (
  documentId: string, 
  status: 'verified' | 'rejected', 
  verifiedBy: string
) => {
  try {
    const docRef = doc(db, 'verification-documents', documentId);
    await updateDoc(docRef, {
      status,
      verifiedBy,
      verifiedAt: serverTimestamp()
    });
    
    // If verified, update user's verification status
    if (status === 'verified') {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userId = docSnap.data().userId;
        await updateUserProfile(userId, { verificationStatus: 'verified' });
      }
    }
  } catch (error) {
    console.error('Error updating verification status:', error);
    throw error;
  }
};

// Admin Functions
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, 'users');
    const querySnap = await getDocs(usersRef);
    
    return querySnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        name: data.name,
        role: data.role,
        dateOfBirth: data.dateOfBirth?.toDate(),
        gender: data.gender,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        verificationStatus: data.verificationStatus,
        accountLevel: data.accountLevel || 1
      };
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const usersRef = collection(db, 'users');
    const usersSnap = await getDocs(usersRef);
    
    const verifiedCount = usersSnap.docs.filter(doc => 
      doc.data().verificationStatus === 'verified'
    ).length;
    
    const pendingCount = usersSnap.docs.filter(doc => 
      doc.data().verificationStatus === 'pending'
    ).length;
    
    return {
      totalUsers: usersSnap.size,
      verifiedUsers: verifiedCount,
      pendingVerification: pendingCount,
      unverifiedUsers: usersSnap.size - verifiedCount - pendingCount
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    throw error;
  }
};

// Utility Functions
const calculateAccountLevel = (eduscore: number): number => {
  if (eduscore >= 90) return 5; // Platinum
  if (eduscore >= 80) return 4; // Gold
  if (eduscore >= 70) return 3; // Silver
  if (eduscore >= 60) return 2; // Bronze
  return 1; // Basic
};

export const getAccountLevelName = (level: number): string => {
  const levels = {
    1: 'Basic',
    2: 'Bronze',
    3: 'Silver',
    4: 'Gold',
    5: 'Platinum'
  };
  return levels[level as keyof typeof levels] || 'Basic';
};