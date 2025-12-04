import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// URL base del backend
const API_URL = 'http://localhost:3000/api';

export default function Login() {

    // Estado para guardar los datos del usuario (Documento y Contraseña)
    const [Usuario, setUsuario] = useState({ Documento: '', Contrasena: '' });

    // Estado para mostrar/ocultar la contraseña
    const [showPassword, setShowPassword] = useState(false);

    // ------------------------------------
    // 🔹 FUNCIÓN: Enviar formulario de login
    // ------------------------------------
    const handleSubmit = async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        try {
            // Envía los datos al backend para validar
            const response = await axios.post(`${API_URL}/auth/ingresar`, Usuario);

            // Si la petición fue exitosa (status 200)
            if (response.status === 200) {

                // Guarda el token en LocalStorage
                localStorage.setItem('token', response.data.token);

                // Obtiene el rol enviado desde el backend
                const rol = response.data.rol;

                // Muestra alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: response.data.message
                }).then(() => {

                    // Redirecciona según el rol
                    switch (rol) {
                        case 1:
                            window.location.href = '/supervisor/dashboard';
                            break;
                        case 2:
                            window.location.href = '/IndexEmpleado';
                            break;
                        case 3:
                            window.location.href = '/admin/dashboard';
                            break;
                        default:
                            window.location.href = '/Login';
                            break;
                    }
                });
            }

        } catch (error) {
            console.error('Error al ingresar:', error);

            // Alerta en caso de error o credenciales incorrectas
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar',
                text: error.response?.data?.message || 'Credenciales inválidas',
            });
        }
    };

    // ------------------------------------
    // 🔹 FUNCIÓN: Manejo de inputs
    // ------------------------------------
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let newValue = value;

        // Restringe el Documento a solo números
        if (name === 'Documento') newValue = newValue.replace(/\D/g, '');

        setUsuario((prev) => ({ ...prev, [name]: newValue }));
    };

    return (
        // Contenedor centrado vertical y horizontalmente
        <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: '100vh' }}
        >
            {/* Card del formulario */}
            <div
                className="w-100 p-5 pt-5 pb-5 shadow rounded-4 border bg-white"
                style={{ maxWidth: '520px' }}
            >
                <h1 className="text-center mb-4">Iniciar Sesión</h1>

                {/* Formulario */}
                <form className="w-100" noValidate onSubmit={handleSubmit}>

                    {/* ----------------------
                        Campo: Documento
                    ------------------------ */}
                    <div className="mb-3">
                        <label htmlFor="Cedula" className="form-label">Nº de Cédula</label>

                        <input
                            type="text"
                            className="form-control"
                            id="Cedula"
                            name="Documento"
                            value={Usuario.Documento}
                            onChange={handleInputChange}

                            // Validaciones de longitud y números
                            minLength={6}
                            maxLength={10}
                            pattern="^[0-9]{6,10}$"
                            title="La cédula debe contener solo números (6 a 10 dígitos)."
                            required
                        />
                    </div>

                    {/* ----------------------
                        Campo: Contraseña
                    ------------------------ */}
                    <div className="mb-3 position-relative">
                        <label htmlFor="Contrasena" className="form-label">Contraseña</label>

                        <input
                            type={showPassword ? 'text' : 'password'} // alterna entre visible y oculto
                            className="form-control"
                            id="Contrasena"
                            name="Contrasena"
                            value={Usuario.Contrasena}
                            onChange={handleInputChange}

                            // Validación fuerte de contraseña
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$"
                            title="Mínimo 8 caracteres, incluir mayúscula, minúscula, número y caracter especial."
                            required
                        />

                        {/* Ícono para mostrar/ocultar contraseña */}
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '5px',
                                top: '30px',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                userSelect: 'none'
                            }}
                        >
                            {showPassword ? '👀' : '🙈'}
                        </span>
                    </div>

                    {/* Botón de enviar */}
                    <div className="text-center mb-3">
                        <button className="btn btn-primary w-100" type="submit">
                            Ingresar
                        </button>
                    </div>
                </form>

                {/* Links de registro y recuperación */}
                <p className="mt-3 text-center">
                    ¿No tiene una cuenta? <a href="/Registrar">Regístrese aquí</a>
                </p>

                <p className="text-center">
                    ¿Olvidó su contraseña? <a href="/EnviarCorreo">Recuperar Contraseña</a>
                </p>
            </div>
        </div>
    );
}
