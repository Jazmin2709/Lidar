// Importación de React
import React from 'react';

// Importación de axios para hacer peticiones HTTP
import axios from 'axios';

// Importación del hook useState para manejar el estado local
import { useState } from 'react';

// Importación de SweetAlert2 para mostrar alertas estilizadas
import Swal from 'sweetalert2';

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Componente funcional Login
export default function Login() {

    // Estado para almacenar los datos del usuario (documento y contraseña)
    const [Usuario, setUsuario] = useState({
        Documento: '',
        Contrasena: '',
    });

    // Función que maneja el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario

        try {
            // Se hace una petición POST a la API para autenticar al usuario
            const response = await axios.post(`${API_URL}/auth/ingresar`, Usuario);

            // Si la respuesta es exitosa
            if (response.status === 200) {
                // Se guarda el token en localStorage
                localStorage.setItem('token', response.data.token);

                // Se obtiene el rol del usuario autenticado
                const rol = response.data.rol;

                // Muestra alerta de éxito y redirecciona según el rol
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
            // Si hay error, lo muestra en consola y lanza alerta
            console.error('Error al ingresar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar',
                text: error.response.data.message,
            });
        }
    };

    // Función para manejar cambios en los inputs del formulario
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        // Actualiza el estado del usuario de manera dinámica
        setUsuario((prevState) => ({
            ...prevState,
            [name]: value,
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
                        width: 'auto',
                        maxWidth: '400px',
                        backgroundColor: '#ffffff'
                    }}>

                    {/* Título del formulario */}
                    <h1 className='text-center p-5'>Iniciar Sesión</h1>

                    <br />

                    {/* Formulario de inicio de sesión */}
                    <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>

                        {/* Campo de número de cédula */}
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

                        {/* Campo de contraseña */}
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

                        {/* Botón para enviar el formulario */}
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit">
                                Ingresar
                            </button>
                        </div>

                        {/* Estilos para el botón al pasar el mouse */}
                        <style jsx>{`
                            button.btn.btn-primary:hover {
                                background-color: rgb(73, 1, 141);
                            }
                        `}</style>
                    </form>

                    {/* Enlaces a registro y recuperación de contraseña */}
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
