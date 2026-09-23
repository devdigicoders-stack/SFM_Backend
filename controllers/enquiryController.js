const Enquiry = require('../models/Enquiry');

// @desc    Get all enquiries directly from MongoDB Database
// @route   GET /api/enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const dbEnquiries = await Enquiry.find().sort({ createdAt: -1 });
    const formatted = dbEnquiries.map(e => ({
      id: e.customId || e._id.toString(),
      companyName: e.companyName,
      contactPerson: e.contactPerson,
      phone: e.phone,
      email: e.email,
      city: e.city,
      facilityType: e.facilityType,
      sqFootage: e.sqFootage,
      servicesNeeded: e.servicesNeeded,
      status: e.status,
      date: e.createdAt ? e.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      notes: e.notes
    }));
    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new facility enquiry directly in MongoDB Database
// @route   POST /api/enquiries
exports.createEnquiry = async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      phone,
      email,
      city,
      facilityType,
      sqFootage,
      servicesNeeded,
      notes
    } = req.body;

    if (!companyName || !contactPerson || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name, contact person, phone, and email'
      });
    }

    const customId = `ENQ-${Date.now().toString().slice(-4)}`;

    const newEnq = await Enquiry.create({
      customId,
      companyName,
      contactPerson,
      phone,
      email,
      city: city || 'Lucknow',
      facilityType: facilityType || 'Commercial Enterprise',
      sqFootage: sqFootage || '50,000 - 150,000 sq ft',
      servicesNeeded: servicesNeeded || ['Facility Health Audit'],
      status: 'Pending',
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Facility audit request received successfully. Our engineering head will contact you within 4 hours.',
      data: {
        id: newEnq.customId,
        companyName: newEnq.companyName,
        contactPerson: newEnq.contactPerson,
        phone: newEnq.phone,
        email: newEnq.email,
        city: newEnq.city,
        facilityType: newEnq.facilityType,
        sqFootage: newEnq.sqFootage,
        servicesNeeded: newEnq.servicesNeeded,
        status: newEnq.status,
        date: newEnq.createdAt.toISOString().split('T')[0],
        notes: newEnq.notes
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry status directly in MongoDB Database
// @route   PUT /api/enquiries/:id/status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let enq = await Enquiry.findOneAndUpdate(
      { $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      { status },
      { new: true }
    );
    if (!enq) return res.status(404).json({ success: false, message: 'Enquiry lead not found' });
    return res.json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      data: enq
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete enquiry directly from MongoDB Database
// @route   DELETE /api/enquiries/:id
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    let result = await Enquiry.findOneAndDelete({
      $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
    });
    if (!result) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    return res.json({
      success: true,
      message: 'Enquiry deleted successfully from Database'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
