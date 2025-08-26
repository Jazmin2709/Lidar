const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const buddyRoutes = require('./routes/BuddyPartners');
const empleadosRoutes = require('./routes/empleados');

const port = process.env.PORT || 3000;

const app = express();  

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/buddy', buddyRoutes);
app.use('/api/empleados', empleadosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Api de Lidar');
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});