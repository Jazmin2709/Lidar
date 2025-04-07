import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export default function Registrar() {
    const [Usuario, setUsuario] = useState({
        Nombres: '',
        Apellidos: '',
        Correo: '',
        Tipo_Doc: '',
        Cedula: '',
        Celular: '',
        Contrasena: '',
        agreeTerms: false,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/auth/registrar`, Usuario);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    text: response.data.results,
                }).then(() => {
                    window.location.href = '/login';
                });
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar usuario',
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
                <div className='container mt-5 p-5 shadow rounded-5' style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '700px', height: 'auto', backgroundColor: '#ffffff' }}>
                    <h1 className='text-center p-5'>
                        Formulario de Registro
                    </h1>
                    <br />
                    <form className='row g-3' noValidate onSubmit={handleSubmit}>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Nombres" className="form-label">Nombres</label>
                            <input type="text" className="form-control" id="Nombres" value={Usuario.Nombres} name='Nombres' onChange={handleInputChange} required />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Apellidos" className="form-label">Apellidos</label>
                            <input type="text" className="form-control" id="Apellidos" value={Usuario.Apellidos} name='Apellidos' onChange={handleInputChange} required />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Correo" className="form-label">Correo</label>
                            <div className="input-group has-validation">
                                <span className="input-group-text" id="inputGroupPrepend"> @ </span>
                                <input type="email" className="form-control" id="Correo" aria-describedby="inputGroupPrepend" value={Usuario.Correo} name='Correo' onChange={handleInputChange} required />
                                <div className="invalid-feedback">Por favor ingresa tu correo.</div>
                            </div>
                        </div>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Tipo_Doc" className="form-label">Tipo de Documento</label>
                            <select className="form-select" id="Tipo_Doc" value={Usuario.Tipo_Doc} name='Tipo_Doc' onChange={handleInputChange} required>
                                <option value="">Seleccione...</option>
                                <option value="CC">Cédula de ciudadania</option>
                                <option value="PA">Pasaporte</option>
                                <option value="PP">Permiso se permanencia</option>
                            </select>
                            <div className="invalid-feedback">Por favor selecione un tipo de documento.</div>
                        </div>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Cedula" className="form-label">Número de Documento</label>
                            <input type="number" className="form-control" id="Cedula" value={Usuario.Cedula} name='Cedula' onChange={handleInputChange} required />
                            <div className="invalid-feedback">Por favor ingresa tu número de documento.</div>
                        </div>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="zip" className="form-label">Número de Celular</label>
                            <input type="number" className="form-control" id="Celular" value={Usuario.Celular} name='Celular' onChange={handleInputChange} required />
                            <div className="invalid-feedback">Por favor ingrese su número de celular.</div>
                        </div>
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Contrasena" className="form-label">Contraseña</label>
                            <input type="password" className="form-control" id="Contrasena" value={Usuario.Contrasena} name='Contrasena' onChange={handleInputChange} required />
                            <div className="valid-feedback">Looks good!</div>
                        </div>
                        <div className="col-md-6 mx-auto d-flex align-items-center" style={{ maxWidth: '300px' }}>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value={Usuario.agreeTerms} name="agreeTerms" id="agreeTerms" checked={Usuario.agreeTerms} onChange={handleInputChange} required />
                                <label className="form-check-label" htmlFor="agreeTerms">Acepto términos y condiciones</label>
                                <div className="invalid-feedback">Acepta los términos y condiciones.</div>
                            </div>
                        </div>
                        <div className="col-12 text-center">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                style={{
                                    cursor: 'pointer',
                                }}
                            >
                                Enviar registro
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