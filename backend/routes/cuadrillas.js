const express = require('express');
const router = express.Router();
const cuadrillaController = require('../controllers/CuadrillaController');

router.post('/crear', cuadrillaController.crearCuadrilla);
router.get('/dia', cuadrillaController.getCuadrillasDia);
router.get('/mi-asignacion/:id_persona', cuadrillaController.getMiAsignacion);
router.get('/disponibles', cuadrillaController.getEmpleadosSinCuadrilla);

module.exports = router;
