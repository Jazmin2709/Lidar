// Versión responsiva del formulario de registro
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = process.env.API_URL || "http://localhost:3000/api";

export default function Registrar() {
    const [Usuario, setUsuario] = useState({
        Nombres: '',
        Apellidos: '',
        Correo: '',
        Tipo_Doc: '',
        Cedula: '',
        Celular: '',
        Contrasena: '',
        ConfirmarContrasena: '',
        agreeTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault(); 
        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

        const nombres = Usuario.Nombres.trim();
        const apellidos = Usuario.Apellidos.trim();
        const correo = Usuario.Correo.trim();
        const cedula = Usuario.Cedula.trim();
        const celular = Usuario.Celular.trim();
        const contrasena = Usuario.Contrasena;
        const confirmar = Usuario.ConfirmarContrasena;

        if (!nombres || nombres.length < 2 || !regexNombre.test(nombres)) {
            Swal.fire('Error', 'El nombre debe tener al menos 2 letras y solo letras y espacios.', 'error');
            return;
        }
        if (!apellidos || apellidos.length < 2 || !regexNombre.test(apellidos)) {
            Swal.fire('Error', 'El apellido debe tener al menos 2 letras y solo letras y espacios.', 'error');
            return;
        }
        if (!regexCorreo.test(correo)) {
            Swal.fire('Error', 'Correo inválido.', 'error');
            return;
        }
        if (!/^\d{5,15}$/.test(cedula)) {
            Swal.fire('Error', 'La cédula debe tener entre 5 y 15 números.', 'error');
            return;
        }
        if (!/^\d{10}$/.test(celular)) {
            Swal.fire('Error', 'El celular debe tener 10 números.', 'error');
            return;
        }
        if (!regexContrasena.test(contrasena)) {
            Swal.fire('Error', 'La contraseña no cumple los requisitos.', 'error');
            return;
        }
        if (contrasena !== confirmar) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
            return;
        }
        if (!Usuario.agreeTerms) {
            Swal.fire('Error', 'Debes aceptar los términos.', 'error');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/registrar`, Usuario);
            if (response.status === 200) {
                Swal.fire({ icon: 'success', title: response.data.message }).then(() => {
                    window.location.href = '/login';
                });
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error al registrar.', 'error');
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (type !== 'checkbox') {
            if ((name === 'Nombres' || name === 'Apellidos') && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) return;
            if (name === 'Cedula' && (!/^\d*$/.test(value) || value.length > 15)) return;
            if (name === 'Celular' && (!/^\d*$/.test(value) || value.length > 10)) return;
            if ((name === 'Contrasena' || name === 'ConfirmarContrasena') && /\s/.test(value)) return;
        }

        setUsuario((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    return (
        <div 
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}   // ← AQUÍ EL CAMBIO
        >
            <div className="w-100 p-4 p-md-5 shadow rounded-4 bg-white" style={{ maxWidth: '900px' }}>
                <h1 className="text-center mb-4">Formulario de Registro</h1>

                <form className="row g-4" noValidate onSubmit={handleSubmit}>

                    <div className="col-md-6">
                        <label className="form-label">Nombres</label>
                        <input type="text" className="form-control" name="Nombres" value={Usuario.Nombres} onChange={handleInputChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Apellidos</label>
                        <input type="text" className="form-control" name="Apellidos" value={Usuario.Apellidos} onChange={handleInputChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Correo</label>
                        <input type="email" className="form-control" name="Correo" value={Usuario.Correo} onChange={handleInputChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Tipo de Documento</label>
                        <select className="form-select" name="Tipo_Doc" value={Usuario.Tipo_Doc} onChange={handleInputChange} required>
                            <option value="">Seleccione...</option>
                            <option value="CC">Cédula</option>
                            <option value="PA">Pasaporte</option>
                            <option value="PP">Permiso de permanencia</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Número de Documento</label>
                        <input type="text" className="form-control" name="Cedula" value={Usuario.Cedula} onChange={handleInputChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Celular</label>
                        <input type="text" className="form-control" name="Celular" value={Usuario.Celular} onChange={handleInputChange} required />
                    </div>

                    <div className="col-md-6 position-relative">
                        <label className="form-label">Contraseña</label>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            className="form-control" 
                            name="Contrasena" 
                            value={Usuario.Contrasena} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '30px',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                userSelect: 'none'
                            }}
                        >
                            {showPassword ? '👀' : '🙈'}
                        </span>
                    </div>

                    <div className="col-md-6 position-relative">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input 
                            type={showConfirmPassword ? 'text' : 'password'} 
                            className="form-control" 
                            name="ConfirmarContrasena" 
                            value={Usuario.ConfirmarContrasena} 
                            onChange={handleInputChange} 
                            required 
                        />
                        <span 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '30px',
                                cursor: 'pointer',
                                fontSize: '1.5rem',
                                userSelect: 'none'
                            }}
                        >
                            {showConfirmPassword ? '👀' : '🙈'}
                        </span>
                    </div>

                    <div className="col-12 d-flex align-items-center">
                        <input type="checkbox" className="form-check-input me-2" name="agreeTerms" checked={Usuario.agreeTerms} onChange={handleInputChange} />
                        <label className="form-check-label">Acepto términos y condiciones</label>
                    </div>

                    <div className="col-12 text-center">
                        <button className="btn btn-primary px-5">Enviar registro</button>
                    </div>

                </form>
            </div>
        </div>
    );
}
