const Setting = require('../models/Setting');

const INITIAL_HOMEPAGE = {
  heroTagline: 'Spartans Facility Management • June 2026 Corporate Profile',
  heroHeading: 'Strategic Repairs & Maintenance Partner',
  heroSubheading: 'Pan-India B2B Hard Services & Engineering Excellence',
  heroDescription: 'Transforming infrastructure upkeep into seamless operational uptime. A single accountable partner for premium technical, engineering, and soft services — powered by AI-Driven Tracking & Monitoring.',
  milestone1: '100% ITI / Diploma Verified Manpower',
  milestone2: 'Lead Technical Partner: Taj Palace Lucknow',
  milestone3: 'Central Command Hub: Lucknow',
  retentionRate: '85%+',
  costReduction: '15-20%'
};

const INITIAL_SOCIALS = {
  phone: '+91-8299726346',
  whatsapp: '+91-8299726346',
  email: 'Sales@spartansfacility.com',
  address: 'Headquarters & Command Hub: Lucknow, Uttar Pradesh (Pan-India Presence)',
  contactPerson: 'Sales Team',
  website: 'https://digicoders.in',
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com'
};

// @desc    Get Homepage settings directly from MongoDB Database
// @route   GET /api/settings/homepage
exports.getHomepageSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'homepage' });
    if (setting && setting.value) {
      return res.json({ success: true, data: setting.value });
    }
    return res.json({ success: true, data: INITIAL_HOMEPAGE });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Homepage settings directly in MongoDB Database
// @route   PUT /api/settings/homepage
exports.updateHomepageSettings = async (req, res) => {
  try {
    const updated = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: 'homepage' },
      { key: 'homepage', value: updated, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: 'Homepage settings updated successfully in Database',
      data: setting.value
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Socials & Contact settings directly from MongoDB Database
// @route   GET /api/settings/socials
exports.getSocialSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'socials' });
    if (setting && setting.value) {
      return res.json({ success: true, data: setting.value });
    }
    return res.json({ success: true, data: INITIAL_SOCIALS });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Socials & Contact settings directly in MongoDB Database
// @route   PUT /api/settings/socials
exports.updateSocialSettings = async (req, res) => {
  try {
    const updated = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: 'socials' },
      { key: 'socials', value: updated, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      message: 'Contact channels & social links updated successfully in Database',
      data: setting.value
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
