import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
const API_URL = 'http://localhost:3000/api';

export default function EnviarCorreo() {

    const [Usuario, setUsuario] = useState({
        Correo: '',
    });

    const handleInputChange = (event) => {
        setUsuario({
            ...Usuario,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/enviarCorreo`, Usuario);
            if (response.status === 200) {
                localStorage.setItem('correo', response.data.correo);
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                }).then(() => {
                    window.location.href = '/RecuperarContraseña';
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
    
    return (
    <div className='container-fluid'>
        <div className='justify-content-center align-items-center h-100'>
            <div className='container mt-5 p-5 shadow rounded-5 border-3' style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'auto', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                <h1 className='text-center p-5'>
                    Recuperar Contraseña
                </h1>
                <br />
                <form className='d-flex flex-column align-items-center' noValidate onSubmit={handleSubmit}>
                    <div className="mb-3" style={{ width: '300px' }}>
                            <label htmlFor="Correo" className="form-label">Digite el Correo Electrónico.</label>
                        <input
                            type="text"
                            className="form-control"
                                id="Correo"
                            value={Usuario.Correo}
                            name='Correo'
                            onChange={handleInputChange}
                            required
                        />
                        <div className="invalid-feedback">Por favor ingresa tu correo electrónico.</div>
                    </div>
                    <div className="text-center">
                        <button className="btn btn-primary" type="submit">
                            Enviar Correo
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