const db = require('../config/db');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto';

// --- Helpers de validación ---
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const isLetters = (v) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(String(v || '').trim());
const isDigits = (v, min = 5, max = 15) => new RegExp(`^\\d{${min},${max}}$`).test(String(v || '').trim());
const allowedDocs = new Set(['CC', 'PA', 'PP']); // según tu UI actual

// Extrae userId y rol desde el token Bearer
function getUserFromAuthHeader(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { id: decoded.id, rol: decoded.rol };
    } catch {
        return null;
    }
}

// GET /api/perfil/me  -> sólo Supervisor(1) o Empleado(2)
exports.obtenerPerfilMe = (req, res) => {
    const user = getUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ message: 'No autenticado' });
    if (![1, 2].includes(Number(user.rol))) {
        return res.status(403).json({ message: 'No autorizado' });
    }

    const sql = `
    SELECT Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc
    FROM persona
    WHERE id_per = ? AND id_rol IN (1, 2)
    LIMIT 1
  `;
    db.query(sql, [user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error al obtener perfil' });
        if (rows.length === 0) return res.status(404).json({ message: 'Perfil no encontrado' });
        return res.json(rows[0]);
    });
};

// PUT /api/perfil/me  -> actualiza perfil del usuario autenticado
exports.actualizarPerfilMe = (req, res) => {
    const user = getUserFromAuthHeader(req);
    if (!user) return res.status(401).json({ message: 'No autenticado' });
    if (![1, 2].includes(Number(user.rol))) {
        return res.status(403).json({ message: 'No autorizado' });
    }

    const { Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc } = req.body;

    // Validaciones
    if (!isEmail(Correo)) return res.status(400).json({ message: 'Correo inválido' });
    if (!isLetters(Nombres)) return res.status(400).json({ message: 'Nombres: solo letras y espacios' });
    if (!isLetters(Apellidos)) return res.status(400).json({ message: 'Apellidos: solo letras y espacios' });
    if (!isDigits(Cedula, 5, 15)) return res.status(400).json({ message: 'Cédula: solo dígitos (5 a 15)' });
    if (!isDigits(Celular, 7, 15)) return res.status(400).json({ message: 'Celular: solo dígitos (7 a 15)' });
    if (!allowedDocs.has(String(Tipo_Doc))) return res.status(400).json({ message: 'Tipo de documento inválido' });

    // Evitar duplicados de Correo o Cédula con otros usuarios
    const qDup = `SELECT id_per FROM persona WHERE (Correo = ? OR Cedula = ?) AND id_per <> ? LIMIT 1`;
    db.query(qDup, [Correo, Cedula, user.id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Error al validar duplicados' });
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Correo o Cédula ya están en uso por otro usuario' });
        }

        const q = `
      UPDATE persona
      SET Correo = ?, Nombres = ?, Apellidos = ?, Cedula = ?, Celular = ?, Tipo_Doc = ?
      WHERE id_per = ? AND id_rol IN (1, 2)
    `;
        db.query(q, [Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc, user.id], (err2) => {
            if (err2) return res.status(500).json({ message: 'Error al actualizar perfil' });
            return res.json({ message: 'Perfil actualizado correctamente' });
        });
    });
};
