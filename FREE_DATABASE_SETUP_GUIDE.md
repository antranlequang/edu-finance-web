# Free Database Storage System Setup Guide

## Overview

This guide documents the implementation of a **completely free** database storage system for the EduGuideAI platform using **Neon PostgreSQL** and other free services. This solution is perfect for web deployment without any costs.

## Free Technologies Stack

### 🆓 Core Storage Technologies
- **Neon PostgreSQL** (Free tier: 3GB storage, 1 compute unit) - Main database
- **Drizzle ORM** - Type-safe database operations
- **Cloudinary** (Free tier: 25GB, 25,000 transformations/month) - File storage
- **Uploadthing** (Alternative: Free tier: 2GB) - File uploads

### 🔧 Supporting Technologies
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Session management
- **Next.js API Routes** - Backend functionality
- **TypeScript** - Type safety

## Database Schema (PostgreSQL)

### Tables Structure

#### 1. `users` Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'student' NOT NULL,
  date_of_birth TIMESTAMP,
  gender VARCHAR(20),
  verification_status VARCHAR(20) DEFAULT 'unverified' NOT NULL,
  account_level INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 2. `eduscores` Table
```sql
CREATE TABLE eduscores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  score INTEGER NOT NULL,
  reasoning TEXT NOT NULL,
  survey_data JSONB NOT NULL,
  document_urls JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 3. `verification_documents` Table
```sql
CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' NOT NULL,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 4. `sessions` Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Step-by-Step Setup Instructions

### 1. 🗄️ Setup Neon PostgreSQL Database

#### Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub/Google (free)
3. Create a new project
4. Choose your region (closer = faster)

#### Get Database Credentials
1. In Neon console, go to "Connection Details"
2. Copy the connection string
3. It looks like: `postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/database-name?sslmode=require`

### 2. ⚙️ Environment Configuration

#### Create `.env.local` file:
```env
# Neon PostgreSQL Database
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/database-name?sslmode=require

# JWT Secret (generate a random 64-character string)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional: Cloudinary for file storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. 🛠️ Database Migration

#### Generate and Run Migrations:
```bash
# Generate migration files
npx drizzle-kit generate

# Push schema to database
npx drizzle-kit push
```

#### Package.json Scripts:
Add these scripts to your `package.json`:
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

### 4. 🔐 Authentication System

The system uses **JWT tokens** stored in HTTP-only cookies for secure session management:

- **Registration**: `/api/auth/register` - Creates account with hashed password
- **Login**: `/api/auth/login` - Validates credentials and creates session
- **Logout**: `/api/auth/logout` - Invalidates session
- **Session Check**: `/api/auth/me` - Validates current session

### 5. 📁 File Storage Options

#### Option A: Cloudinary (Recommended)
```bash
npm install cloudinary
```

**Features:**
- 25GB free storage
- 25,000 transformations/month
- Image optimization
- CDN delivery

#### Option B: Uploadthing
```bash
npm install uploadthing @uploadthing/react
```

**Features:**
- 2GB free storage
- Simple integration
- Built for Next.js

### 6. 🚀 Deployment

#### Supported Platforms (All Free Tiers):
- **Vercel** - Perfect for Next.js, automatic deployments
- **Netlify** - Great for static sites with serverless functions
- **Railway** - Easy database + app hosting
- **Render** - Simple deployment with PostgreSQL support

#### Environment Variables for Deployment:
Set these in your deployment platform:
```
DATABASE_URL=your-neon-connection-string
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name (optional)
CLOUDINARY_API_KEY=your-api-key (optional)
CLOUDINARY_API_SECRET=your-secret (optional)
```

## File Structure

```
src/
├── lib/
│   ├── schema.ts           # Database schema definitions
│   ├── neon-db.ts         # Neon database connection
│   ├── database-operations.ts # CRUD operations
│   └── auth.ts            # Authentication utilities
├── app/api/auth/
│   ├── register/route.ts  # Registration endpoint
│   ├── login/route.ts     # Login endpoint
│   ├── logout/route.ts    # Logout endpoint
│   └── me/route.ts        # Session validation
└── hooks/
    └── use-auth-neon.tsx  # Auth hook for components
```

## Key Features

### ✅ User Account Management
- Secure registration with password hashing
- Email-based login system
- Role-based access (student/admin)
- Profile updates with automatic timestamps

### ✅ EDUSCORE Integration
- Survey results stored in PostgreSQL
- JSON fields for flexible data storage
- Automatic account level calculation
- Historical score tracking

### ✅ Document Verification
- File upload to Cloudinary/Uploadthing
- Document status tracking (pending/verified/rejected)
- Admin verification workflow
- Secure file URL storage

### ✅ Admin Dashboard
- Real-time user statistics
- User management interface
- Document verification queue
- Complete user profile views

### ✅ Account Level System
- Automatic level calculation based on EDUSCORE
- 5-tier system (Basic → Platinum)
- Verification status tracking
- Level-based features unlocking

## Migration from Firebase

### Update Import Statements:
```typescript
// Old Firebase import
import { useAuth } from '@/hooks/use-auth';

// New Neon import
import { useAuth } from '@/hooks/use-auth-neon';
```

### Component Updates:
All existing components work without changes - just update the import paths to use the new auth hook and database functions.

## Cost Breakdown (100% Free!)

### Database: Neon PostgreSQL
- ✅ **Storage**: 3GB
- ✅ **Compute**: 1 unit
- ✅ **Connections**: 100 concurrent
- ✅ **Auto-pause**: After 5 minutes inactivity
- ✅ **Cost**: $0/month

### File Storage: Cloudinary
- ✅ **Storage**: 25GB
- ✅ **Bandwidth**: 25GB/month
- ✅ **Transformations**: 25,000/month
- ✅ **Cost**: $0/month

### Hosting: Vercel
- ✅ **Bandwidth**: 100GB/month
- ✅ **Serverless Functions**: 100GB-hours
- ✅ **Deployments**: Unlimited
- ✅ **Cost**: $0/month

**Total Monthly Cost: $0** 🎉

## Security Features

### 🔒 Password Security
- bcrypt hashing with salt rounds
- No plaintext passwords stored
- Secure session management

### 🛡️ Session Management
- JWT tokens with expiration
- HTTP-only cookies
- Automatic cleanup of expired sessions

### 🔐 Database Security
- Parameterized queries (SQL injection prevention)
- Connection pooling
- SSL encryption in production

## Performance Optimizations

### Database Indexing
```sql
-- Add these indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_eduscores_user_id ON eduscores(user_id);
CREATE INDEX idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### Connection Pooling
Neon automatically handles connection pooling, but you can optimize with:
```typescript
// Use connection pooling in production
const connectionString = process.env.DATABASE_URL + '?pgbouncer=true';
```

## Deployment Checklist

### ✅ Prerequisites
- [ ] Neon account created and database configured
- [ ] Environment variables set in deployment platform
- [ ] Database schema migrated (`npx drizzle-kit push`)
- [ ] File storage configured (Cloudinary or Uploadthing)

### ✅ Deployment Steps
1. **Push to GitHub**: Commit all changes
2. **Connect to Vercel/Netlify**: Import GitHub repository
3. **Set Environment Variables**: Add DATABASE_URL and JWT_SECRET
4. **Deploy**: Platform will build and deploy automatically
5. **Run Migrations**: Use Drizzle Studio or connect to run initial setup

### ✅ Post-Deployment
- [ ] Test user registration
- [ ] Test login/logout functionality
- [ ] Test EDUSCORE survey submission
- [ ] Test file uploads
- [ ] Test admin dashboard
- [ ] Create initial admin account

## Monitoring & Maintenance

### Database Monitoring
- **Neon Console**: Monitor usage, performance, and queries
- **Storage Usage**: Track against 3GB limit
- **Connection Count**: Monitor concurrent connections

### File Storage Monitoring
- **Cloudinary Dashboard**: Track storage and bandwidth usage
- **Monthly Limits**: Monitor transformations and bandwidth

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Test connection
   npx drizzle-kit introspect
   ```

2. **Migration Errors**
   ```bash
   # Reset and regenerate
   npx drizzle-kit drop
   npx drizzle-kit push
   ```

3. **Session Issues**
   - Check JWT_SECRET environment variable
   - Verify cookie settings for your domain

### Debug Commands
```bash
# View database schema
npx drizzle-kit studio

# Check database status
npx drizzle-kit introspect

# Generate new migration
npx drizzle-kit generate
```

## Scaling Options

When you outgrow the free tiers:

### Database Scaling (Neon)
- **Pro Plan**: $19/month for 10GB storage
- **Scale Plan**: Usage-based pricing

### File Storage Scaling
- **Cloudinary Pro**: $89/month for 100GB
- **AWS S3**: Pay-per-use, very cost-effective

### Hosting Scaling
- **Vercel Pro**: $20/month for team features
- **Custom VPS**: $5-20/month for dedicated resources

## Backup Strategy

### Automated Backups (Free)
```bash
# Create backup script
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250903.sql
```

### Backup to GitHub
Store encrypted database dumps in private GitHub repository for version control.

---

## 🎯 Quick Start Commands

1. **Setup Database**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

2. **Start Development**:
   ```bash
   npm run dev
   ```

3. **View Database**:
   ```bash
   npm run db:studio
   ```

4. **Deploy to Vercel**:
   ```bash
   npx vercel
   ```

---

**Result**: A completely free, production-ready database system with 3GB PostgreSQL storage, 25GB file storage, and unlimited hosting - perfect for web deployment! 🚀

### Free Tier Limits Summary:
- **Database**: 3GB storage (Neon)
- **Files**: 25GB storage (Cloudinary)
- **Hosting**: Unlimited (Vercel)
- **Total Cost**: $0/month