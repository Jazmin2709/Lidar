// Importa el hook useState de React para manejar el estado del formulario
import { useState } from 'react';
// Importa axios para hacer peticiones HTTP
import axios from 'axios';
// Importa la librería sweetalert2 para mostrar alertas bonitas
import Swal from 'sweetalert2';
// Importa moment para manejar fechas
import moment from 'moment';

// URL base de la API a la que se le enviarán los datos del formulario
const API_URL = 'http://localhost:3000/api';

// Componente principal del formulario Buddy tipo 3
export default function Buddy3Page() {

  // Se obtiene el token guardado en el localStorage
  const token = localStorage.getItem('token');

  // Se decodifica el token para extraer el ID del empleado
  const decoded_token = token ? JSON.parse(atob(token.split('.')[1])) : null;

  // Si existe token, se toma el id del empleado
  const id_empleado = decoded_token ? decoded_token.id : null;

  // Estado que guarda los valores del formulario
  const [Formulario, setFormulario] = useState({
    num_cuadrilla: '',
    Hora_buddy: '',
    Est_empl: '',
    Est_vehi: '',
    Carnet: '',
    TarjetaVida: '',
    Fecha: '',
    Est_etapa: '',
    Est_her: '',
    MotivoEmp: '',
    MotivoVeh: '',
    Tablero: '',
    Calentamiento: '',
    Tipo: 3, // Tipo 3 representa este tipo específico de formulario
    id_empleado: id_empleado // Se asigna el id del empleado desde el token
  });

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene que se recargue la página
    try {
      // Se hace la petición POST al endpoint con los datos del formulario
      const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, Formulario);
      // Si la respuesta es exitosa, se muestra un mensaje de éxito y se recarga la página
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: response.data.message,
          text: response.data.results,
        }).then(() => {
          window.location.reload(); // Recarga la página después de cerrar la alerta
        });
      }
    } catch (error) {
      // En caso de error, se muestra un mensaje de error con los detalles
      console.error('Error al registrar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.response?.data?.message || 'Error desconocido',
      });
    }
  };

  // Función que actualiza los valores del formulario cuando el usuario escribe o selecciona algo
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='container mt-5 p-5 shadow rounded-5' style={{ maxWidth: '800px', backgroundColor: '#ffffff' }}>
      <h2 className='text-center mb-4'>Formulario Buddy 3</h2>

      {/* Formulario */}
      <form className='row g-3' onSubmit={handleSubmit}>

        {/* Campo: Número de cuadrilla */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="num_cuadrilla" className="form-label">Número de Cuadrilla</label>
          <input type="text" className="form-control" id="num_cuadrilla" name="num_cuadrilla" value={Formulario.num_cuadrilla} onChange={handleInputChange} required />
        </div>

        {/* Campo: Hora buddy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Hora_buddy" className="form-label">Hora Buddy</label>
          <input type="time" className="form-control" id="Hora_buddy" name="Hora_buddy" value={Formulario.Hora_buddy} onChange={handleInputChange} required />
        </div>

        {/* Campo: Estado del empleado */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_empl" className="form-label">Estado Empleado</label>
          <select className="form-select" id="Est_empl" name="Est_empl" value={Formulario.Est_empl} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Campo: Estado del vehículo */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_vehi" className="form-label">Estado Vehículo</label>
          <select className="form-select" id="Est_vehi" name="Est_vehi" value={Formulario.Est_vehi} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Campo condicional: Motivo del empleado (solo si está en estado 'Malo') */}
        {Formulario.Est_empl === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label htmlFor="Motivo" className="form-label">Motivo empleado</label>
            <textarea className="form-control" id="MotivoEmp" name="MotivoEmp" value={Formulario.MotivoEmp} onChange={handleInputChange} required />
          </div>
        )}

        {/* Campo condicional: Motivo del vehículo (solo si está en estado 'Malo') */}
        {Formulario.Est_vehi === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label htmlFor="Motivo" className="form-label">Motivo vehículo</label>
            <textarea className="form-control" id="MotivoVeh" name="MotivoVeh" value={Formulario.MotivoVeh} onChange={handleInputChange} required />
          </div>
        )}

        {/* Campo: Carnet */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Carnet" className="form-label">Carnet</label>
          <select className="form-select" id="Carnet" name="Carnet" value={Formulario.Carnet} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Campo: Tarjeta Vida */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="TarjetaVida" className="form-label">Tarjeta Vida</label>
          <select className="form-select" id="TarjetaVida" name="TarjetaVida" value={Formulario.TarjetaVida} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Campo: Fecha */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Fecha" className="form-label">Fecha</label>
          <input 
            type="date" 
            className="form-control" 
            id="Fecha" 
            name="Fecha" 
            value={Formulario.Fecha} 
            onChange={handleInputChange} 
            required
            min={moment().subtract(30, 'days').format('YYYY-MM-DD')} 
            max={moment().format('YYYY-MM-DD')}
          />
        </div>

        {/* Campo: Estado de la etapa */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_etapa" className="form-label">Estado Etapa</label>
          <select className="form-select" id="Est_etapa" name="Est_etapa" value={Formulario.Est_etapa} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Inicio">Inicio</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizó">Finalizó</option>
          </select>
        </div>

        {/* Campo: Estado herramienta */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_her" className="form-label">Estado Herramienta</label>
          <select className="form-select" id="Est_her" name="Est_her" value={Formulario.Est_her} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Campo condicional: Motivo herramienta (si está en mal estado) */}
        {Formulario.Est_her === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label htmlFor="Motivo" className="form-label">Motivo herramienta</label>
            <textarea className="form-control" id="MotivoHer" name="MotivoHer" value={Formulario.MotivoHer} onChange={handleInputChange} required />
          </div>
        )}

        {/* Botones de acción */}
        <div className="col-12 text-center mt-4">
          {/* Botón para regresar */}
          <button
            type="button"
            onClick={() => window.location.href = '/IndexEmpleado'}
            className="btn btn-primary me-2"
          >
            Regresar
          </button>

          {/* Botón para confirmar (enviar el formulario) */}
          <button
            type="submit"
            className="btn btn-primary ms-2"
          >
            Confirmar
          </button>
        </div>

        {/* Estilo personalizado para el hover del botón */}
        <style jsx>{`
          button.btn.btn-primary:hover {
            background-color: rgb(73, 1, 141);
          }
        `}</style>

      </form>
    </div>
  );
}
