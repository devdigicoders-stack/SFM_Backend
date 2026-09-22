const jwt = require('jsonwebtoken');
const store = require('../store/inMemoryStore');

const generateToken = (email, role) => {
  return jwt.sign(
    { email, role },
    process.env.JWT_SECRET || 'sfm_spartans_facility_management_jwt_secret_2026',
    { expiresIn: '30d' }
  );
};

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const getCredentialsFile = () => {
  try {
    const credPath = path.join(__dirname, '../admin-credentials.json');
    if (fs.existsSync(credPath)) {
      return JSON.parse(fs.readFileSync(credPath, 'utf-8'));
    }
  } catch (e) {}
  return null;
};

// @desc    Admin login
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const credFile = getCredentialsFile();

    // 1. Check MongoDB if database is connected
    try {
      const dbAdmin = await Admin.findOne({ email: trimmedEmail });
      if (dbAdmin) {
        const isMatch = await dbAdmin.matchPassword(password);
        if (isMatch) {
          const token = generateToken(dbAdmin.email, dbAdmin.role);
          return res.json({
            success: true,
            message: 'Admin authentication successful',
            token,
            user: {
              name: dbAdmin.name,
              email: dbAdmin.email,
              role: dbAdmin.role,
              avatar: dbAdmin.avatar,
              phone: dbAdmin.phone
            }
          });
        }
      }
    } catch (dbErr) {
      // DB offline fallback
    }

    // 2. Check admin-credentials.json created by create-admin script
    if (credFile && credFile.email.toLowerCase() === trimmedEmail) {
      let isMatch = false;
      if (credFile.passwordHash) {
        isMatch = await bcrypt.compare(password, credFile.passwordHash);
      }
      if (!isMatch && credFile.password) {
        isMatch = (password === credFile.password);
      }

      if (isMatch) {
        // Sync to in-memory store
        store.admin = {
          name: credFile.name || 'Administrator',
          email: credFile.email,
          password: credFile.password || password,
          role: credFile.role || 'Super Administrator',
          avatar: credFile.avatar || 'AD',
          phone: credFile.phone || ''
        };

        const token = generateToken(store.admin.email, store.admin.role);
        return res.json({
          success: true,
          message: 'Admin authentication successful',
          token,
          user: {
            name: store.admin.name,
            email: store.admin.email,
            role: store.admin.role,
            avatar: store.admin.avatar,
            phone: store.admin.phone
          }
        });
      }
    }

    // 3. Check default master admin or in-memory store
    if (
      (trimmedEmail === 'admin@spartansfacility.com' && password === 'admin123') ||
      (trimmedEmail === store.admin.email.toLowerCase() && password === store.admin.password)
    ) {
      const token = generateToken(trimmedEmail, 'Super Administrator');
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        token,
        user: {
          name: trimmedEmail === 'admin@spartansfacility.com' ? 'Pranjal Gupta' : store.admin.name,
          email: trimmedEmail,
          role: 'Super Administrator',
          avatar: trimmedEmail === 'admin@spartansfacility.com' ? 'PG' : store.admin.avatar,
          phone: trimmedEmail === 'admin@spartansfacility.com' ? '+91-8299726346' : store.admin.phone
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid official admin email or password.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Current Logged in Admin Profile
// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  return res.json({
    success: true,
    user: {
      name: store.admin.name,
      email: store.admin.email,
      role: store.admin.role,
      avatar: store.admin.avatar,
      phone: store.admin.phone
    }
  });
};

// @desc    Update Admin Profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;
    if (name) store.admin.name = name;
    if (email) store.admin.email = email;
    if (phone) store.admin.phone = phone;
    if (avatar) store.admin.avatar = avatar;

    return res.json({
      success: true,
      message: 'Admin profile updated successfully',
      user: store.admin
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/auth/password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword !== store.admin.password) {
      return res.status(400).json({ success: false, message: 'Current master password does not match' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    store.admin.password = newPassword;

    return res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
