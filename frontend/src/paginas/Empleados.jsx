import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmpleadosTable from '../componentes/EmpleadosTable';
import Swal from 'sweetalert2';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    Correo: '', Nombres: '', Apellidos: '', Cedula: '',
    Celular: '', Contrasena: '', Tipo_Doc: '', id_rol: ''
  });

const API_URL = process.env.API_URL || "https://lidar-cush.onrender.com/api";

  // 🔤 VALIDACIONES
  const soloTexto = (valor) => valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
  const soloNumeros = (valor) => valor.replace(/[^0-9]/g, "");

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmpleados(response.data);
    } catch (error) {
      Swal.fire( // ✅ Usamos SweetAlert
        'Error de Carga',
        'Hubo un error al intentar cargar la lista de empleados.',
        'error'
      );
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
    // 🛑 ATENCIÓN: Esta función ahora asume que la CONFIRMACIÓN ya fue hecha
    // por la SweetAlert del componente hijo.

    try {
      const nuevoEstado = empleado.activo === 1 ? 0 : 1;
      await axios.put(`${API_URL}/${empleado.id_per}/activo`, {
        activo: nuevoEstado
      });

      // Alerta SweetAlert de ÉXITO
      Swal.fire(
        '¡Actualizado!',
        `El empleado ha sido ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`,
        'success'
      );

      cargarEmpleados();
    } catch (error) {
      // Alerta SweetAlert de ERROR
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Error al cambiar estado del empleado',
        'error'
      );
    }
  };

  const handleEditar = (emp) => {
    setEditando(emp);
    setShowPassword(false);
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
        // Lógica de actualización (PUT)
        await axios.put(`${API_URL}/${editando.id_per}`, form);

        // 🌟 REEMPLAZAR LA ALERTA NATIVA con SweetAlert de éxito
        Swal.fire(
          '¡Actualizado!',
          'Empleado actualizado correctamente',
          'success'
        );

      } else {
        // Lógica de creación (POST)
        await axios.post(API_URL, form);

        // 🌟 REEMPLAZAR LA ALERTA NATIVA con SweetAlert de éxito
        Swal.fire(
          '¡Creado!',
          'Empleado creado correctamente',
          'success'
        );
      }

      setShowModal(false);
      cargarEmpleados();

    } catch (error) {
      // Asegúrate que el manejo de errores también use SweetAlert si quieres que sea consistente
      Swal.fire(
        'Error',
        error.response?.data?.message || 'Error al guardar empleado',
        'error'
      );
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarRoles();
  }, []);

  return (
    <div className="container-fluid" style={{ padding: '100px 50px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ padding: '0 50px' }}>
        <h2>Gestión de Empleados</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setShowPassword(false);
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

      <EmpleadosTable empleados={empleados} onToggleActivo={handleToggleActivo} onEditar={handleEditar} />

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">{editando ? 'Editar Empleado' : 'Nuevo Empleado'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">

                    <div className="col-md-6">
                      <label className="form-label">Nombres *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.Nombres}
                        onChange={(e) => setForm({ ...form, Nombres: soloTexto(e.target.value) })}
                        required
                        placeholder='Escribir nombre'
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.Apellidos}
                        onChange={(e) => setForm({ ...form, Apellidos: soloTexto(e.target.value) })}
                        required
                        placeholder='Escribir apellidos'
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.Correo}
                        onChange={(e) => setForm({ ...form, Correo: e.target.value })}
                        required
                        placeholder='Escribir email'
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Cédula *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.Cedula}
                        onChange={(e) => setForm({ ...form, Cedula: soloNumeros(e.target.value) })}
                        required
                        placeholder='Solo números'
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Celular *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.Celular}
                        onChange={(e) => setForm({ ...form, Celular: soloNumeros(e.target.value) })}
                        required
                        placeholder='Solo números'
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tipo Documento *</label>
                      <select className="form-select" value={form.Tipo_Doc}
                        onChange={(e) => setForm({ ...form, Tipo_Doc: e.target.value })} required>
                        <option value="">Seleccionar</option>
                        <option value="CC">Cédula</option>
                        <option value="TI">Tarjeta Identidad</option>
                        <option value="CE">Cédula Extranjería</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Rol *</label>
                      <select className="form-select" value={form.id_rol}
                        onChange={(e) => setForm({ ...form, id_rol: e.target.value })} required>
                        <option value="">Seleccionar rol</option>
                        {roles.map(rol => (
                          <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
                        ))}
                      </select>
                    </div>

                    {/* CONTRASEÑA */}
                    <div className="col-md-6">
                      <label className="form-label">
                        Contraseña {editando ? '(dejar vacío si no cambia)' : '*'}
                      </label>

                      <div style={{ position: 'relative' }}>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          value={form.Contrasena}
                          onChange={(e) => setForm({ ...form, Contrasena: e.target.value })}
                          required={!editando}
                        />

                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: "absolute",
                            right: "12px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                            fontSize: "22px"
                          }}
                        >
                          {showPassword ? "👀" : "🙈"}
                        </span>
                      </div>
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
