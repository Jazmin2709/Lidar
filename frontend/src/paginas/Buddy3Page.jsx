
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

export default function Buddy3Page() {

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
    Fecha: '',
    Est_etapa: '',
    Est_her: '',
    MotivoEmp: '',
    MotivoVeh: '',
    Tablero: '',
    Calentamiento: '',
    Tipo: 3,
    id_empleado: id_empleado
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, Formulario);
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
      <h2 className='text-center mb-4'>Formulario Buddy 3</h2>
      <form className='row g-3' onSubmit={handleSubmit}>
        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="num_cuadrilla" className="form-label">Número de Cuadrilla</label>
          <input type="text" className="form-control" id="num_cuadrilla" name="num_cuadrilla" value={Formulario.num_cuadrilla} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Hora_buddy" className="form-label">Hora Buddy</label>
          <input type="time" className="form-control" id="Hora_buddy" name="Hora_buddy" value={Formulario.Hora_buddy} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_empl" className="form-label">Estado Empleado</label>
          <select className="form-select" id="Est_empl" name="Est_empl" value={Formulario.Est_empl} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

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
            <label htmlFor="Motivo" className="form-label">Motivo empleado</label>
            <textarea type="text" className="form-control" id="MotivoEmp" name="MotivoEmp" value={Formulario.MotivoEmp} onChange={handleInputChange} required />
          </div>
        )}

        {Formulario.Est_vehi === 'Malo' && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
            <label htmlFor="Motivo" className="form-label">Motivo vehiculo</label>
            <textarea type="text" className="form-control" id="MotivoVeh" name="MotivoVeh" value={Formulario.MotivoVeh} onChange={handleInputChange} required />
          </div>
        )}

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Carnet" className="form-label">Carnet</label>
          <input type="text" className="form-control" id="Carnet" name="Carnet" value={Formulario.Carnet} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="TarjetaVida" className="form-label">Tarjeta Vida</label>
          <input type="text" className="form-control" id="TarjetaVida" name="TarjetaVida" value={Formulario.TarjetaVida} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Fecha" className="form-label">Fecha</label>
          <input type="date" className="form-control" id="Fecha" name="Fecha" value={Formulario.Fecha} onChange={handleInputChange} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: '350px' }}>
          <label htmlFor="Est_etapa" className="form-label">Estado Etapa</label>
          <select
            className="form-select"
            id="Est_etapa"
            name="Est_etapa"
            value={Formulario.Est_etapa}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Inicio">Inicio</option>
            <option value="En proceso">En proceso</option>
            <option value="Finalizó">Finalizó</option>
          </select>
        </div>

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
            <label htmlFor="Motivo" className="form-label">Motivo herramienta</label>
            <textarea type="text" className="form-control" id="MotivoHer" name="MotivoHer" value={Formulario.MotivoHer} onChange={handleInputChange} required />
          </div>
        )}

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
