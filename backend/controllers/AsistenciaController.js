const { promisePool } = require('../config/db');
const moment = require('moment');

// Registrar asistencia
exports.registrarAsistencia = async (req, res) => {
    try {
        const { id_persona, foto_url, latitud, longitud } = req.body;

        if (!id_persona || !foto_url || !latitud || !longitud) {
            return res.status(400).json({ message: "Faltan datos obligatorios para el registro" });
        }

        const fecha = moment().format('YYYY-MM-DD');
        const hora = moment().format('HH:mm:ss');

        // Verificar si ya registró asistencia hoy
        const [existe] = await promisePool.query(
            "SELECT * FROM asistencia WHERE id_persona = ? AND fecha = ?",
            [id_persona, fecha]
        );

        if (existe.length > 0) {
            return res.status(400).json({ message: "Ya has registrado tu asistencia el día de hoy." });
        }

        const sql = "INSERT INTO asistencia (id_persona, fecha, hora, foto_url, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?)";
        await promisePool.query(sql, [id_persona, fecha, hora, foto_url, latitud, longitud]);

        res.status(200).json({ message: "Asistencia registrada correctamente. ¡Buen día de trabajo!" });
    } catch (error) {
        console.error("Error en registrarAsistencia:", error);
        res.status(500).json({ message: "Error interno al registrar asistencia" });
    }
};

// Obtener asistencias del día (para el supervisor)
exports.getAsistenciasHoy = async (req, res) => {
    try {
        const fecha = moment().format('YYYY-MM-DD');
        const sql = `
            SELECT a.*, p.Nombres, p.Apellidos 
            FROM asistencia a
            JOIN persona p ON a.id_persona = p.id_per
            WHERE a.fecha = ?
        `;
        const [results] = await promisePool.query(sql, [fecha]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error en getAsistenciasHoy:", error);
        res.status(500).json({ message: "Error al obtener asistencias" });
    }
};

// Verificar si el usuario ya marcó hoy
exports.verificarAsistencia = async (req, res) => {
    try {
        const { id_persona } = req.params;
        const fecha = moment().format('YYYY-MM-DD');
        const [results] = await promisePool.query(
            "SELECT * FROM asistencia WHERE id_persona = ? AND fecha = ?",
            [id_persona, fecha]
        );
        res.status(200).json({ registrado: results.length > 0 });
    } catch (error) {
        res.status(500).json({ message: "Error al verificar asistencia" });
    }
};
