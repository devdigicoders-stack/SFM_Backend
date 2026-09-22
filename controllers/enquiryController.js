const Enquiry = require('../models/Enquiry');
const { isConnected } = require('../config/db');
const { readCollection, writeCollection } = require('../config/jsonDB');

const COLLECTION_NAME = 'enquiries';

const INITIAL_ENQUIRIES = [
  {
    id: 'ENQ-1001',
    companyName: 'Taj Palace Lucknow',
    contactPerson: 'Sanjay Verma (Director of Engineering)',
    phone: '+91-9839011223',
    email: 'sanjay.verma@tajhotels.com',
    city: 'Lucknow',
    facilityType: 'Hospitality / 5-Star Hotel',
    sqFootage: '150,000 - 500,000 sq ft',
    servicesNeeded: ['HVAC & Chiller Plants', 'Electrical & Power Systems', 'Fire & Life Safety Overhauls'],
    status: 'Scheduled',
    date: '2026-06-20',
    notes: 'Annual chiller descaling & thermography audit required before high summer occupancy.'
  },
  {
    id: 'ENQ-1002',
    companyName: 'Phoenix Palassio Mall',
    contactPerson: 'Aditi Sharma (Operations Head)',
    phone: '+91-9721455667',
    email: 'aditi.sharma@phoenixpalassio.com',
    city: 'Lucknow',
    facilityType: 'Commercial Shopping Mall',
    sqFootage: '500,000+ sq ft',
    servicesNeeded: ['Plumbing & Hydro-Pneumatics', 'Civil & Architectural Fit-outs', 'ELV & BMS Diagnostics'],
    status: 'Reviewed',
    date: '2026-06-19',
    notes: 'High footfall atrium glazing check and food court grease-trap motorized desilting scope.'
  }
];

const getLocalEnquiries = () => readCollection(COLLECTION_NAME, INITIAL_ENQUIRIES);
const saveLocalEnquiries = (enquiries) => writeCollection(COLLECTION_NAME, enquiries);

// @desc    Get all enquiries
// @route   GET /api/enquiries
exports.getEnquiries = async (req, res) => {
  try {
    if (isConnected()) {
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
        date: e.createdAt.toISOString().split('T')[0],
        notes: e.notes
      }));
      return res.json({ success: true, count: formatted.length, data: formatted });
    }

    const enquiries = getLocalEnquiries();
    return res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new facility enquiry (from Public Website)
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

    if (isConnected()) {
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
    }

    const enquiries = getLocalEnquiries();
    const newEnquiry = {
      id: customId,
      companyName,
      contactPerson,
      phone,
      email,
      city: city || 'Lucknow',
      facilityType: facilityType || 'Commercial Enterprise',
      sqFootage: sqFootage || '50,000 - 150,000 sq ft',
      servicesNeeded: servicesNeeded || ['Facility Health Audit'],
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      notes: notes || ''
    };

    enquiries.unshift(newEnquiry);
    saveLocalEnquiries(enquiries);

    return res.status(201).json({
      success: true,
      message: 'Facility audit request received successfully. Our engineering head will contact you within 4 hours.',
      data: newEnquiry
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isConnected()) {
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
    }

    const enquiries = getLocalEnquiries();
    const enquiry = enquiries.find(e => e.id === id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry lead not found' });
    }

    enquiry.status = status;
    saveLocalEnquiries(enquiries);

    return res.json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      data: enquiry
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      let result = await Enquiry.findOneAndDelete({
        $or: [{ customId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }]
      });
      if (!result) return res.status(404).json({ success: false, message: 'Enquiry not found' });
      return res.json({
        success: true,
        message: 'Enquiry deleted successfully'
      });
    }

    const enquiries = getLocalEnquiries();
    const index = enquiries.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiries.splice(index, 1);
    saveLocalEnquiries(enquiries);

    return res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

