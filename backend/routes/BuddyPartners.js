const express = require('express');
const router = express.Router();
const BuddyPartnersController = require('../controllers/BuddyPartnersController');

// Controladores de BuddyPartners

// BuddyPartner1
router.get('/BuddyPartner', BuddyPartnersController.GetBuddyPartner);
router.post('/BuddyPartner', BuddyPartnersController.BuddyPartner);
router.put('/BuddyPartner/:id', BuddyPartnersController.EditBuddyPartner);
router.delete('/BuddyPartner/:id', BuddyPartnersController.DeleteBuddyPartner);
router.get('/BuddyPartner/export-pdf', BuddyPartnersController.ExportPDF);



// BuddyPartner2
// router.get ('/BuddyPartner2', BuddyPartnersController.GetBuddyPartner2);
// router.post('/BuddyPartner2', BuddyPartnersController.BuddyPartner2);

module.exports = router;