const Banner = require('../models/Banner');

// @desc    Get all banners directly from MongoDB Database
// @route   GET /api/banners
exports.getBanners = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create banner directly in MongoDB Database
// @route   POST /api/banners
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, tagline, badge, image, active, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink } = req.body;
    if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

    const newBanner = await Banner.create({
      title,
      subtitle: subtitle || '',
      tagline: tagline || 'Spartans Facility Management',
      badge: badge || 'Enterprise SLA',
      image: image || '',
      active: typeof active === 'boolean' ? active : true,
      ctaText: ctaText || 'Request Facility Health Audit',
      ctaLink: ctaLink || '/contact',
      secondaryCtaText: secondaryCtaText || 'Explore AI Tracking & Monitoring',
      secondaryCtaLink: secondaryCtaLink || '/ifm-services'
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
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update banner directly in MongoDB Database
// @route   PUT /api/banners/:id
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, tagline, badge, image, active, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink } = req.body;

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
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete banner directly from MongoDB Database
// @route   DELETE /api/banners/:id
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    let result = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Banner.findByIdAndDelete(id);
    } else {
      result = await Banner.findOneAndDelete({ title: id });
    }
    if (!result) return res.status(404).json({ success: false, message: 'Banner not found' });
    return res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
