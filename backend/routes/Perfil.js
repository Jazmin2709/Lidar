const express = require('express');
const router = express.Router();
const Perfil = require('../controllers/PerfilController');

// Perfil del usuario autenticado (Empleado/Supervisor)
router.get('/me', Perfil.obtenerPerfilMe);
router.put('/me', Perfil.actualizarPerfilMe);

module.exports = router;
