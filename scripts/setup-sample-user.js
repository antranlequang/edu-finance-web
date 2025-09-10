/**
 * Script to setup sample user account and EduScore data
 * This creates a sample user account with realistic data for testing
 */

const { config } = require('dotenv');
const path = require('path');

// Load environment variables
config({ path: path.resolve(__dirname, '../.env.local') });

// Now import and run the TypeScript script
require('./seed-sample-user.ts');