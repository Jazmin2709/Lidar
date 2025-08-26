const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Listar todos los empleados
exports.listar = (req, res) => {
  const q = 'SELECT id_per, Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc, id_rol FROM persona';
  db.query(q, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener empleados' });
    }
    return res.status(200).json(results);
  });
};

// Listar roles (para el select del formulario)
exports.roles = (req, res) => {
  db.query('SELECT id_rol, nombre FROM rol ORDER BY id_rol ASC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error al obtener roles' });
    }
    return res.status(200).json(results);
  });
};

// Crear empleado
exports.crear = async (req, res) => {
  try {
    const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, id_rol } = req.body;

    // Validaciones mínimas
    if (!Correo || !Nombres || !Apellidos || !Cedula || !Celular || !Contrasena || !Tipo_Doc || !id_rol) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Verificar duplicados (correo o cédula)
    const qExiste = 'SELECT id_per FROM persona WHERE Correo = ? OR Cedula = ? LIMIT 1';
    db.query(qExiste, [Correo, Cedula], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al validar duplicados' });
      }
      if (rows.length > 0) {
        return res.status(400).json({ message: 'Ya existe un empleado con ese correo o cédula' });
      }

      const hashed = await bcrypt.hash(Contrasena, 10);
      const qInsert = `
        INSERT INTO persona (Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, id_rol, agreeTerms, codigo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
      `;
      db.query(qInsert, [Correo, Nombres, Apellidos, Cedula, Celular, hashed, Tipo_Doc, id_rol], (err2, result) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: 'Error al crear empleado' });
        }
        return res.status(200).json({ message: 'Empleado creado', id: result.insertId });
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Editar empleado (si no envías Contrasena, no se cambia)
exports.editar = async (req, res) => {
  try {
    const { id } = req.params;
    const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, id_rol } = req.body;

    if (!Correo || !Nombres || !Apellidos || !Cedula || !Celular || !Tipo_Doc || !id_rol) {
      return res.status(400).json({ message: 'Campos obligatorios incompletos' });
    }

    // Validar duplicados contra otros usuarios
    const qDup = 'SELECT id_per FROM persona WHERE (Correo = ? OR Cedula = ?) AND id_per <> ? LIMIT 1';
    db.query(qDup, [Correo, Cedula, id], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al validar duplicados' });
      }
      if (rows.length > 0) {
        return res.status(400).json({ message: 'Otro empleado ya usa ese correo o cédula' });
      }

      // Armar SQL dinámico si viene contraseña
      let q = `
        UPDATE persona
        SET Correo = ?, Nombres = ?, Apellidos = ?, Cedula = ?, Celular = ?, Tipo_Doc = ?, id_rol = ?
      `;
      const params = [Correo, Nombres, Apellidos, Cedula, Celular, Tipo_Doc, id_rol];

      if (Contrasena && String(Contrasena).trim() !== '') {
        const hashed = await bcrypt.hash(Contrasena, 10);
        q += `, Contrasena = ?`;
        params.push(hashed);
      }

      q += ` WHERE id_per = ?`;
      params.push(id);

      db.query(q, params, (err2) => {
        if (err2) {
          console.error(err2);
          return res.status(500).json({ message: 'Error al actualizar empleado' });
        }
        return res.status(200).json({ message: 'Empleado actualizado' });
      });
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar empleado
exports.eliminar = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM persona WHERE id_per = ?', [id], (err) => {
    if (err) {
      console.error(err);
      // Si está referenciado en buddy, MySQL lanzará error por la FK
      if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
        return res.status(400).json({ message: 'No se puede eliminar: el empleado tiene reportes asociados (buddy)' });
      }
      return res.status(500).json({ message: 'Error al eliminar empleado' });
    }
    return res.status(200).json({ message: 'Empleado eliminado' });
  });
};
