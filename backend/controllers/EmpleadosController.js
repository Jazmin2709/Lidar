const { db, promisePool } = require('../config/db');
const bcrypt = require('bcryptjs');

// ========================
// 📦 Listar todos los empleados
// ========================
exports.listar = async (req, res) => {
    try {
        const q = 'SELECT id_per, Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc, id_rol, activo FROM persona';
        const [results] = await promisePool.query(q);
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        return res.status(500).json({ message: 'Error al obtener empleados' });
    }
};

// ========================
// 🎭 Listar roles
// ========================
exports.listarRoles = async (req, res) => {
    try {
        const [results] = await promisePool.query('SELECT id_rol, nombre FROM rol ORDER BY id_rol ASC');
        return res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener roles:", error);
        return res.status(500).json({ message: 'Error al obtener roles' });
    }
};

// ========================
// ➕ Crear empleado
// ========================
exports.crear = async (req, res) => {
    try {
        const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, id_rol } = req.body;

        if (!Correo || !Nombres || !Apellidos || !Cedula || !Celular || !Contrasena || !Tipo_Doc || !id_rol) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const qExiste = 'SELECT id_per FROM persona WHERE Correo = ? OR Cedula = ? LIMIT 1';
        const [rows] = await promisePool.query(qExiste, [Correo, Cedula]);
        
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe un empleado con ese correo o cédula' });
        }

        const hashed = await bcrypt.hash(Contrasena, 10);
        const qInsert = `
            INSERT INTO persona (Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, id_rol, agreeTerms, codigo, activo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1)
        `;
        const [result] = await promisePool.query(qInsert, [Correo, Nombres, Apellidos, Cedula, Celular, hashed, Tipo_Doc, id_rol]);
        
        return res.status(200).json({ message: 'Empleado creado', id: result.insertId });
    } catch (error) {
        console.error("Error al crear empleado:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ========================
// 📝 Editar empleado
// ========================
exports.editar = async (req, res) => {
    try {
        const { id } = req.params;
        const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, id_rol } = req.body;

        if (!Correo || !Nombres || !Apellidos || !Cedula || !Celular || !Tipo_Doc || !id_rol) {
            return res.status(400).json({ message: 'Campos obligatorios incompletos' });
        }

        const qDup = 'SELECT id_per FROM persona WHERE (Correo = ? OR Cedula = ?) AND id_per <> ? LIMIT 1';
        const [rows] = await promisePool.query(qDup, [Correo, Cedula, id]);
        
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Otro empleado ya usa ese correo o cédula' });
        }

        let q = `UPDATE persona SET Correo = ?, Nombres = ?, Apellidos = ?, Cedula = ?, Celular = ?, Tipo_Doc = ?, id_rol = ?`;
        const params = [Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc, id_rol];

        if (Contrasena && String(Contrasena).trim() !== '') {
            const hashed = await bcrypt.hash(Contrasena, 10);
            q += `, Contrasena = ?`;
            params.push(hashed);
        }

        q += ` WHERE id_per = ?`;
        params.push(id);

        await promisePool.query(q, params);
        return res.status(200).json({ message: 'Empleado actualizado' });
        
    } catch (error) {
        console.error("Error al editar empleado:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// ========================
// 🔘 Activar/Desactivar empleado
// ========================
exports.toggleActivo = async (req, res) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;

        if (typeof activo === 'undefined') {
            return res.status(400).json({ message: 'El estado activo es requerido' });
        }

        const q = 'UPDATE persona SET activo = ? WHERE id_per = ?';
        const [result] = await promisePool.query(q, [activo, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado' });
        }
        
        return res.status(200).json({ 
            message: `Empleado ${activo ? 'activado' : 'desactivado'} correctamente` 
        });
    } catch (error) {
        console.error("Error al cambiar estado del empleado:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};