// Importación de hooks y librerías necesarias
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

// URL base de la API
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
        ConfirmarContrasena: '',
        agreeTerms: false,
    });

    // Estados para mostrar/ocultar contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Regex
        const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

        // Trim para evitar espacios de más
        const nombres = Usuario.Nombres.trim();
        const apellidos = Usuario.Apellidos.trim();
        const correo = Usuario.Correo.trim();
        const cedula = Usuario.Cedula.trim();
        const celular = Usuario.Celular.trim();
        const contrasena = Usuario.Contrasena;
        const confirmar = Usuario.ConfirmarContrasena;

        // Validaciones
        if (!nombres || nombres.length < 2 || !regexNombre.test(nombres)) {
            Swal.fire('Error', 'El nombre debe tener al menos 2 letras y solo puede contener letras y espacios.', 'error');
            return;
        }
        if (!apellidos || apellidos.length < 2 || !regexNombre.test(apellidos)) {
            Swal.fire('Error', 'El apellido debe tener al menos 2 letras y solo puede contener letras y espacios.', 'error');
            return;
        }
        if (!regexCorreo.test(correo)) {
            Swal.fire('Error', 'Por favor ingresa un correo válido (ejemplo: usuario@dominio.com).', 'error');
            return;
        }
        if (!/^\d{5,15}$/.test(cedula)) {
            Swal.fire('Error', 'La cédula debe tener entre 5 y 15 dígitos numéricos.', 'error');
            return;
        }
        if (!/^\d{10}$/.test(celular)) {
            Swal.fire('Error', 'El celular debe tener exactamente 10 dígitos.', 'error');
            return;
        }
        if (!regexContrasena.test(contrasena)) {
            Swal.fire(
                'Error',
                'La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y caracter especial.',
                'error'
            );
            return;
        }
        if (contrasena !== confirmar) {
            Swal.fire('Error', 'Las contraseñas no coinciden.', 'error');
            return;
        }
        if (!Usuario.agreeTerms) {
            Swal.fire('Error', 'Debes aceptar los términos y condiciones.', 'error');
            return;
        }

        // Enviar si pasa validaciones
        try {
            const response = await axios.post(`${API_URL}/auth/registrar`, {
                ...Usuario,
                Nombres: nombres,
                Apellidos: apellidos,
                Correo: correo,
                Cedula: cedula,
                Celular: celular,
            });
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
                text: error.response?.data?.message || 'Ocurrió un error.',
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;

        // Filtrado en vivo (sin cambiar tu estructura)
        if (type !== 'checkbox') {
            // Nombres/Apellidos: solo letras y espacios (permitir vacío para borrar)
            if ((name === 'Nombres' || name === 'Apellidos') && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) return;

            // Cédula: solo dígitos, máx 15
            if (name === 'Cedula') {
                if (!/^\d*$/.test(value)) return;
                if (value.length > 15) return;
            }

            // Celular: solo dígitos, máx 10
            if (name === 'Celular') {
                if (!/^\d*$/.test(value)) return;
                if (value.length > 10) return;
            }

            // Contraseña/Confirmación: sin espacios
            if ((name === 'Contrasena' || name === 'ConfirmarContrasena') && /\s/.test(value)) return;
        }

        setUsuario((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <div className='container-fluid'>
            <div className='justify-content-center align-items-center'>
                <div
                    className='container mt-5 p-5 shadow rounded-5'
                    style={{
                        marginBottom: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '700px',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <h1 className='text-center p-5'>Formulario de Registro</h1>

                    <form className='row g-3' noValidate onSubmit={handleSubmit}>
                        {/* Nombres */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Nombres" className="form-label">Nombres</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Nombres"
                                name="Nombres"
                                value={Usuario.Nombres}
                                onChange={handleInputChange}
                                pattern="^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$"
                                title="Solo letras y espacios."
                                required
                            />
                        </div>

                        {/* Apellidos */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Apellidos" className="form-label">Apellidos</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Apellidos"
                                name="Apellidos"
                                value={Usuario.Apellidos}
                                onChange={handleInputChange}
                                pattern="^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$"
                                title="Solo letras y espacios."
                                required
                            />
                        </div>

                        {/* Correo */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Correo" className="form-label">Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                id="Correo"
                                name="Correo"
                                value={Usuario.Correo}
                                onChange={handleInputChange}
                                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                title="Formato: usuario@dominio.com"
                                required
                            />
                        </div>

                        {/* Tipo de Documento */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Tipo_Doc" className="form-label">Tipo de Documento</label>
                            <select
                                className="form-select"
                                id="Tipo_Doc"
                                name="Tipo_Doc"
                                value={Usuario.Tipo_Doc}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="PA">Pasaporte</option>
                                <option value="PP">Permiso de permanencia</option>
                            </select>
                        </div>

                        {/* Cedula */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Cedula" className="form-label">Número de Documento</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Cedula"
                                name="Cedula"
                                value={Usuario.Cedula}
                                onChange={handleInputChange}
                                pattern="^\d+$"
                                title="Solo números."
                                required
                            />
                        </div>

                        {/* Celular */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px' }}>
                            <label htmlFor="Celular" className="form-label">Número de Celular</label>
                            <input
                                type="text"
                                className="form-control"
                                id="Celular"
                                name="Celular"
                                value={Usuario.Celular}
                                onChange={handleInputChange}
                                pattern="^\d{10}$"
                                title="Debe tener exactamente 10 números."
                                required
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px', position: 'relative' }}>
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
                            {/* Ojito */}
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '30px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: showPassword ? 'green' : 'red'
                                }}
                            >
                                {showPassword ? "👀" : "🙈"}
                            </span>
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="col-md-6 mx-auto" style={{ maxWidth: '300px', position: 'relative' }}>
                            <label htmlFor="ConfirmarContrasena" className="form-label">Confirmar Contraseña</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="form-control"
                                id="ConfirmarContrasena"
                                name="ConfirmarContrasena"
                                value={Usuario.ConfirmarContrasena}
                                onChange={handleInputChange}
                                required
                            />
                            {/* Ojito */}
                            <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '30px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: showConfirmPassword ? 'green' : 'red'
                                }}
                            >
                                {showConfirmPassword ? "👀" : "🙈"}
                            </span>
                        </div>

                        {/* Check de términos */}
                        <div className="col-md-6 mx-auto d-flex align-items-center" style={{ maxWidth: '300px' }}>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="agreeTerms"
                                    id="agreeTerms"
                                    checked={Usuario.agreeTerms}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label className="form-check-label" htmlFor="agreeTerms">
                                    Acepto términos y condiciones
                                </label>
                            </div>
                        </div>

                        {/* Botón */}
                        <div className="col-12 text-center">
                            <button className="btn btn-primary" type="submit">
                                Enviar registro
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}