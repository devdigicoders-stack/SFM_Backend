const express = require('express');
const router = express.Router();
const { getEnquiries, createEnquiry, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getEnquiries);
router.post('/', createEnquiry);
router.put('/:id/status', protect, updateEnquiryStatus);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;
