const { db, promisePool } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const secret = process.env.JWT_SECRET || 'mi-secreto';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.registrar = async (req, res) => {
    try {
        const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, agreeTerms } = req.body;

        if (!Correo || !Nombres || !Apellidos || !Cedula || !Celular || !Contrasena || !Tipo_Doc || !agreeTerms) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(Contrasena, 10);

        const qUsuario = 'SELECT * FROM persona WHERE Correo = ? OR Cedula = ?';
        const [results] = await promisePool.query(qUsuario, [Correo, Cedula]);

        if (results.length > 0) {
            return res.status(400).json({ message: 'El correo o cédula ya está registrado' });
        }

        const query = 'INSERT INTO persona (Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, agreeTerms, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2, 1)';
        const values = [Correo, Nombres, Apellidos, Cedula, Celular, hashedPassword, Tipo_Doc, agreeTerms];

        await promisePool.query(query, values);
        return res.status(200).json({ message: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error("Error en registrar:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.ingresar = async (req, res) => {
    try {
        const { Documento, Contrasena } = req.body;
        
        if (!Documento || !Contrasena) {
            return res.status(400).json({ message: 'El documento (correo/cédula) y contraseña son obligatorios' });
        }

        const query = 'SELECT * FROM persona WHERE Correo = ? OR Cedula = ?';
        const [results] = await promisePool.query(query, [Documento, Documento]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = results[0];

        if (user.activo === 0) {
            return res.status(403).json({ message: 'Cuenta deshabilitada. Contacta al administrador.' });
        }

        const isPasswordValid = await bcrypt.compare(Contrasena, user.Contrasena);
        if (isPasswordValid) {
            const token = jwt.sign({ id: user.id_per, rol: user.id_rol }, secret, { expiresIn: '30d' });
            return res.status(200).json({ 
                rol: user.id_rol, 
                message: 'Ingreso exitoso', 
                token: token,
                usuario: {
                    id: user.id_per,
                    nombre: user.Nombres,
                    email: user.Correo
                }
            });
        } else {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        console.error("Error en ingresar:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.validarToken = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'No hay token' });
        }
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            return res.send({ id: decoded.id, rol: decoded.rol });
        });
    } catch (error) {
        console.error("Error en validarToken:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.enviarCorreo = async (req, res) => {
    try {
        const { Correo } = req.body;
        if (!Correo) {
            return res.status(400).json({ message: 'El correo es obligatorio' });
        }

        const query = 'SELECT * FROM persona WHERE Correo = ?';
        const [results] = await promisePool.query(query, [Correo]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'El correo no está registrado' });
        }

        const usuario = results[0];
        if (usuario.activo === 0) {
            return res.status(403).json({ message: 'Cuenta deshabilitada. Contacta al administrador.' });
        }

        const ahora = new Date();
        if (usuario.UltimoEnvio) {
            const ultimaFecha = new Date(usuario.UltimoEnvio);
            const diferenciaMinutos = (ahora - ultimaFecha) / 60000;
            if (diferenciaMinutos < 2) {
                return res.status(429).json({
                    message: `Ya se envió un código recientemente. Espera ${Math.ceil(2 - diferenciaMinutos)} minuto(s).`
                });
            }
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Correo,
            subject: 'Código de verificación para restablecer contraseña || Lidar',
            html: `
            <div style="background-color: #3483CD; color: #fff; padding: 40px; font-family: sans-serif; border-radius: 10px;">
                <h1 style="text-align: center;">Recuperación de Contraseña</h1>
                <p style="font-size: 18px; text-align: center;">Tu código de verificación es:</p>
                <div style="background-color: #fff; color: #3483CD; padding: 20px; font-size: 40px; font-weight: bold; text-align: center; border-radius: 5px; margin: 20px 0;">
                    ${verificationCode}
                </div>
                <p style="text-align: center;">Ingrésalo en el formulario de recuperación de contraseña para continuar.</p>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.3); margin: 20px 0;">
                <p style="font-size: 14px; text-align: center; opacity: 0.8;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        const updateQuery = 'UPDATE persona SET Codigo = ?, UltimoEnvio = ? WHERE Correo = ?';
        await promisePool.query(updateQuery, [verificationCode, ahora, Correo]);

        return res.status(200).json({ correo: Correo, message: 'Correo enviado exitosamente' });

    } catch (error) {
        console.error("Error en enviarCorreo:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.recuperarContrasena = async (req, res) => {
    try {
        const { Correo, Codigo, NuevaContrasena } = req.body;
        if (!Correo || !Codigo || !NuevaContrasena) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const query = 'SELECT * FROM persona WHERE Correo = ? AND Codigo = ?';
        const [results] = await promisePool.query(query, [Correo, Codigo]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Código incorrecto o correo no registrado' });
        }

        const hashedPassword = await bcrypt.hash(NuevaContrasena, 10);
        await promisePool.query('UPDATE persona SET Contrasena = ?, Codigo = NULL WHERE Correo = ?', [hashedPassword, Correo]);

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });

    } catch (error) {
        console.error("Error en recuperarContrasena:", error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}