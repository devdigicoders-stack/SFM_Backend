const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Pranjal Gupta' },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Super Administrator' },
  avatar: { type: String, default: 'PG' },
  phone: { type: String, default: '+91-8299726346' },
  createdAt: { type: Date, default: Date.now }
});

AdminSchema.methods.matchPassword = async function (enteredPassword) {
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return enteredPassword === this.password;
};

module.exports = mongoose.model('Admin', AdminSchema);
