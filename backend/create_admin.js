// Run this once to create admin account:
// node create_admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const existing = await User.findOne({ gmail: 'admin@thesis.com' });
  if (existing) {
    console.log('Admin already exists:', existing.gmail);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'System Admin',
    gmail: 'admin@thesis.com',
    password_hash: 'admin123',   // will be hashed automatically
    role: 'admin'
  });

  console.log('✅ Admin created successfully!');
  console.log('   Email:    admin@thesis.com');
  console.log('   Password: admin123');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
