const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Importamos rutas
const authRoutes = require('./routes/auth');
const buddyRoutes = require('./routes/BuddyPartners');
const empleadosRoutes = require('./routes/empleados');

const imagenesRoutes = require('./routes/imagenes');
const chatbotRoutes = require('./routes/chatbotRoutes');
app.use('/api/chatbot', chatbotRoutes);


const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas del API
app.use('/api/auth', authRoutes);
app.use('/api/buddy', buddyRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/imagenes', imagenesRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Lidar funcionando 🚀');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend en http://localhost:${PORT}`);
});
