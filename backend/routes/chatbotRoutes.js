const express = require('express');
const router = express.Router();

// Lista de respuestas con palabras clave y el id de la sección para hacer scroll
const respuestas = [
    { keys: ['hola' ,'holi'], texto: 'Hola, como estás? En que puedo ayudarte?', scrollTo: 'Hola' },
    { keys: ['inicio', 'home'], texto: 'Puedes volver al inicio usando el menú o desplazándote hacia arriba.', scrollTo: 'inicio' },
    { keys: ['buddy', 'buddy pages'], texto: 'En Buddy encontrarás los formularios que los empleados deben llenar diariamente, los encontraras al iniciar sesión', scrollTo: 'buddypages' },
    { keys: ['empleados', 'empleado'], texto: 'Empleados lo encuentras al iniciar sesión, ahí podrás llenar los formularios y gestionar tu cuenta.', scrollTo: 'empleados' },
    { keys: ['login', 'iniciar sesión'], texto: 'Para iniciar sesión usa el botón "Iniciar Sesión" en la esquina superior derecha.', scrollTo: 'login' },
    { keys: ['registro', 'registrarse', 'signup'], texto: 'Registro lo encuentras en la parte superior derecha al lado izquierdo del botón "Iniciar Sesión".', scrollTo: 'registro' },
    { keys: ['lidar'], texto: 'La sección LIDAR explica cómo usamos esta tecnología para topografía y cartografía.', scrollTo: 'lidar' },
    { keys: ['quienes somos', 'quiénes somos', 'sobre nosotros'], texto: 'En "Quiénes somos" conocerás nuestro equipo, que servicios ofrecemos y los sectores de actividad donde nos desarrollamos.', scrollTo: 'quienes-somos' },
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
