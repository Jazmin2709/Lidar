const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { GetPendingByUser } = require('../controllers/BuddyPartnersController');

// Controladores de autenticación
router.post('/ingresar', authController.ingresar);
router.post('/registrar', authController.registrar);
router.post('/enviarCorreo', authController.enviarCorreo);
router.post('/recuperarContrasena', authController.recuperarContrasena);
router.get('/validarToken', authController.validarToken);
router.get('/pending/:id', GetPendingByUser);

module.exports = router;