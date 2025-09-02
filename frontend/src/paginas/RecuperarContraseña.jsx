import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = 'http://localhost:3000/api';

export default function RecuperarContraseña() {

    const correo = localStorage.getItem('correo');

    const [Usuario, setUsuario] = useState({
        Correo: correo,
        Codigo: '',
        NuevaContrasena: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
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

    return(
        <div className='container-fluid'>
            <div className='justify-content-center align-items-center h-100'>
                <div className='container mt-5 p-5 shadow rounded-5 border-3' style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'auto', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                    <h1 className='text-center p-5'>
                        Recuperar Contraseña
                    </h1>
                    <br />
                    <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>
                        <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="Codigo" className="form-label">Codigo</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Codigo"
                                value={Usuario.Codigo}
                                name='Codigo'
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Por favor ingresa tu nueva contraseña</div>
                        </div>
                        <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="NuevaContrasena" className="form-label">Contraseña Nueva</label>
                            <input
                                type="password"
                                className="form-control"
                                id="NuevaContrasena"
                                value={Usuario.NuevaContrasena}
                                name='NuevaContrasena'
                                onChange={handleInputChange}
                                required
                            />
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
                            <div className="invalid-feedback">Por favor ingresa tu nueva contraseña</div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit">
                                Recuperar
                            </button>
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