import { pgTable, text, timestamp, integer, jsonb, varchar, boolean, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('student'),
  dateOfBirth: timestamp('date_of_birth'),
  gender: varchar('gender', { length: 20 }),
  verificationStatus: varchar('verification_status', { length: 20 }).notNull().default('unverified'),
  accountLevel: integer('account_level').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// EDUSCORE results table
export const eduscores = pgTable('eduscores', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  score: integer('score').notNull(),
  reasoning: text('reasoning').notNull(),
  surveyData: jsonb('survey_data').notNull(),
  documentUrls: jsonb('document_urls').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Verification documents table
export const verificationDocuments = pgTable('verification_documents', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verifiedAt: timestamp('verified_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User sessions table (for authentication)
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User skills and certifications
export const userSkills = pgTable('user_skills', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  skillName: varchar('skill_name', { length: 100 }).notNull(),
  proficiencyLevel: varchar('proficiency_level', { length: 20 }).notNull(), // beginner, intermediate, advanced, expert
  verified: boolean('verified').default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verificationDate: timestamp('verification_date'),
  certificationUrl: text('certification_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User education history
export const userEducation = pgTable('user_education', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  institution: varchar('institution', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 100 }).notNull(),
  fieldOfStudy: varchar('field_of_study', { length: 100 }),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  gpa: varchar('gpa', { length: 10 }),
  verified: boolean('verified').default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verificationDate: timestamp('verification_date'),
  transcript: text('transcript'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User work experience
export const userExperience = pgTable('user_experience', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  description: text('description'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  currentlyWorking: boolean('currently_working').default(false),
  verified: boolean('verified').default(false),
  verifiedBy: uuid('verified_by').references(() => users.id),
  verificationDate: timestamp('verification_date'),
  employmentLetter: text('employment_letter'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Forum posts
export const forumPosts = pgTable('forum_posts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }).notNull(), // jobs, scholarships, networking, general
  tags: jsonb('tags'),
  likes: integer('likes').default(0),
  views: integer('views').default(0),
  pinned: boolean('pinned').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Forum comments
export const forumComments = pgTable('forum_comments', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  postId: uuid('post_id').references(() => forumPosts.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  content: text('content').notNull(),
  parentId: uuid('parent_id').references(() => forumComments.id), // for nested comments
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User connections (networking)
export const userConnections = pgTable('user_connections', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  requesterId: uuid('requester_id').references(() => users.id).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, accepted, declined
  requestDate: timestamp('request_date').defaultNow().notNull(),
  responseDate: timestamp('response_date'),
});

// User blockchain addresses
export const userBlockchainAddresses = pgTable('user_blockchain_addresses', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  walletAddress: varchar('wallet_address', { length: 42 }).notNull().unique(),
  chainId: integer('chain_id').notNull(),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// NFT achievements
export const nftAchievements = pgTable('nft_achievements', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  tokenId: varchar('token_id', { length: 100 }).notNull(),
  contractAddress: varchar('contract_address', { length: 42 }).notNull(),
  achievementType: varchar('achievement_type', { length: 50 }).notNull(),
  metadata: jsonb('metadata'),
  verified: boolean('verified').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Scholarships table
export const scholarships = pgTable('scholarships', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  amount: integer('amount').notNull(),
  currency: varchar('currency', { length: 10 }).default('USD'),
  provider: varchar('provider', { length: 255 }).notNull(),
  eligibilityCriteria: jsonb('eligibility_criteria').notNull(), // GPA, major, income, etc.
  applicationDeadline: timestamp('application_deadline'),
  isActive: boolean('is_active').default(true),
  totalSlots: integer('total_slots').default(1),
  occupiedSlots: integer('occupied_slots').default(0),
  requirements: jsonb('requirements'), // documents, essays, etc.
  contactInfo: jsonb('contact_info'), // email, phone, website
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Scholarship applications
export const scholarshipApplications = pgTable('scholarship_applications', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').references(() => users.id).notNull(),
  scholarshipId: uuid('scholarship_id').references(() => scholarships.id).notNull(),
  scholarshipName: varchar('scholarship_name', { length: 255 }).notNull(),
  amount: integer('amount').notNull(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  applicationData: jsonb('application_data'),
  blockchainTxHash: varchar('blockchain_tx_hash', { length: 66 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});