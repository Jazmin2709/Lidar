const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/AsistenciaController');

router.post('/registrar', asistenciaController.registrarAsistencia);
router.get('/hoy', asistenciaController.getAsistenciasHoy);
router.get('/verificar/:id_persona', asistenciaController.verificarAsistencia);

module.exports = router;
