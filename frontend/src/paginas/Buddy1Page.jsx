import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export default function Buddy1Page() {
    const [Formulario, setFormulario] = useState({
        id_buddy1: '',
        num_cuadrilla: '',
        Hora_buddy: '',
        Est_empl: '',
        Est_vehi: '',
        Carnet: '',
        Nombre_id: '',
        TarjetaVida: '',
        Fecha: '',
        Est_etapa: '',
        Est_her: '',
        id_empleado: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/registro-formulario`, Formulario);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    text: response.data.results,
                }).then(() => {
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: error.response?.data?.message || 'Error desconocido',
            });
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormulario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <div className='container mt-5 p-5 shadow rounded-5' style={{ maxWidth: '800px', backgroundColor: '#ffffff' }}>
            <h2 className='text-center mb-4'>Formulario Buddy</h2>
            <form className='row g-3' onSubmit={handleSubmit}>
                {[
                    { id: 'id_buddy1', label: 'ID Buddy 1' },
                    { id: 'num_cuadrilla', label: 'Número de Cuadrilla' },
                    { id: 'Hora_buddy', label: 'Hora Buddy', type: 'time' },
                    { id: 'Est_empl', label: 'Estado Empleado' },
                    { id: 'Est_vehi', label: 'Estado Vehículo' },
                    { id: 'Carnet', label: 'Carnet' },
                    { id: 'Nombre_id', label: 'Nombre ID' },
                    { id: 'TarjetaVida', label: 'Tarjeta Vida' },
                    { id: 'Fecha', label: 'Fecha', type: 'date' },
                    { id: 'Est_etapa', label: 'Estado Etapa' },
                    { id: 'Est_her', label: 'Estado Herramienta' },
                    { id: 'id_empleado', label: 'ID Empleado' }
                ].map(({ id, label, type = 'text' }) => (
                    <div key={id} className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
                        <label htmlFor={id} className="form-label">{label}</label>
                        <input
                            type={type}
                            className="form-control"
                            id={id}
                            name={id}
                            value={Formulario[id]}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                ))}

                <div className="col-12 text-center mt-4">
                    <button type="submit" className="btn btn-primary">Confirmar</button>
                </div>
                <style jsx>{`
                    button.btn.btn-primary:hover {
                        background-color: rgb(73, 1, 141);
                    }
                `}</style>
            </form>
        </div>
    );
}
