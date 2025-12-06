import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; // ✅ Importa el hook para navegación

const API_URL = process.env.API_URL || "https://lidar-cush.onrender.com/api";

export default function EnviarCorreo() {
    const [Usuario, setUsuario] = useState({ Correo: '' });
    const [loading, setLoading] = useState(false);
    const [bloqueado, setBloqueado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(0);
    const navigate = useNavigate(); // ✅ Inicializa el hook

    const handleInputChange = (event) => {
        setUsuario({
            ...Usuario,
            [event.target.name]: event.target.value,
        });
    };

    useEffect(() => {
        let intervalo;
        if (tiempoRestante > 0) {
            intervalo = setInterval(() => {
                setTiempoRestante(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalo);
                        setBloqueado(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalo);
    }, [tiempoRestante]);

    const formatoTiempo = (seg) => {
        const min = Math.floor(seg / 60);
        const sec = seg % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/enviarCorreo`, Usuario);
            if (response.status === 200) {
                localStorage.setItem('correo', response.data.correo);
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                }).then(() => {
                    // ✅ Redirigir usando react-router-dom
                    navigate('/RecuperarContraseña');
                });
            }
        } catch (error) {
            const status = error.response?.status;
            const message = error.response?.data?.message || 'Error del servidor';

            if (status === 429) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Demasiadas solicitudes',
                    text: message,
                });

                const match = message.match(/espera\s+(\d+)/i);
                if (match && match[1]) {
                    const minutos = parseInt(match[1]);
                    const segundos = minutos * 60;
                    setBloqueado(true);
                    setTiempoRestante(segundos);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al ingresar',
                    text: message,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container-fluid'>
            <div className='justify-content-center align-items-center h-100'>
                <div className='container p-5 shadow rounded-5 border-3' style={{ marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'auto', maxWidth: '400px', backgroundColor: '#ffffff' }}>
                    <h1 className='text-center p-5'>Recuperar Contraseña</h1>
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
                                disabled={loading || bloqueado}
                            />
                            <div className="invalid-feedback">Por favor ingresa tu correo electrónico.</div>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary" type="submit" disabled={loading || bloqueado}>
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Enviando...
                                    </>
                                ) : bloqueado ? (
                                    `Espera ${formatoTiempo(tiempoRestante)}...`
                                ) : (
                                    'Enviar Correo'
                                )}
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

