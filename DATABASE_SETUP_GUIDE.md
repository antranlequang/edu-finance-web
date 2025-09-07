# Database Storage System Setup Guide

## Overview

This guide documents the complete database storage system implementation for the EduGuideAI platform, including user account management, EDUSCORE survey data storage, document verification, and admin functionality.

## Technologies Used

### Core Storage Technologies
- **Firebase Firestore**: NoSQL database for storing user profiles, survey data, and verification records
- **Firebase Storage**: File storage for document uploads (transcripts, certificates, etc.)
- **Firebase Authentication**: User authentication and session management

### Supporting Technologies
- **React Hook Form + Zod**: Form validation and data handling
- **TypeScript**: Type safety for database operations
- **Next.js**: Full-stack framework with server-side capabilities

## Database Schema

### Collections Structure

#### 1. `users` Collection
```typescript
interface UserProfile {
  id: string;                    // Document ID (email)
  email: string;                 // User email (unique)
  name: string;                  // Full name
  role: 'student' | 'admin';     // User role
  dateOfBirth?: Date;            // Optional birth date
  gender?: 'male' | 'female' | 'other'; // Optional gender
  createdAt: Date;               // Account creation timestamp
  updatedAt: Date;               // Last update timestamp
  verificationStatus: 'unverified' | 'pending' | 'verified'; // Verification state
  accountLevel: number;          // 1-5 (Basic, Bronze, Silver, Gold, Platinum)
}
```

#### 2. `eduscores` Collection
```typescript
interface EduscoreData {
  id: string;                    // Auto-generated document ID
  userId: string;                // Reference to user (email)
  score: number;                 // EDUSCORE result (0-100)
  reasoning: string;             // AI evaluation reasoning
  surveyData: {                  // Complete survey responses
    academicInfoGPA: number;
    extracurricularActivities: string;
    awards: string;
    familyIncome: string;
    dependents: number;
    valuableAssets: string;
    medicalExpenses: string;
    specialCircumstances: string;
    aspirations: string;
  };
  documentUrls: {                // Links to uploaded files
    transcript: string;
    recommendationLetter: string;
  };
  createdAt: Date;               // Survey completion date
  updatedAt: Date;               // Last modification date
}
```

#### 3. `verification-documents` Collection
```typescript
interface VerificationDocument {
  id: string;                    // Auto-generated document ID
  userId: string;                // Reference to user (email)
  type: 'transcript' | 'certificate' | 'recommendation' | 'score_report';
  name: string;                  // Original filename
  fileUrl: string;               // Firebase Storage download URL
  status: 'pending' | 'verified' | 'rejected'; // Verification state
  verifiedBy?: string;           // Admin who verified (optional)
  verifiedAt?: Date;             // Verification timestamp (optional)
  createdAt: Date;               // Upload timestamp
}
```

## Setup Instructions

### 1. Firebase Project Configuration

#### Prerequisites
- Firebase project created at https://console.firebase.google.com/
- Firestore and Storage enabled in Firebase console

#### Environment Variables
Create/update `.env.local` with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
```

### 2. Firestore Database Setup

#### Security Rules
Configure Firestore rules in Firebase console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.token.email)) &&
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    // EDUSCORE data - users can read/write their own, admins can read all
    match /eduscores/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == resource.data.userId;
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.token.email)) &&
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
    
    // Verification documents - users can read/write their own, admins can read/write all
    match /verification-documents/{docId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == resource.data.userId;
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.token.email)) &&
        get(/databases/$(database)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
  }
}
```

#### Storage Rules
Configure Firebase Storage rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /verification-docs/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.token.email == userId;
      allow read, write: if request.auth != null && 
        firestore.exists(/databases/(default)/documents/users/$(request.auth.token.email)) &&
        firestore.get(/databases/(default)/documents/users/$(request.auth.token.email)).data.role == 'admin';
    }
  }
}
```

### 3. Database Functions Implementation

#### Key Functions Available (`src/lib/database.ts`):

**User Management:**
- `createUserProfile()` - Create new user profile
- `getUserProfile()` - Get user profile by email
- `updateUserProfile()` - Update user information
- `getAllUsers()` - Admin: Get all users
- `getUserStats()` - Admin: Get user statistics

**EDUSCORE Management:**
- `saveEduscoreResult()` - Save survey results
- `getEduscoreByUserId()` - Get user's EDUSCORE data

**Document Verification:**
- `uploadVerificationDocument()` - Upload and store documents
- `getVerificationDocuments()` - Get user's documents
- `updateVerificationStatus()` - Admin: Verify/reject documents

### 4. Component Integration

#### User Registration Flow
1. User fills registration form (`RegisterForm.tsx`)
2. Firebase Auth creates authentication account
3. User profile automatically created in Firestore
4. User can immediately access their dashboard

#### EDUSCORE Survey Flow
1. User completes survey (`SurveyWizard.tsx`)
2. Documents uploaded to Firebase Storage
3. Survey data and results saved to Firestore
4. Account level automatically calculated and updated
5. Verification documents created for admin review

#### Admin Verification Flow
1. Admin views pending documents (`UserVerification.tsx`)
2. Admin can view, approve, or reject documents
3. User verification status automatically updated
4. Account levels adjusted based on verified documents

## Account Level System

### Level Calculation
Account levels are automatically calculated based on EDUSCORE:
- **Level 1 (Basic)**: 0-59 points
- **Level 2 (Bronze)**: 60-69 points
- **Level 3 (Silver)**: 70-79 points
- **Level 4 (Gold)**: 80-89 points
- **Level 5 (Platinum)**: 90-100 points

### Verification Impact
- Verified documents can boost account levels
- Verification status affects scholarship matching
- Admin verification required for document authenticity

## Data Synchronization

### Automatic Updates
The system ensures data consistency through:

1. **Profile ↔ EDUSCORE Sync**: When EDUSCORE is updated, account level automatically recalculates
2. **Verification ↔ Profile Sync**: Document verification updates user verification status
3. **Real-time Updates**: All changes reflect immediately across the application

### Data Flow
```
Registration → User Profile Creation → EDUSCORE Survey → Document Upload → Admin Verification → Account Level Update
```

## Admin Features

### Dashboard Analytics
- Total user count with verification breakdown
- Pending verification queue
- User management with detailed profiles
- Real-time statistics

### User Management
- View complete user profiles
- Access verification documents
- Approve/reject document verification
- Monitor account levels and verification status

## Security Considerations

### Authentication
- Firebase Authentication handles password security
- Email verification recommended (can be enabled in Firebase console)
- Role-based access control for admin functions

### Data Protection
- Firestore security rules prevent unauthorized access
- Document URLs are secured through Firebase Storage
- Personal data encrypted at rest by Firebase

### File Upload Security
- File type validation (PDF, JPG, PNG only)
- File size limits (5MB maximum)
- Virus scanning recommended (Firebase extension available)

## API Endpoints

### Core Database Operations
All database operations are handled client-side through the Firebase SDK with proper security rules. No custom API endpoints required.

### AI Integration
- EDUSCORE evaluation uses existing AI flow
- Results automatically saved to database
- Real-time score updates

## Deployment Checklist

### Firebase Configuration
- [ ] Firestore database enabled
- [ ] Firebase Storage configured
- [ ] Security rules applied
- [ ] Authentication providers enabled

### Application Setup
- [ ] Environment variables configured
- [ ] Firebase SDK initialized
- [ ] Database functions tested
- [ ] Admin account created (admin@hyhan.vn)

### Testing
- [ ] User registration flow
- [ ] EDUSCORE survey completion
- [ ] Document upload and verification
- [ ] Admin dashboard functionality
- [ ] Data synchronization between components

## Troubleshooting

### Common Issues

1. **Firestore Permission Denied**
   - Check security rules configuration
   - Verify user authentication status
   - Ensure proper role assignment

2. **File Upload Failures**
   - Check Firebase Storage configuration
   - Verify file size and type restrictions
   - Review storage security rules

3. **Data Sync Issues**
   - Check network connectivity
   - Verify Firestore indexes
   - Review console errors for specific issues

### Debug Tools
- Firebase Console for database inspection
- Browser DevTools for client-side debugging
- Firebase Emulator Suite for local testing

## Maintenance

### Regular Tasks
- Monitor database usage and costs
- Review and update security rules
- Clean up expired verification documents
- Backup critical data

### Scaling Considerations
- Implement pagination for large user lists
- Consider composite indexes for complex queries
- Monitor read/write operations for cost optimization

## Support

For technical issues:
1. Check Firebase Console logs
2. Review browser console errors
3. Verify environment configuration
4. Test with Firebase Emulator locally

---

*This guide covers the complete database storage implementation for the EduGuideAI platform. All features are now integrated and ready for production use.*