const express = require('express');
const router = express.Router();
const BuddyPartnersController = require('../controllers/BuddyPartnersController');

// ==================== RUTAS CORRECTAS ====================

router.get('/BuddyPartner', BuddyPartnersController.GetBuddyPartner);
router.post('/BuddyPartner', BuddyPartnersController.BuddyPartner);
router.put('/BuddyPartner/:id', BuddyPartnersController.EditBuddyPartner);
router.delete('/BuddyPartner/:id', BuddyPartnersController.DeleteBuddyPartner);
router.get('/BuddyPartner/export-pdf', BuddyPartnersController.ExportPDF);
router.get("/BuddyPartner/export-excel", BuddyPartnersController.ExportExcel);
router.get('/check-duplicate', BuddyPartnersController.CheckDuplicate);
router.get('/pending/:id', BuddyPartnersController.GetPendingByUser);

// (las de BuddyPartner2 siguen comentadas)

// ==================== FIN ====================
module.exports = router;