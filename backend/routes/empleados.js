const express = require('express');
const router = express.Router();
const Empleados = require('../controllers/EmpleadosController');

// GET /api/empleados
router.get('/', Empleados.listar);

// GET /api/empleados/roles
router.get('/roles', Empleados.roles);

// POST /api/empleados
router.post('/', Empleados.crear);

// PUT /api/empleados/:id
router.put('/:id', Empleados.editar);

// DELETE /api/empleados/:id
router.delete('/:id', Empleados.eliminar);

module.exports = router;
