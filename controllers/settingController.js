const Setting = require('../models/Setting');
const { isConnected } = require('../config/db');
const { readCollection, writeCollection } = require('../config/jsonDB');

const COLLECTION_NAME = 'settings';

const INITIAL_HOMEPAGE = {
  heroTagline: 'Spartans Facility Management • June 2026 Corporate Profile',
  heroHeading: 'Strategic Repairs & Maintenance Partner',
  heroSubheading: 'Pan-India B2B Hard Services & Engineering Excellence',
  heroDescription: 'Transforming infrastructure upkeep into seamless operational uptime. A single accountable partner for premium technical, engineering, and soft services — powered by Vigyani.ai.',
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
  contactPerson: 'Pranjal Gupta',
  website: 'https://digicoders.in',
  linkedin: 'https://linkedin.com',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com'
};

const getLocalSettings = () => readCollection(COLLECTION_NAME, { homepage: INITIAL_HOMEPAGE, socials: INITIAL_SOCIALS });
const saveLocalSettings = (settings) => writeCollection(COLLECTION_NAME, settings);

// @desc    Get Homepage settings
// @route   GET /api/settings/homepage
exports.getHomepageSettings = async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await Setting.findOne({ key: 'homepage' });
      if (setting && setting.value) {
        return res.json({ success: true, data: setting.value });
      }
    }
    const settings = getLocalSettings();
    return res.json({ success: true, data: settings.homepage || INITIAL_HOMEPAGE });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Homepage settings
// @route   PUT /api/settings/homepage
exports.updateHomepageSettings = async (req, res) => {
  try {
    const updated = req.body;
    if (isConnected()) {
      await Setting.findOneAndUpdate(
        { key: 'homepage' },
        { key: 'homepage', value: updated, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    const settings = getLocalSettings();
    settings.homepage = { ...settings.homepage, ...updated };
    saveLocalSettings(settings);

    return res.json({
      success: true,
      message: 'Homepage settings updated successfully',
      data: settings.homepage
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Socials & Contact settings
// @route   GET /api/settings/socials
exports.getSocialSettings = async (req, res) => {
  try {
    if (isConnected()) {
      const setting = await Setting.findOne({ key: 'socials' });
      if (setting && setting.value) {
        return res.json({ success: true, data: setting.value });
      }
    }
    const settings = getLocalSettings();
    return res.json({ success: true, data: settings.socials || INITIAL_SOCIALS });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Socials & Contact settings
// @route   PUT /api/settings/socials
exports.updateSocialSettings = async (req, res) => {
  try {
    const updated = req.body;
    if (isConnected()) {
      await Setting.findOneAndUpdate(
        { key: 'socials' },
        { key: 'socials', value: updated, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    const settings = getLocalSettings();
    settings.socials = { ...settings.socials, ...updated };
    saveLocalSettings(settings);

    return res.json({
      success: true,
      message: 'Contact channels & social links updated successfully',
      data: settings.socials
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

