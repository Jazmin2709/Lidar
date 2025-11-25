import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmpleadosTable from '../componentes/EmpleadosTable';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    Correo: '', Nombres: '', Apellidos: '', Cedula: '', 
    Celular: '', Contrasena: '', Tipo_Doc: '', id_rol: ''
  });

  const API_URL = 'http://localhost:3000/api/empleados';

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmpleados(response.data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      alert('Error al cargar empleados');
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

  const handleToggleActivo = async (empleado) => {
    if (!window.confirm(`¿Estás seguro de ${empleado.activo === 1 ? 'desactivar' : 'activar'} a ${empleado.Nombres}?`)) {
      return;
    }

    try {
      const nuevoEstado = empleado.activo === 1 ? 0 : 1;
      await axios.put(`${API_URL}/${empleado.id_per}/activo`, { 
        activo: nuevoEstado 
      });
      
      alert(`Empleado ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
      cargarEmpleados();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error al cambiar estado del empleado');
    }
  };

  const handleEditar = (emp) => {
    setEditando(emp);
    setForm({
      Correo: emp.Correo,
      Nombres: emp.Nombres,
      Apellidos: emp.Apellidos,
      Cedula: emp.Cedula,
      Celular: emp.Celular,
      Contrasena: '',
      Tipo_Doc: emp.Tipo_Doc,
      id_rol: emp.id_rol
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await axios.put(`${API_URL}/${editando.id_per}`, form);
        alert('Empleado actualizado correctamente');
      } else {
        await axios.post(API_URL, form);
        alert('Empleado creado correctamente');
      }
      setShowModal(false);
      cargarEmpleados();
    } catch (error) {
      console.error('Error guardando empleado:', error);
      alert(error.response?.data?.message || 'Error al guardar empleado');
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarRoles();
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Empleados</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setForm({
              Correo: '', Nombres: '', Apellidos: '', Cedula: '', 
              Celular: '', Contrasena: '', Tipo_Doc: '', id_rol: ''
            });
            setShowModal(true);
          }}
        >
          <i className="bi bi-person-plus"></i> Nuevo Empleado
        </button>
      </div>

      <EmpleadosTable 
        empleados={empleados}
        onToggleActivo={handleToggleActivo}
        onEditar={handleEditar}
      />

      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editando ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nombres *</label>
                      <input type="text" className="form-control" value={form.Nombres} 
                        onChange={(e) => setForm({...form, Nombres: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Apellidos *</label>
                      <input type="text" className="form-control" value={form.Apellidos} 
                        onChange={(e) => setForm({...form, Apellidos: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control" value={form.Correo} 
                        onChange={(e) => setForm({...form, Correo: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Cédula *</label>
                      <input type="text" className="form-control" value={form.Cedula} 
                        onChange={(e) => setForm({...form, Cedula: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Celular *</label>
                      <input type="text" className="form-control" value={form.Celular} 
                        onChange={(e) => setForm({...form, Celular: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Tipo Documento *</label>
                      <select className="form-select" value={form.Tipo_Doc} 
                        onChange={(e) => setForm({...form, Tipo_Doc: e.target.value})} required>
                        <option value="">Seleccionar</option>
                        <option value="CC">Cédula</option>
                        <option value="TI">Tarjeta Identidad</option>
                        <option value="CE">Cédula Extranjería</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Rol *</label>
                      <select className="form-select" value={form.id_rol} 
                        onChange={(e) => setForm({...form, id_rol: e.target.value})} required>
                        <option value="">Seleccionar rol</option>
                        {roles.map(rol => (
                          <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">
                        Contraseña {editando ? '(dejar vacío para no cambiar)' : '*'}
                      </label>
                      <input type="password" className="form-control" value={form.Contrasena} 
                        onChange={(e) => setForm({...form, Contrasena: e.target.value})} 
                        required={!editando} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Empleados;