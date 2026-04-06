import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import '../css/RecuperarContrasena.css';  // ← Importamos el CSS

const API_URL = 'http://localhost:3000/api';

export default function RecuperarContrasena() {
    const correo = localStorage.getItem('correo');

    const [Usuario, setUsuario] = useState({
        Correo: correo,
        Codigo: '',
        NuevaContrasena: '',
        ConfirmarContrasena: ''
    });

    const [showNueva, setShowNueva] = useState(false);
    const [showConfirmar, setShowConfirmar] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (Usuario.NuevaContrasena !== Usuario.ConfirmarContrasena) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden',
            });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/recuperarContrasena`, Usuario);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                }).then(() => {
                    window.location.href = '/Login';
                });
            }
        } catch (error) {
            console.error('Error al ingresar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar',
                text: error.response?.data?.message || 'Ocurrió un error inesperado',
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className="container-fluid recuperar-container">
            <div className="recuperar-card">
                <h1 className="recuperar-title">Recuperar Contraseña</h1>

                <form className="recuperar-form" noValidate onSubmit={handleSubmit}>
                    {/* Código */}
                    <div className="recuperar-input-group">
                        <label htmlFor="Codigo" className="recuperar-label">Código</label>
                        <input
                            type="text"
                            className="form-control"
                            id="Codigo"
                            value={Usuario.Codigo}
                            name="Codigo"
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">
                            Por favor ingresa el código que recibiste
                        </div>
                    </div>

                    {/* Nueva Contraseña */}
                    <div className="recuperar-input-group">
                        <label htmlFor="NuevaContrasena" className="recuperar-label">Nueva Contraseña</label>
                        <input
                            type={showNueva ? "text" : "password"}
                            className="form-control"
                            id="NuevaContrasena"
                            value={Usuario.NuevaContrasena}
                            name="NuevaContrasena"
                            onChange={handleInputChange}
                            required
                        />
                        <span
                            className="recuperar-eye-icon"
                            onClick={() => setShowNueva(!showNueva)}
                        >
                            {showNueva ? "👀" : "🙈"}
                        </span>
                        <div className="invalid-feedback">
                            Por favor ingresa tu nueva contraseña
                        </div>
                    </div>

                    {/* Confirmar Contraseña */}
                    <div className="recuperar-input-group">
                        <label htmlFor="ConfirmarContrasena" className="recuperar-label">Confirmar Contraseña</label>
                        <input
                            type={showConfirmar ? "text" : "password"}
                            className="form-control"
                            id="ConfirmarContrasena"
                            value={Usuario.ConfirmarContrasena}
                            name="ConfirmarContrasena"
                            onChange={handleInputChange}
                            required
                        />
                        <span
                            className="recuperar-eye-icon"
                            onClick={() => setShowConfirmar(!showConfirmar)}
                        >
                            {showConfirmar ? "🙉" : "🙈"}
                        </span>
                        <div className="invalid-feedback">
                            Por favor confirma tu nueva contraseña
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-primary recuperar-btn" type="submit">
                            Recuperar
                        </button>
                    </div>

                    {/* Reenviar código */}
                    <div className="text-center mt-3">
                        <p style={{ fontSize: '14px' }}>
                            ¿No te llegó el correo?{' '}
                            <span
                                className="recuperar-reenviar"
                                onClick={() => {
                                    localStorage.removeItem('correo');
                                    window.location.href = '/EnviarCorreo';
                                }}
                            >
                                Reenviar código
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}