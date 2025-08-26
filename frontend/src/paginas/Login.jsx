import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export default function Login() {
    const [Usuario, setUsuario] = useState({
        Documento: '',
        Contrasena: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/ingresar`, Usuario);

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                const rol = response.data.rol;

                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                }).then(() => {
                    switch (rol) {
                        case 1: window.location.href = '/supervisor/dashboard'; break;
                        case 2: window.location.href = '/IndexEmpleado'; break;
                        case 3: window.location.href = '/admin/dashboard'; break;
                        default: window.location.href = '/Login'; break;
                    }
                });
            }
        } catch (error) {
            console.error('Error al ingresar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar',
                text: error.response?.data?.message || "Credenciales inválidas",
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let newValue = value;

        // 🚫 Filtrar solo números en Documento
        if (name === "Documento") {
            newValue = newValue.replace(/\D/g, ''); // quita letras y símbolos
        }

        setUsuario((prevState) => ({
            ...prevState,
            [name]: newValue,
        }));
    };

    return (
        <div className='container-fluid'>
            <div className='justify-content-center align-items-center h-100'>
                <div className='container mt-5 p-5 shadow rounded-5 border-3'
                    style={{
                        marginBottom: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        maxWidth: '400px',
                        backgroundColor: '#ffffff'
                    }}>

                    <h1 className='text-center p-5'>Iniciar Sesión</h1>

                    <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>

                        {/* Documento */}
                        <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="Cedula" className="form-label">Nº de Cédula</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Cedula"
                                name="Documento"
                                value={Usuario.Documento}
                                onChange={handleInputChange}
                                minLength={6}
                                maxLength={10}
                                pattern="^[0-9]{6,10}$"
                                title="La cédula debe contener solo números (6 a 10 dígitos)."
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="mb-3 position-relative" style={{ width: '300px' }}>
                            <label htmlFor="Contrasena" className="form-label">Contraseña</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                id="Contrasena"
                                name="Contrasena"
                                value={Usuario.Contrasena}
                                onChange={handleInputChange}
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$"
                                title="Mínimo 8 caracteres, incluir mayúscula, minúscula, número y caracter especial."
                                required
                            />

                            {/* 👁️ Ojitos toggle */}
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '30px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: showPassword ? 'green' : 'red'
                                }}
                            >
                                {showPassword ? "👀" : "🙈"}
                            </span>
                        </div>

                        <div className="text-center">
                            <button className="btn btn-primary" type="submit">Ingresar</button>
                        </div>

                        <style jsx>{`
                            button.btn.btn-primary:hover {
                                background-color: rgb(73, 1, 141);
                            }
                        `}</style>
                    </form>

                    <p className="mt-3 text-center">
                        ¿No tiene una cuenta? <a href="/Registrar">Regístrese aquí</a>
                    </p>
                    <p className="mt-3 text-center">
                        ¿Olvidó su contraseña? <a href="/EnviarCorreo">Recuperar Contraseña</a>
                    </p>
                </div>
            </div>
        </div>
    );
}