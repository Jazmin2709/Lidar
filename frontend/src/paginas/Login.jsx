import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export default function Login() {
    const [Usuario, setUsuario] = useState({
        Correo: '',
        Contrasena: '',
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/ingresar`, Usuario);
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                }).then(() => {
                    window.location.href = '/Dashboard';
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

        <div className='justify-content-center align-items-center h-100'>
            <div className='container mt-5 p-5 shadow rounded-5 w-50'>
                <h1 className='text-center p-5'>
                    FORMULARIO DE REGISTRO
                </h1>
                <br />
                <form className='row g-3 p-5' noValidate onSubmit={handleSubmit}>
                    <div className="col-12">
                        <label htmlFor="Correo" className="form-label">Correo</label>
                        <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend"> @ </span>
                            <input
                                type="email"
                                className="form-control"
                                id="Correo"
                                aria-describedby="inputGroupPrepend"
                                value={Usuario.Correo}
                                name='Correo'
                                onChange={handleInputChange}
                                required
                            />
                            <div className="invalid-feedback">Por favor ingresa tu correo.</div>
                        </div>
                    </div>
                    <div className="col-12">
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
                        <div className="valid-feedback">Looks good!</div>
                    </div>
                    <div className="col-12 text-center">
                        <button className="btn btn-primary" type="submit">
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
