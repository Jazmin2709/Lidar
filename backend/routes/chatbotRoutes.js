const express = require('express');
const router = express.Router();

// Lista de respuestas con palabras clave y el id de la sección para hacer scroll
const respuestas = [
    { keys: ['inicio', 'home'], texto: 'Puedes volver al inicio usando el menú o desplazándote hacia arriba.', scrollTo: 'inicio' },
    { keys: ['buddypages', 'buddy pages', 'buddypage'], texto: 'En Buddy Pages verás los apartados principales de la aplicación.', scrollTo: 'buddypages' },
    { keys: ['empleados', 'empleado'], texto: 'En Empleados puedes gestionar la información del personal.', scrollTo: 'empleados' },
    { keys: ['login', 'iniciar sesión'], texto: 'Para iniciar sesión usa el botón Login en la esquina superior derecha.', scrollTo: 'login' },
    { keys: ['registro', 'registrarse', 'signup'], texto: 'En Registro puedes crear una nueva cuenta.', scrollTo: 'registro' },
    { keys: ['lidar'], texto: 'La sección LIDAR explica cómo usamos esta tecnología para topografía y cartografía.', scrollTo: 'lidar' },
    { keys: ['quienes somos', 'quiénes somos', 'sobre nosotros'], texto: 'En "Quiénes somos" conocerás nuestro equipo y misión.', scrollTo: 'quienes-somos' },
    { keys: ['beneficios'], texto: 'En Beneficios verás las ventajas de usar nuestra plataforma.', scrollTo: 'beneficios' },
];

// Endpoint principal
router.post('/chat', (req, res) => {
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ error: 'Falta el campo mensaje' });

    const texto = mensaje.toLowerCase();

    // Buscar coincidencia: alguna palabra clave dentro del mensaje
    const match = respuestas.find(r => r.keys.some(k => texto.includes(k)));

    if (match) {
        return res.json({ respuesta: match.texto, scrollTo: match.scrollTo });
    }

    // Respuesta por defecto y sugerencias
    const fallback = {
        respuesta: 'No entendí bien. Prueba con: "¿Qué es LIDAR?", "¿Dónde está Empleados?", "¿Cómo iniciar sesión?"',
    };
    res.json(fallback);
});

module.exports = router;
