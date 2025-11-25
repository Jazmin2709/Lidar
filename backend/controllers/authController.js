const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const secret = 'mi-secreto';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'lidarnotificador@gmail.com',
        pass: 'sheq slcr idya okrd'
    }
});

exports.registrar = async (req, res) => {
    try {
        const { Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, agreeTerms } = req.body;

        console.log(req.body);

        if (!Correo || !Nombres || !Apellidos || !Cedula || !Celular || !Contrasena || !Tipo_Doc || !agreeTerms) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const hashedPassword = await bcrypt.hash(Contrasena, 10);

        const qUsuario = 'SELECT * FROM persona WHERE Correo = ? OR Cedula = ?';
        db.query(qUsuario, [Correo, Cedula], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al registrar el usuario' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'El correo o cédula ya está registrado' });
            }

            const query = 'INSERT INTO persona (Correo, Nombres, Apellidos, Cedula, Celular, Contrasena, Tipo_Doc, agreeTerms, id_rol, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 2, 1)';
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

// FUNCIÓN INGRESAR MEJORADA - ACEPTA EMAIL O CÉDULA
exports.ingresar = async (req, res) => {
    try {
        const { Documento, Contrasena } = req.body;
        console.log('Login attempt:', req.body);
        
        if (!Documento) {
            return res.status(400).json({ message: 'El correo o cédula es obligatorio' });
        }

        if (!Contrasena) {
            return res.status(400).json({ message: 'La contraseña es obligatoria' });
        }

        // BUSCAR POR EMAIL O CÉDULA
        const query = 'SELECT * FROM persona WHERE Correo = ? OR Cedula = ?';
        db.query(query, [Documento, Documento], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al ingresar' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Credenciales incorrectas' });
            }

            const user = results[0];

            // VALIDAR USUARIO INACTIVO
            if (user.activo === 0) {
                return res.status(403).json({ 
                    message: 'Cuenta deshabilitada. Contacta al administrador.' 
                });
            }

            // VERIFICAR CONTRASEÑA
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
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.validarToken = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            req.userId = decoded.id;
            return res.send({ id: decoded.id, rol: decoded.rol });
        });
    } catch (error) {
        console.error(error);
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
        db.query(query, [Correo], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al ingresar' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'El correo no está registrado' });
            }

            const usuario = results[0];
            
            // Validar usuario inactivo también para recuperación
            if (usuario.activo === 0) {
                return res.status(403).json({ 
                    message: 'Cuenta deshabilitada. Contacta al administrador.' 
                });
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
                from: 'lidarnotificador@gmail.com',
                to: Correo,
                subject: 'Código de verificación para restablecer contraseña || Lidar',
                html: `
                <div class="container" style="background-color: #3483CD; color: #fff; padding: 80px;">
                    <h1>Recuperación de Contraseña</h1>
                    <p style="font-size: 25px;">Tu código de verificación es:</p>
                    <h2 style="font-size: 40px; font-weight: bold; color:rgb(255, 255, 255);">${verificationCode}</h2>
                    <p>Por favor, ingrésalo en el formulario de recuperación de contraseña.</p>
                    <p>Si no solicitaste este cambio, ignora este mensaje.</p>
                    <p>Gracias,</p>
                    <p>El equipo de soporte</p>
                </div>
                `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error al enviar el correo' });
                }

                const updateQuery = 'UPDATE persona SET Codigo = ?, UltimoEnvio = ? WHERE Correo = ?';
                db.query(updateQuery, [verificationCode, ahora, Correo], (error) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ message: 'Error al actualizar el código' });
                    }
                    return res.status(200).json({ correo: Correo, message: 'Correo enviado exitosamente' });
                });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

exports.recuperarContrasena = async (req, res) => {
    try {
        const { Correo, Codigo, NuevaContrasena } = req.body;
        console.log(req.body);
        if (!Correo) {
            return res.status(400).json({ message: 'El correo es obligatorio' });
        }

        if (!Codigo) {
            return res.status(400).json({ message: 'El código es obligatorio' });
        }

        if (!NuevaContrasena) {
            return res.status(400).json({ message: 'La nueva contraseña es obligatoria' });
        }

        const query = 'SELECT * FROM persona WHERE Correo = ? AND Codigo = ?';
        db.query(query, [Correo, Codigo], async (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Error al ingresar' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Código incorrecto o correo no registrado' });
            }

            const hashedPassword = await bcrypt.hash(NuevaContrasena, 10);

            db.query('UPDATE persona SET Contrasena = ? WHERE Correo = ?', [hashedPassword, Correo], (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Error al actualizar la contraseña' });
                }
                return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}