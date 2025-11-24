const express = require('express');
const router = express.Router();
const empleadosController = require('../controllers/EmpleadosController');

router.get('/', empleadosController.listar);
router.get('/roles', empleadosController.listarRoles);
router.post('/', empleadosController.crear);
router.put('/:id', empleadosController.editar);
router.put('/:id/activo', empleadosController.toggleActivo);

module.exports = router;