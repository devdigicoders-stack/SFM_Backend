const express = require('express');
const router = express.Router();
const { 
  getHomepageSettings, 
  updateHomepageSettings, 
  getSocialSettings, 
  updateSocialSettings 
} = require('../controllers/settingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/homepage', getHomepageSettings);
router.put('/homepage', protect, updateHomepageSettings);

router.get('/socials', getSocialSettings);
router.put('/socials', protect, updateSocialSettings);

module.exports = router;
