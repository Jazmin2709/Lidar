const express = require('express');
const cors = require('cors');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas del API
app.use('/api', chatbotRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor backend en http://localhost:${PORT}`));
