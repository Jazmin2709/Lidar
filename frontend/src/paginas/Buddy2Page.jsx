// Importa los hooks de React y librerías externas necesarias
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Componente principal de la página Buddy 2
export default function Buddy2Page() {

  // Obtiene el token de autenticación del almacenamiento local
  const token = localStorage.getItem('token');

  // Decodifica el token para obtener información del usuario (id_empleado)
  const decoded_token = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const id_empleado = decoded_token ? decoded_token.id : null;

  // Estado para almacenar los datos del formulario
  const [Formulario, setFormulario] = useState({
    num_cuadrilla: '',
    Hora_buddy: '',
    Est_empl: '',
    Est_vehi: '',
    Carnet: '',
    TarjetaVida: '',
    Fecha: moment().format('YYYY-MM-DD'), // ✅ valor por defecto hoy
    Est_etapa: '',
    Est_her: '',
    MotivoEmp: '',
    MotivoVeh: '',
    Tablero: '',
    Calentamiento: '',
    Tipo: 2, // Tipo 2 hace referencia al formulario Buddy 2
    id_empleado: id_empleado
  });

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    // ✅ Validar que la fecha no sea futura
    if (moment(Formulario.Fecha).isAfter(moment(), 'day')) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'La fecha no puede ser futura.',
      });
      return;
    }

    try {
      // Envía los datos a la API
      const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, Formulario);

      // Si la respuesta es exitosa, muestra mensaje de éxito
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: response.data.message,
          text: response.data.results,
        }).then(() => {
          window.location.reload(); // Recarga la página luego de confirmar
        });
      }
    } catch (error) {
      // Maneja errores y muestra un mensaje al usuario
      console.error('Error al registrar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: error.response?.data?.message || 'Error desconocido',
      });
    }
  };

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Renderizado del formulario
  return (
    <div className='container mt-5 p-5 shadow rounded-5' style={{ maxWidth: '800px', backgroundColor: '#ffffff' }}>
      <h2 className='text-center mb-4'>Formulario Buddy 2</h2>
      <form className='row g-3' onSubmit={handleSubmit}>

        {/* Campo: Número de Cuadrilla */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="num_cuadrilla" className="form-label">Número de Cuadrilla</label>
          <input type="text" className="form-control" id="num_cuadrilla" name="num_cuadrilla" value={Formulario.num_cuadrilla} onChange={handleInputChange} required />
        </div>

        {/* Campo: Hora Buddy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Hora_buddy" className="form-label">Hora Buddy</label>
          <input type="time" className="form-control" id="Hora_buddy" name="Hora_buddy" value={Formulario.Hora_buddy} onChange={handleInputChange} required />
        </div>

        {/* Campo: Estado Empleado */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_empl" className="form-label">Estado Empleado</label>
          <select className="form-select" id="Est_empl" name="Est_empl" value={Formulario.Est_empl} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Campo: Estado Vehículo */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_vehi" className="form-label">Estado Vehículo</label>
          <select className="form-select" id="Est_vehi" name="Est_vehi" value={Formulario.Est_vehi} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Campo Condicional: Motivo empleado si el estado es Malo */}
        {Formulario.Est_empl === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label className="form-label">Motivo empleado</label>
            <textarea className="form-control" id="MotivoEmp" name="MotivoEmp" value={Formulario.MotivoEmp} onChange={handleInputChange} required />
          </div>
        )}

        {/* Campo Condicional: Motivo vehículo si el estado es Malo */}
        {Formulario.Est_vehi === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label className="form-label">Motivo vehículo</label>
            <textarea className="form-control" id="MotivoVeh" name="MotivoVeh" value={Formulario.MotivoVeh} onChange={handleInputChange} required />
          </div>
        )}

        {/* Otros campos del formulario */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Carnet" className="form-label">Carnet</label>
          <select className="form-select" id="Carnet" name="Carnet" value={Formulario.Carnet} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="TarjetaVida" className="form-label">Tarjeta Vida</label>
          <select className="form-select" id="TarjetaVida" name="TarjetaVida" value={Formulario.TarjetaVida} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Tablero" className="form-label">Tablero</label>
          <input type="text" className="form-control" id="Tablero" name="Tablero" value={Formulario.Tablero} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Calentamiento" className="form-label">Calentamiento</label>
          <input type="text" className="form-control" id="Calentamiento" name="Calentamiento" value={Formulario.Calentamiento} onChange={handleInputChange} required />
        </div>

        {/* ✅ Campo Fecha con mínimo hace 30 días y máximo hoy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Fecha" className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            id="Fecha"
            name="Fecha"
            value={Formulario.Fecha}
            onChange={handleInputChange}
            min={moment().subtract(30, 'days').format('YYYY-MM-DD')}
            max={moment().format('YYYY-MM-DD')}
            required
          />
        </div>

        {/* Estado de la etapa */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_etapa" className="form-label">Estado Etapa</label>
          <select className="form-select" id="Est_etapa" name="Est_etapa" value={Formulario.Est_etapa} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Inicio">Inicio</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizó">Finalizó</option>
          </select>
        </div>

        {/* Estado de herramienta */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_her" className="form-label">Estado Herramienta</label>
          <select className="form-select" id="Est_her" name="Est_her" value={Formulario.Est_her} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Campo Condicional: Motivo herramienta si está en mal estado */}
        {Formulario.Est_her === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label className="form-label">Motivo herramienta</label>
            <textarea className="form-control" id="MotivoHer" name="MotivoHer" value={Formulario.MotivoHer} onChange={handleInputChange} required />
          </div>
        )}

        {/* Botones: Regresar y Confirmar */}
        <div className="col-12 text-center mt-4">
          <button
            type="button"
            onClick={() => window.location.href = '/IndexEmpleado'}
            className="btn btn-primary me-2"
          >
            Regresar
          </button>
          <button
            type="submit"
            className="btn btn-primary ms-2"
          >
            Confirmar
          </button>
        </div>

        {/* Estilos personalizados para el botón */}
        <style jsx>{`
          button.btn.btn-primary:hover {
            background-color: rgb(73, 1, 141);
          }
        `}</style>
      </form>
    </div>
  );
}
