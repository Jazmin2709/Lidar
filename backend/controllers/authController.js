const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'mi-secreto';

exports.registrar = async (req, res) => {
    try {
        const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, agreeTerms } = req.body;

        console.log(req.body);

        if (!Correo) {
            return res.status(400).json({ message: 'El correo es obligatorio' });
        }

        if (!Nombres) {
            return res.status(400).json({ message: 'Los nombres son obligatorios' });
        }

        if (!Apellidos) {
            return res.status(400).json({ message: 'Los apellidos son obligatorios' });
        }

        if (!Cedula) {
            return res.status(400).json({ message: 'La cédula es obligatoria' });
        }

        if (!Celular) {
            return res.status(400).json({ message: 'El celular es obligatorio' });
        }

        if (!Contrasena) {
            return res.status(400).json({ message: 'La contraseña es obligatoria' });
        }

        if (!Tipo_Doc) {
            return res.status(400).json({ message: 'El tipo de documento es obligatorio' });
        }

        if (!agreeTerms) {
            return res.status(400).json({ message: 'Debes aceptar los términos y condiciones' });
        }

        const hashedPassword = await bcrypt.hash(Contrasena, 10);

        const qUsuario = 'SELECT * FROM persona WHERE Correo = ?';
        db.query(qUsuario, [Correo], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'El correo ya está registrado' });
            }

            const query = 'INSERT INTO persona (Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, agreeTerms, id_rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)';
            const values = [Correo, Nombres, Apellidos, Cedula, Celular, hashedPassword, Tipo_Doc, agreeTerms];

            db.query(query, values, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error al registrar el usuario' });
                }
                return res.status(200).json({ message: 'Usuario registrado exitosamente' });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.ingresar = async (req, res) => {
    try {
        const { Correo, Contrasena } = req.body;

        if (!Correo) {
            return res.status(400).json({ message: 'El correo es obligatorio' });
        }

        if (!Contrasena) {
            return res.status(400).json({ message: 'La contraseña es obligatoria' });
        }

        const query = 'SELECT * FROM persona WHERE Correo = ?';
        db.query(query, [Correo], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al ingresar' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'El correo no está registrado' });
            }

            const user = results[0];

            if (bcrypt.compareSync(Contrasena, user.Contrasena)) {
                const token = jwt.sign({ id: user.id_per }, secret, { expiresIn: '30d' });
                return res.status(200).json({ message: 'Ingreso exitoso', token: token });
            } else {
                return res.status(401).json({ message: 'El correo o la contraseña son incorrectos' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.validarToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            req.userId = decoded.id;
            return res.send({ id: decoded.id });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};