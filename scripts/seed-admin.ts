import { createUserProfile, getUserByEmail } from '../src/lib/database-operations';

const ADMIN_EMAIL = 'admin@hyhan.vn';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password
const ADMIN_NAME = 'System Administrator';

async function seedAdminUser() {
  try {
    console.log('🔍 Checking if admin user exists...');
    
    const existingAdmin = await getUserByEmail(ADMIN_EMAIL);
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      console.log('   Role:', existingAdmin.role);
      console.log('   Name:', existingAdmin.name);
      return;
    }

    console.log('🚀 Creating default admin user...');
    
    const adminUser = await createUserProfile({
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('✅ Default admin user created successfully!');
    console.log('   Email:', adminUser.email);
    console.log('   Role:', adminUser.role);
    console.log('   ID:', adminUser.id);
    console.log('');
    console.log('🔑 Login credentials:');
    console.log('   Email:', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
}

// Run the seed function
seedAdminUser().then(() => {
  console.log('🎉 Admin seeding completed!');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});