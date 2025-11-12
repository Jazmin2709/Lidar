// Importa los hooks de React y librerías externas necesarias
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Componente principal de la página Buddy 2
export default function Buddy2Page() {

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
    Tipo: 2,
    id_empleado: id_empleado
  });

  // Estados para los archivos seleccionados
  const [selectedFileTablero, setSelectedFileTablero] = useState(null);
  const [selectedFileCalentamiento, setSelectedFileCalentamiento] = useState(null);

  // Subir imagen al servidor/Cloudinary
  const uploadImage = async (file, preset, publicId) => {
    const formData = new FormData();
    formData.append("foto", file);
    formData.append("upload_preset", preset);
    formData.append("public_id", publicId);

    const response = await axios.post(`${API_URL}/imagenes/subir`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (moment(Formulario.Fecha).isAfter(moment(), 'day')) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'La fecha no puede ser futura.',
      });
      return;
    }

    try {
      // Validar imágenes
      if (!selectedFileTablero || !selectedFileCalentamiento) {
        Swal.fire("Faltan imágenes", "Debes subir tablero y calentamiento.", "warning");
        return;
      }

      // Subir ambas imágenes
      const publicIdBase = `${id_empleado || "anon"}_${Date.now()}`;
      const urlTablero = await uploadImage(selectedFileTablero, "tableros", `tablero_${publicIdBase}`);
      const urlCal = await uploadImage(selectedFileCalentamiento, "calentamientos", `calentamiento_${publicIdBase}`);

      const payload = { ...Formulario, Tablero: urlTablero, Calentamiento: urlCal };

      const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, payload);

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

    if (name === "num_cuadrilla" && !/^\d*$/.test(value)) return;
    if ((name === "MotivoEmp" || name === "MotivoVeh" || name === "MotivoHer") && !/^[a-zA-Z0-9\s]*$/.test(value)) return;

    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className='container mt-5 p-5 shadow rounded-5' style={{ maxWidth: '800px', backgroundColor: '#ffffff' }}>
      <h2 className='text-center mb-4'>Formulario Buddy 2</h2>
      <form className='row g-3' onSubmit={handleSubmit}>

        {/* Número de Cuadrilla */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="num_cuadrilla" className="form-label">Número de Cuadrilla</label>
          <input
            type="text"
            className="form-control"
            id="num_cuadrilla"
            name="num_cuadrilla"
            value={Formulario.num_cuadrilla}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Hora Buddy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Hora_buddy" className="form-label">Hora Buddy</label>
          <input
            type="time"
            className="form-control"
            id="Hora_buddy"
            name="Hora_buddy"
            value={Formulario.Hora_buddy}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Estado Empleado */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_empl" className="form-label">Estado Empleado</label>
          <select className="form-select" id="Est_empl" name="Est_empl" value={Formulario.Est_empl} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Estado Vehículo */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_vehi" className="form-label">Estado Vehículo</label>
          <select className="form-select" id="Est_vehi" name="Est_vehi" value={Formulario.Est_vehi} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {Formulario.Est_empl === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label className="form-label">Motivo empleado</label>
            <textarea className="form-control" id="MotivoEmp" name="MotivoEmp" value={Formulario.MotivoEmp} onChange={handleInputChange} required />
          </div>
        )}

        {Formulario.Est_vehi === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label className="form-label">Motivo vehículo</label>
            <textarea className="form-control" id="MotivoVeh" name="MotivoVeh" value={Formulario.MotivoVeh} onChange={handleInputChange} required />
          </div>
        )}

        {/* Carnet */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Carnet" className="form-label">Carnet</label>
          <select className="form-select" id="Carnet" name="Carnet" value={Formulario.Carnet} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Tarjeta Vida */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="TarjetaVida" className="form-label">Tarjeta Vida</label>
          <select className="form-select" id="TarjetaVida" name="TarjetaVida" value={Formulario.TarjetaVida} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Imagen del tablero */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Tablero" className="form-label">Imagen Tablero</label>
          <input
            type="file"
            className="form-control"
            id="Tablero"
            name="Tablero"
            accept="image/*"
            onChange={(e) => setSelectedFileTablero(e.target.files[0])}
            required
          />
        </div>

        {/* Imagen del calentamiento */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Calentamiento" className="form-label">Imagen Calentamiento</label>
          <input
            type="file"
            className="form-control"
            id="Calentamiento"
            name="Calentamiento"
            accept="image/*"
            onChange={(e) => setSelectedFileCalentamiento(e.target.files[0])}
            required
          />
        </div>

        {/* Fecha */}
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

        {/* Estado Etapa */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_etapa" className="form-label">Estado Etapa</label>
          <select className="form-select" id="Est_etapa" name="Est_etapa" value={Formulario.Est_etapa} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Inicio">Inicio</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizó">Finalizó</option>
          </select>
        </div>

        {/* Estado Herramienta */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_her" className="form-label">Estado Herramienta</label>
          <select className="form-select" id="Est_her" name="Est_her" value={Formulario.Est_her} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {Formulario.Est_her === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label className="form-label">Motivo herramienta</label>
            <textarea className="form-control" id="MotivoHer" name="MotivoHer" value={Formulario.MotivoHer} onChange={handleInputChange} required />
          </div>
        )}

        {/* Botones */}
        <div className="col-12 text-center mt-4">
          <button type="button" onClick={() => window.location.href = '/IndexEmpleado'} className="btn btn-primary me-2">
            Regresar
          </button>
          <button type="submit" className="btn btn-primary ms-2">
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
