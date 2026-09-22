const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, default: 'Lucknow' },
  facilityType: { type: String, default: 'Commercial' },
  sqFootage: { type: String, default: '50,000 - 150,000 sq ft' },
  servicesNeeded: { type: [String], default: [] },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Scheduled', 'Completed'], default: 'Pending' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enquiry', EnquirySchema);
