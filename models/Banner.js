const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  tagline: { type: String, default: 'Spartans Facility Management' },
  badge: { type: String, default: 'June 2026 Profile' },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
  ctaText: { type: String, default: 'Request Facility Health Audit' },
  ctaLink: { type: String, default: '/contact' },
  secondaryCtaText: { type: String, default: 'Explore Vigyani.ai Hub' },
  secondaryCtaLink: { type: String, default: '/vigyani-ai' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Banner', BannerSchema);

