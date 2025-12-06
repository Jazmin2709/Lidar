const express = require('express');
const { upload, validateImagen } = require('../middlewares/validateImagenes');
const imagenesController = require('../controllers/ImagenesController');

const router = express.Router();

router.post('/subir', upload.single('foto'), validateImagen, imagenesController.subirImagen);

router.post('/eliminar/:public_id', ImagenesController.eliminarImagen);

module.exports = router;
 
