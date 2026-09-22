/**
 * Spartans Facility Management (SFM) - Master Admin Account Creator
 * DigiCoders Technologies Private Limited
 * 
 * Interactive & CLI Mode supported:
 * 1. Interactive: node server/scripts/create-admin.js
 * 2. Arguments:   node server/scripts/create-admin.js <email> <password> <name> <phone>
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

async function run() {
  console.log('\n======================================================');
  console.log('🛡️  SPARTANS FACILITY MANAGEMENT — ADMIN ACCOUNT CREATOR');
  console.log('======================================================\n');

  let email = process.argv[2];
  let password = process.argv[3];
  let name = process.argv[4];
  let phone = process.argv[5];

  // If arguments not provided via CLI, prompt interactively
  if (!email || !password) {
    name = await askQuestion('👤 Enter Full Name (default: Pranjal Gupta): ') || 'Pranjal Gupta';
    email = await askQuestion('📧 Enter Official Admin Email (default: admin@spartansfacility.com): ') || 'admin@spartansfacility.com';
    password = await askQuestion('🔑 Enter Master Password (min 6 chars, default: admin123): ') || 'admin123';
    phone = await askQuestion('📞 Enter Phone Number (default: +91-8299726346): ') || '+91-8299726346';
  } else {
    name = name || 'Pranjal Gupta';
    phone = phone || '+91-8299726346';
  }

  rl.close();

  // Validate inputs
  email = email.trim().toLowerCase();
  if (!email.includes('@') || !email.includes('.')) {
    console.error('❌ Error: Invalid email format.');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('❌ Error: Password must be at least 6 characters long.');
    process.exit(1);
  }

  const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const adminData = {
    name: name.trim(),
    email: email,
    password: password, // kept for demo sync
    passwordHash: hashedPassword,
    role: 'Super Administrator',
    avatar: avatar,
    phone: phone.trim(),
    createdAt: new Date().toISOString()
  };

  // 1. Save to JSON file in server and admin
  const serverCredPath = path.join(__dirname, '../admin-credentials.json');
  const adminCredPath = path.join(__dirname, '../../admin/src/admin-credentials.json');

  fs.writeFileSync(serverCredPath, JSON.stringify(adminData, null, 2), 'utf-8');
  try {
    fs.writeFileSync(adminCredPath, JSON.stringify(adminData, null, 2), 'utf-8');
  } catch (e) {
    // Admin folder path fallback
  }

  // 2. Try saving to MongoDB if reachable
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sfm_facility_db';
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    const AdminModel = require('../models/Admin');
    
    // Check if admin already exists
    let existing = await AdminModel.findOne({ email });
    if (existing) {
      existing.name = adminData.name;
      existing.password = hashedPassword;
      existing.phone = adminData.phone;
      existing.avatar = adminData.avatar;
      await existing.save();
      console.log('📦 Updated existing Admin in MongoDB Database!');
    } else {
      await AdminModel.create({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        avatar: adminData.avatar,
        phone: adminData.phone
      });
      console.log('📦 Created new Admin record in MongoDB Database!');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.log('ℹ️  MongoDB offline (using File/In-Memory storage).');
  }

  // 3. Update in-memory store reference
  try {
    const store = require('../store/inMemoryStore');
    store.admin = {
      name: adminData.name,
      email: adminData.email,
      password: password,
      role: adminData.role,
      avatar: adminData.avatar,
      phone: adminData.phone
    };
  } catch (e) {}

  console.log('\n======================================================');
  console.log('✅ ADMIN ACCOUNT CREATED & CONFIGURED SUCCESSFULLY!');
  console.log('======================================================');
  console.log(`👤 Name:     ${adminData.name}`);
  console.log(`📧 Email:    ${adminData.email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`📞 Phone:    ${adminData.phone}`);
  console.log(`🔐 Role:     ${adminData.role}`);
  console.log('------------------------------------------------------');
  console.log('🌐 Admin Login URL: http://localhost:5174/login');
  console.log('🌐 Public Site URL: http://localhost:5173/');
  console.log('======================================================\n');
}

run().catch(console.error);
