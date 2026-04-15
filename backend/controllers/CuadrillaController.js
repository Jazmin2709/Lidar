const { promisePool } = require('../config/db');
const moment = require('moment');

// Crear una cuadrilla y asignar miembros
exports.crearCuadrilla = async (req, res) => {
    try {
        const { nombre, tipo, id_supervisor, miembros } = req.body;
        const fecha = moment().format('YYYY-MM-DD');

        if (!nombre || !tipo || !id_supervisor || !miembros || miembros.length === 0) {
            return res.status(400).json({ message: "Datos incompletos para crear cuadrilla" });
        }

        // 1. Crear la cuadrilla
        const [result] = await promisePool.query(
            "INSERT INTO cuadrillas (nombre, tipo, fecha, id_supervisor) VALUES (?, ?, ?, ?)",
            [nombre, tipo, fecha, id_supervisor]
        );
        const id_cuadrilla = result.insertId;

        // 2. Insertar miembros
        const insertMiembrosSql = "INSERT INTO cuadrilla_miembros (id_cuadrilla, id_persona) VALUES ?";
        const values = miembros.map(id => [id_cuadrilla, id]);
        
        await promisePool.query(insertMiembrosSql, [values]);

        res.status(200).json({ message: "Cuadrilla creada y miembros asignados exitosamente", id_cuadrilla });
    } catch (error) {
        console.error("Error en crearCuadrilla:", error);
        res.status(500).json({ message: "Error al crear cuadrilla" });
    }
};

// Obtener cuadrillas del día
exports.getCuadrillasDia = async (req, res) => {
    try {
        const fecha = moment().format('YYYY-MM-DD');
        const [cuadrillas] = await promisePool.query(
            "SELECT * FROM cuadrillas WHERE fecha = ?",
            [fecha]
        );

        // Para cada cuadrilla, obtener sus miembros con su información de asistencia
        for (let c of cuadrillas) {
            const [miembros] = await promisePool.query(
                `SELECT p.id_per, p.Nombres, p.Apellidos, a.foto_url, a.latitud, a.longitud, a.hora as hora_asistencia
                 FROM cuadrilla_miembros cm
                 JOIN persona p ON cm.id_persona = p.id_per
                 LEFT JOIN asistencia a ON p.id_per = a.id_persona AND a.fecha = ?
                 WHERE cm.id_cuadrilla = ?`,
                [fecha, c.id_cuadrilla]
            );
            c.miembros = miembros;
        }

        res.status(200).json(cuadrillas);
    } catch (error) {
        console.error("Error en getCuadrillasDia:", error);
        res.status(500).json({ message: "Error al obtener cuadrillas" });
    }
};

// Obtener la asignación de un empleado hoy
exports.getMiAsignacion = async (req, res) => {
    try {
        const { id_persona } = req.params;
        const fecha = moment().format('YYYY-MM-DD');

        const sql = `
            SELECT c.*, s.Nombres as SupervisorNom, s.Apellidos as SupervisorApe
            FROM cuadrillas c
            JOIN cuadrilla_miembros cm ON c.id_cuadrilla = cm.id_cuadrilla
            JOIN persona s ON c.id_supervisor = s.id_per
            WHERE cm.id_persona = ? AND c.fecha = ?
        `;
        
        const [result] = await promisePool.query(sql, [id_persona, fecha]);
        
        if (result.length === 0) {
            return res.status(200).json({ asignado: false });
        }

        const cuadrilla = result[0];
        // Obtener compañeros
        const [companeros] = await promisePool.query(
            `SELECT p.Nombres, p.Apellidos 
             FROM cuadrilla_miembros cm
             JOIN persona p ON cm.id_persona = p.id_per
             WHERE cm.id_cuadrilla = ? AND p.id_per != ?`,
            [cuadrilla.id_cuadrilla, id_persona]
        );

        res.status(200).json({ 
            asignado: true, 
            cuadrilla: {
                ...cuadrilla,
                companeros
            }
        });
    } catch (error) {
        console.error("Error en getMiAsignacion:", error);
        res.status(500).json({ message: "Error al obtener tu asignación" });
    }
};

// Obtener empleados que asistieron hoy pero no están asignados a ninguna cuadrilla
exports.getEmpleadosSinCuadrilla = async (req, res) => {
    try {
        const fecha = moment().format('YYYY-MM-DD');
        const sql = `
            SELECT p.id_per, p.Nombres, p.Apellidos, a.hora as hora_asistencia,
                   a.foto_url, a.latitud, a.longitud
            FROM asistencia a
            JOIN persona p ON a.id_persona = p.id_per
            WHERE a.fecha = ?
            AND p.id_per NOT IN (
                SELECT cm.id_persona 
                FROM cuadrilla_miembros cm
                JOIN cuadrillas c ON cm.id_cuadrilla = c.id_cuadrilla
                WHERE c.fecha = ?
            )
        `;
        const [results] = await promisePool.query(sql, [fecha, fecha]);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error en getEmpleadosSinCuadrilla:", error);
        res.status(500).json({ message: "Error al obtener empleados disponibles" });
    }
};
