const express = require('express');
const router = express.Router();
const BuddyPartnersController = require('../controllers/BuddyPartnersController');

// Controladores de BuddyPartners

// BuddyPartner1
router.get ('/BuddyPartner1', BuddyPartnersController.GetBuddyPartner1);
router.post('/BuddyPartner1', BuddyPartnersController.BuddyPartner1);

// BuddyPartner2
// router.get ('/BuddyPartner2', BuddyPartnersController.GetBuddyPartner2);
// router.post('/BuddyPartner2', BuddyPartnersController.BuddyPartner2);

module.exports = router;