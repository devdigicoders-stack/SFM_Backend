const Banner = require('../models/Banner');
const { isConnected } = require('../config/db');
const { readCollection, writeCollection } = require('../config/jsonDB');

const COLLECTION_NAME = 'banners';

const INITIAL_BANNERS = [
  {
    id: 'ban-1',
    title: 'Strategic Repairs & Maintenance Partner',
    subtitle: 'Pan-India B2B Hard Services & Engineering Excellence',
    tagline: 'Spartans Facility Management • June 2026 Profile',
    badge: 'B2B Enterprise SLA',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    active: true,
    ctaText: 'Request Facility Health Audit',
    ctaLink: '/contact',
    secondaryCtaText: 'Explore Vigyani.ai Hub',
    secondaryCtaLink: '/vigyani-ai'
  },
  {
    id: 'ban-2',
    title: 'Redefining Excellence in Integrated FM',
    subtitle: 'A single accountable partner for premium technical and soft services, powered by AI.',
    tagline: 'SFM | SMS | VIGYANI.AI',
    badge: 'AI Telemetry Engine',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    active: true,
    ctaText: 'Explore Vigyani.ai Hub',
    ctaLink: '/vigyani-ai',
    secondaryCtaText: 'View R&M Scope',
    secondaryCtaLink: '/rm-services'
  }
];

const getLocalBanners = () => readCollection(COLLECTION_NAME, INITIAL_BANNERS);
const saveLocalBanners = (banners) => writeCollection(COLLECTION_NAME, banners);

// @desc    Get all banners
// @route   GET /api/banners
exports.getBanners = async (req, res) => {
  try {
    if (isConnected()) {
      const dbBanners = await Banner.find().sort({ createdAt: -1 });
      const formatted = dbBanners.map(b => ({
        id: b._id.toString(),
        title: b.title,
        subtitle: b.subtitle,
        tagline: b.tagline,
        badge: b.badge,
        image: b.image,
        active: b.active,
        ctaText: b.ctaText,
        ctaLink: b.ctaLink,
        secondaryCtaText: b.secondaryCtaText,
        secondaryCtaLink: b.secondaryCtaLink
      }));
      return res.json({ success: true, count: formatted.length, data: formatted });
    }

    const banners = getLocalBanners();
    return res.json({ success: true, count: banners.length, data: banners });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create banner
// @route   POST /api/banners
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, tagline, badge, image, active, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    if (isConnected()) {
      const newBanner = await Banner.create({
        title,
        subtitle: subtitle || '',
        tagline: tagline || 'Spartans Facility Management',
        badge: badge || 'Enterprise SLA',
        image: image || '',
        active: typeof active === 'boolean' ? active : true,
        ctaText: ctaText || 'Request Facility Health Audit',
        ctaLink: ctaLink || '/contact',
        secondaryCtaText: secondaryCtaText || 'Explore Vigyani.ai Hub',
        secondaryCtaLink: secondaryCtaLink || '/vigyani-ai'
      });

      return res.status(201).json({
        success: true,
        data: {
          id: newBanner._id.toString(),
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          tagline: newBanner.tagline,
          badge: newBanner.badge,
          image: newBanner.image,
          active: newBanner.active,
          ctaText: newBanner.ctaText,
          ctaLink: newBanner.ctaLink,
          secondaryCtaText: newBanner.secondaryCtaText,
          secondaryCtaLink: newBanner.secondaryCtaLink
        }
      });
    }

    const banners = getLocalBanners();
    const newBanner = {
      id: `ban-${Date.now()}`,
      title,
      subtitle: subtitle || '',
      tagline: tagline || 'Spartans Facility Management',
      badge: badge || 'Enterprise SLA',
      image: image || '',
      active: typeof active === 'boolean' ? active : true,
      ctaText: ctaText || 'Request Facility Health Audit',
      ctaLink: ctaLink || '/contact',
      secondaryCtaText: secondaryCtaText || 'Explore Vigyani.ai Hub',
      secondaryCtaLink: secondaryCtaLink || '/vigyani-ai'
    };

    banners.push(newBanner);
    saveLocalBanners(banners);

    return res.status(201).json({ success: true, data: newBanner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, tagline, badge, image, active, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink } = req.body;

    if (isConnected()) {
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (tagline !== undefined) updateData.tagline = tagline;
      if (badge !== undefined) updateData.badge = badge;
      if (image !== undefined) updateData.image = image;
      if (typeof active === 'boolean') updateData.active = active;
      if (ctaText !== undefined) updateData.ctaText = ctaText;
      if (ctaLink !== undefined) updateData.ctaLink = ctaLink;
      if (secondaryCtaText !== undefined) updateData.secondaryCtaText = secondaryCtaText;
      if (secondaryCtaLink !== undefined) updateData.secondaryCtaLink = secondaryCtaLink;

      let banner = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        banner = await Banner.findByIdAndUpdate(id, updateData, { new: true });
      } else {
        banner = await Banner.findOneAndUpdate({ title: id }, updateData, { new: true });
      }

      if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
      return res.json({
        success: true,
        data: {
          id: banner._id.toString(),
          title: banner.title,
          subtitle: banner.subtitle,
          tagline: banner.tagline,
          badge: banner.badge,
          image: banner.image,
          active: banner.active,
          ctaText: banner.ctaText,
          ctaLink: banner.ctaLink,
          secondaryCtaText: banner.secondaryCtaText,
          secondaryCtaLink: banner.secondaryCtaLink
        }
      });
    }

    const banners = getLocalBanners();
    const banner = banners.find(b => b.id === id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    if (title) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (tagline !== undefined) banner.tagline = tagline;
    if (badge !== undefined) banner.badge = badge;
    if (image !== undefined) banner.image = image;
    if (typeof active === 'boolean') banner.active = active;
    if (ctaText !== undefined) banner.ctaText = ctaText;
    if (ctaLink !== undefined) banner.ctaLink = ctaLink;
    if (secondaryCtaText !== undefined) banner.secondaryCtaText = secondaryCtaText;
    if (secondaryCtaLink !== undefined) banner.secondaryCtaLink = secondaryCtaLink;

    saveLocalBanners(banners);
    return res.json({ success: true, data: banner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      let result = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Banner.findByIdAndDelete(id);
      } else {
        result = await Banner.findOneAndDelete({ title: id });
      }
      if (!result) return res.status(404).json({ success: false, message: 'Banner not found' });
      return res.json({ success: true, message: 'Banner deleted successfully' });
    }

    const banners = getLocalBanners();
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Banner not found' });

    banners.splice(index, 1);
    saveLocalBanners(banners);
    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

