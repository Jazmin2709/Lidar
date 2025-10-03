import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


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
        <div className='container-fluid'>
            <div className='justify-content-center align-items-center h-100'>
                <div
                    className='container mt-5 p-5 shadow rounded-5 border-3'
                    style={{
                        marginBottom: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'auto',
                        maxWidth: '400px',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <h1 className='text-center p-5'>Recuperar Contraseña</h1>
                    <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>

                        {/* Código */}
                        <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="Codigo" className="form-label">Código</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Codigo"
                                value={Usuario.Codigo}
                                name='Codigo'
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Por favor ingresa el código que recibiste</div>
                        </div>


                        {/* Nueva Contraseña */}
                        <div className="mb-3" style={{ width: '300px', position: 'relative' }}>
                            <label htmlFor="NuevaContrasena" className="form-label">Nueva Contraseña</label>
                            <input
                                type={showNueva ? "text" : "password"}
                                className="form-control"
                                id="NuevaContrasena"
                                value={Usuario.NuevaContrasena}
                                name='NuevaContrasena'
                                onChange={handleInputChange}
                                required
                            />
                            <span
                                onClick={() => setShowNueva(!showNueva)}
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '31px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem'
                                }}
                            >
                                {showNueva ? "👀" : "🙈"}
                            </span>
                            <div className="invalid-feedback">Por favor ingresa tu nueva contraseña</div>
                        </div>


                        {/* Confirmar Contraseña */}
                        <div className="mb-3" style={{ width: '300px', position: 'relative' }}>
                            <label htmlFor="ConfirmarContrasena" className="form-label">Confirmar Contraseña</label>
                            <input
                                type={showConfirmar ? "text" : "password"}
                                className="form-control"
                                id="ConfirmarContrasena"
                                value={Usuario.ConfirmarContrasena}
                                name='ConfirmarContrasena'
                                onChange={handleInputChange}
                                required
                            />
                            <span
                                onClick={() => setShowConfirmar(!showConfirmar)}
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '31px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem'



                                }}
                            >
                                {showConfirmar ? "👀" : "🙈"}
                            </span>
                            <div className="invalid-feedback">Por favor confirma tu nueva contraseña</div>
                        </div>


                        <div className="text-center">
                            <button className="btn btn-primary" type="submit">
                                Recuperar
                            </button>
                        </div>


                        {/* Reenviar código */}
                        <div className="text-center mt-3">
                            <p style={{ fontSize: '14px' }}>
                                ¿No te llegó el correo?{' '}
                                <span
                                    style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => {
                                        localStorage.removeItem('correo');
                                        window.location.href = '/EnviarCorreo';
                                    }}
                                >
                                    Reenviar código
                                </span>
                            </p>
                        </div>


                        <style jsx>{`
                            button.btn.btn-primary:hover {
                                background-color: rgb(73, 1, 141);
                            }
                        `}</style>
                    </form>
                </div>
            </div>
        </div>
    );
}
