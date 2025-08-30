import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

const API_URL = 'http://localhost:3000/api';

export default function Buddy1Page() {
    const token = localStorage.getItem('token');
    const decoded_token = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const id_empleado = decoded_token ? decoded_token.id : null;

    const [Formulario, setFormulario] = useState({
        num_cuadrilla: '',
        Hora_buddy: '',
        Est_empl: '',
        Est_vehi: '',
        Carnet: '',
        TarjetaVida: '',
        Fecha: moment().format('YYYY-MM-DD'),
        Est_etapa: '',
        Est_her: '',
        MotivoEmp: '',
        MotivoVeh: '',
        MotivoHer: '',
        Tablero: '',
        Calentamiento: '',
        Tipo: 1,
        id_empleado: id_empleado
    });

    // Helpers de validación
    const onlyDigits = (v) => v.replace(/[^\d]/g, '');
    const onlyLetters = (v) =>
        v.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, '');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // ▸ Campos numéricos
        if (name === 'num_cuadrilla') {
            newValue = onlyDigits(value);
        }

        // ▸ Campos de texto (solo letras y espacios)
        if (['MotivoEmp', 'MotivoVeh', 'MotivoHer'].includes(name)) {
            newValue = onlyLetters(value);
        }

        setFormulario((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validaciones fuertes antes de enviar
        if (!/^\d+$/.test(Formulario.num_cuadrilla)) {
            Swal.fire('Número inválido', 'El número de cuadrilla debe contener solo números.', 'error');
            return;
        }

        if (Formulario.Est_empl === 'Malo' && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(Formulario.MotivoEmp)) {
            Swal.fire('Motivo inválido', 'El motivo del empleado solo puede contener letras y espacios.', 'error');
            return;
        }

        if (Formulario.Est_vehi === 'Malo' && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(Formulario.MotivoVeh)) {
            Swal.fire('Motivo inválido', 'El motivo del vehículo solo puede contener letras y espacios.', 'error');
            return;
        }

        if (Formulario.Est_her === 'Malo' && !/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(Formulario.MotivoHer)) {
            Swal.fire('Motivo inválido', 'El motivo de la herramienta solo puede contener letras y espacios.', 'error');
            return;
        }

        // Fecha no futura
        if (moment(Formulario.Fecha).isAfter(moment(), 'day')) {
            Swal.fire('Fecha inválida', 'La fecha no puede ser futura.', 'error');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, Formulario);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: response.data.message,
                    text: response.data.results
                }).then(() => window.location.reload());
            }
        } catch (error) {
            console.error('Error al registrar:', error);
            Swal.fire('Error al registrar', error.response?.data?.message || 'Error desconocido', 'error');
        }
    };

    return (
        <div className='container mt-5 p-5 shadow rounded-5' style={{ maxWidth: '800px', backgroundColor: '#ffffff' }}>
            <h2 className='text-center mb-4'>Formulario Buddy 1</h2>

            <form className='row g-3' onSubmit={handleSubmit}>
                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='num_cuadrilla' className='form-label'>Número de Cuadrilla</label>
                    <input
                        type='text'
                        className='form-control'
                        id='num_cuadrilla'
                        name='num_cuadrilla'
                        value={Formulario.num_cuadrilla}
                        onChange={handleInputChange}
                        inputMode='numeric'
                        pattern='[0-9]*'
                        required
                    />
                </div>

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Hora_buddy' className='form-label'>Hora Buddy</label>
                    <input
                        type='time'
                        className='form-control'
                        id='Hora_buddy'
                        name='Hora_buddy'
                        value={Formulario.Hora_buddy}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Est_empl' className='form-label'>Estado Empleado</label>
                    <select
                        className='form-select'
                        id='Est_empl'
                        name='Est_empl'
                        value={Formulario.Est_empl}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Seleccione una opción</option>
                        <option value='Excelente'>Excelente</option>
                        <option value='Bueno'>Bueno</option>
                        <option value='Malo'>Malo</option>
                    </select>
                </div>

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Est_vehi' className='form-label'>Estado Vehículo</label>
                    <select
                        className='form-select'
                        id='Est_vehi'
                        name='Est_vehi'
                        value={Formulario.Est_vehi}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Seleccione una opción</option>
                        <option value='Excelente'>Excelente</option>
                        <option value='Bueno'>Bueno</option>
                        <option value='Malo'>Malo</option>
                    </select>
                </div>

                {Formulario.Est_empl === 'Malo' && (
                    <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                        <label htmlFor='MotivoEmp' className='form-label'>Motivo empleado</label>
                        <textarea
                            className='form-control'
                            id='MotivoEmp'
                            name='MotivoEmp'
                            value={Formulario.MotivoEmp}
                            onChange={handleInputChange}
                            placeholder='Describe el motivo'
                            required
                        />
                    </div>
                )}

                {Formulario.Est_vehi === 'Malo' && (
                    <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                        <label htmlFor='MotivoVeh' className='form-label'>Motivo vehículo</label>
                        <textarea
                            className='form-control'
                            id='MotivoVeh'
                            name='MotivoVeh'
                            value={Formulario.MotivoVeh}
                            onChange={handleInputChange}
                            placeholder='Describe el motivo'
                            required
                        />
                    </div>
                )}

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Carnet' className='form-label'>Carnet</label>
                    <select
                        className='form-select'
                        id='Carnet'
                        name='Carnet'
                        value={Formulario.Carnet}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Seleccione una opción</option>
                        <option value='1'>Si</option>
                        <option value='0'>No</option>
                    </select>
                </div>

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='TarjetaVida' className='form-label'>Tarjeta Vida</label>
                    <select
                        className='form-select'
                        id='TarjetaVida'
                        name='TarjetaVida'
                        value={Formulario.TarjetaVida}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Seleccione una opción</option>
                        <option value='1'>Si</option>
                        <option value='0'>No</option>
                    </select>
                </div>

                {/* Fecha con rango: últimos 30 días hasta hoy */}
                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Fecha' className='form-label'>Fecha</label>
                    <input
                        type='date'
                        className='form-control'
                        id='Fecha'
                        name='Fecha'
                        value={Formulario.Fecha}
                        onChange={handleInputChange}
                        min={moment().subtract(30, 'days').format('YYYY-MM-DD')}
                        max={moment().format('YYYY-MM-DD')}
                        required
                    />
                </div>

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Est_etapa' className='form-label'>Estado Etapa</label>
                    <select
                        className='form-select'
                        id='Est_etapa'
                        name='Est_etapa'
                        value={Formulario.Est_etapa}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Seleccione una opción</option>
                        <option value='Inicio'>Inicio</option>
                        <option value='En proceso'>En proceso</option>
                        <option value='Finalizó'>Finalizó</option>
                    </select>
                </div>

                <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                    <label htmlFor='Est_her' className='form-label'>Estado Herramienta</label>
                    <select
                        className='form-select'
                        id='Est_her'
                        name='Est_her'
                        value={Formulario.Est_her}
                        onChange={handleInputChange}
                        required
                    >
                        <option value=''>Seleccione una opción</option>
                        <option value='Excelente'>Excelente</option>
                        <option value='Bueno'>Bueno</option>
                        <option value='Malo'>Malo</option>
                    </select>
                </div>

                {Formulario.Est_her === 'Malo' && (
                    <div className='col-md-6 mx-auto' style={{ maxWidth: '350px' }}>
                        <label htmlFor='MotivoHer' className='form-label'>Motivo herramienta</label>
                        <textarea
                            className='form-control'
                            id='MotivoHer'
                            name='MotivoHer'
                            value={Formulario.MotivoHer}
                            onChange={handleInputChange}
                            placeholder='Describe el motivo'
                            required
                        />
                    </div>
                )}

                <div className='col-12 text-center mt-4'>
                    <button
                        type='button'
                        onClick={() => (window.location.href = '/IndexEmpleado')}
                        className='btn btn-primary me-2'
                    >
                        Regresar
                    </button>
                    <button type='submit' className='btn btn-primary ms-2'>
                        Confirmar
                    </button>
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
