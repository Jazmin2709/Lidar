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

// === NUEVAS RUTAS PARA BORRADO LÓGICO (AGREGAR AL FINAL) ===

// GET /api/empleados/estado (lista con campo activo)
router.get('/estado', Empleados.listarConEstado);

// PUT /api/empleados/:id/activo (activar/desactivar)
router.put('/:id/activo', Empleados.toggleActivo);

module.exports = router;