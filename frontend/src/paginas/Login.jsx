import React from 'react';
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export default function Login() {
    const [Usuario, setUsuario] = useState({
        Documento: '',
        Contrasena: '',
    });

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
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar',
                text: error.response.data.message,
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
        <div className='container-fluid'>
            <div className='justify-content-center align-items-center h-100'>
                <div className='container mt-5 p-5 shadow rounded-5 border-3 ' style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'auto', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                    <h1 className='text-center p-5'>
                        Iniciar Sesión
                    </h1>
                    <br />
                    <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>
                        <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="Cedula" className="form-label">Nº de Cédula</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Cedula"
                                value={Usuario.Documento}
                                name='Documento'
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Por favor ingresa tu número de cédula.</div>
                        </div>
                        <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="Contrasena" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="Contrasena"
                                value={Usuario.Contrasena}
                                name='Contrasena'
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Por favor ingresa tu Contraseña</div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit">
                                Ingresar
                            </button>
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
                        ¿Olvido su Conraseña? <a href="/EnviarCorreo">Recuperar Contraseña</a>
                    </p>
                </div>
            </div>
        </div>
    );
}