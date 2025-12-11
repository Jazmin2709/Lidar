// 📁 EmpleadosCompleto.jsx - Módulo completo de gestión de empleados
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// ------------------------------------------------------------
// 🎯 COMPONENTE PRINCIPAL DE GESTIÓN DE EMPLEADOS
// ------------------------------------------------------------
const EmpleadosCompleto = () => {
  // 🏗️ ESTADOS PRINCIPALES
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  
  // 🎛️ ESTADOS PARA FILTROS Y BÚSQUEDA
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 8;
  
  // 📝 ESTADO PARA FORMULARIO
  const [formulario, setFormulario] = useState({
    Correo: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    Celular: '',
    Contrasena: '',
    Tipo_Doc: 'CC',
    id_rol: 2,
  });
  
  const [mostrarPassword, setMostrarPassword] = useState(false);
  
  const API_URL = process.env.API_URL || "https://lidar-cush.onrender.com/api";

  // ------------------------------------------------------------
  // 🔄 FUNCIONES DE CARGA DE DATOS
  // ------------------------------------------------------------
  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(`${API_URL}/empleados`);
      setEmpleados(response.data);
    } catch (error) {
      Swal.fire('Error', 'Error al cargar empleados', 'error');
    }
  };

  const cargarRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/empleados/roles`);
      setRoles(response.data);
    } catch (error) {
      console.error('Error cargando roles:', error);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarRoles();
  }, []);

  // ------------------------------------------------------------
  // 🔍 FUNCIONES DE FILTRADO Y BÚSQUEDA
  // ------------------------------------------------------------
  const empleadosFiltrados = useMemo(() => {
    return empleados
      .filter((emp) => {
        // Búsqueda por texto
        const texto = busqueda.toLowerCase().trim();
        if (texto === "") return true;

        const esSoloNumero = /^\d+$/.test(texto);

        if (esSoloNumero) {
          return String(emp.Cedula).includes(texto);
        } else {
          return (
            emp.Nombres.toLowerCase().includes(texto) ||
            emp.Apellidos.toLowerCase().includes(texto) ||
            String(emp.Cedula).includes(texto)
          );
        }
      })
      .filter((emp) => {
        // Filtro por estado
        if (filtroEstado === "activos") return emp.activo === 1;
        if (filtroEstado === "inactivos") return emp.activo === 0;
        return true;
      })
      .filter((emp) => {
        // Filtro por rol
        if (filtroRol === "todos") return true;
        return Number(emp.id_rol) === parseInt(filtroRol, 10);
      });
  }, [empleados, busqueda, filtroEstado, filtroRol]);

  const totalPaginas = Math.ceil(empleadosFiltrados.length / registrosPorPagina);
  const empleadosPaginados = empleadosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ------------------------------------------------------------
  // ✏️ FUNCIONES CRUD
  // ------------------------------------------------------------
  const handleToggleActivo = async (empleado) => {
    const confirmacion = await Swal.fire({
      title: `¿${empleado.activo ? "Desactivar" : "Activar"} empleado?`,
      text: `El empleado ${empleado.Nombres} será ${empleado.activo ? "desactivado" : "activado"}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: empleado.activo ? '#dc3545' : '#198754',
      confirmButtonText: `Sí, ${empleado.activo ? "desactivar" : "activar"}`
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await axios.put(`${API_URL}/empleados/${empleado.id_per}/toggle`, {
        activo: empleado.activo === 1 ? 0 : 1
      });
      
      Swal.fire('Éxito', 'Estado actualizado correctamente', 'success');
      cargarEmpleados();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al cambiar estado', 'error');
    }
  };

  const handleAbrirFormularioEdicion = (empleado = null) => {
    setEmpleadoEditando(empleado);
    setMostrarPassword(false);
    
    if (empleado) {
      setFormulario({
        Correo: empleado.Correo,
        Nombres: empleado.Nombres,
        Apellidos: empleado.Apellidos,
        Cedula: empleado.Cedula,
        Celular: empleado.Celular,
        Contrasena: '',
        Tipo_Doc: empleado.Tipo_Doc,
        id_rol: empleado.id_rol
      });
    } else {
      setFormulario({
        Correo: '',
        Nombres: '',
        Apellidos: '',
        Cedula: '',
        Celular: '',
        Contrasena: '',
        Tipo_Doc: 'CC',
        id_rol: 2,
      });
    }
    
    setShowModal(true);
  };

  const handleSubmitFormulario = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.Correo)) {
      return Swal.fire('Correo inválido', 'Ingresa un correo válido', 'warning');
    }
    if (!formulario.Nombres || !formulario.Apellidos) {
      return Swal.fire('Campos requeridos', 'Ingresa nombres y apellidos', 'warning');
    }
    if (formulario.Cedula.length < 5) {
      return Swal.fire('Cédula inválida', 'Mínimo 5 dígitos', 'warning');
    }
    if (!empleadoEditando && formulario.Contrasena.length < 6) {
      return Swal.fire('Contraseña inválida', 'Mínimo 6 caracteres', 'warning');
    }

    try {
      if (empleadoEditando) {
        await axios.put(`${API_URL}/empleados/${empleadoEditando.id_per}`, formulario);
        Swal.fire('Actualizado', 'Empleado actualizado correctamente', 'success');
      } else {
        await axios.post(`${API_URL}/empleados`, formulario);
        Swal.fire('Creado', 'Empleado creado exitosamente', 'success');
      }
      
      setShowModal(false);
      cargarEmpleados();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al guardar', 'error');
    }
  };

  // ------------------------------------------------------------
  // 🎨 FUNCIÓN PARA OBTENER NOMBRE DEL ROL
  // ------------------------------------------------------------
  const obtenerNombreRol = (id_rol) => {
    const rolesMap = {
      1: "Supervisor",
      2: "Empleado",
      3: "Administrador"
    };
    return rolesMap[id_rol] || "Desconocido";
  };

  // ------------------------------------------------------------
  // 🎨 RENDERIZADO
  // ------------------------------------------------------------
  return (
    <div className="container-fluid bg-light p-4" style={{ minHeight: "100vh" }}>
      {/* BARRA SUPERIOR */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Empleados</h2>
        <button 
          className="btn btn-primary"
          onClick={() => handleAbrirFormularioEdicion()}
        >
          <i className="bi bi-person-plus me-2"></i>Nuevo Empleado
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="row mb-4">
        <div className="col-md-12">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar por nombre, apellido o cédula..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>
      </div>

      {/* FILTROS RÁPIDOS */}
      <div className="row mb-4">
        <div className="col-md-3">
          <select 
            className="form-select"
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>
        <div className="col-md-3">
          <select 
            className="form-select"
            value={filtroRol}
            onChange={(e) => {
              setFiltroRol(e.target.value);
              setPaginaActual(1);
            }}
          >
            <option value="todos">Todos los roles</option>
            {roles.map((rol) => (
              <option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA DE EMPLEADOS */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Cédula</th>
                  <th>Celular</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No se encontraron empleados
                    </td>
                  </tr>
                ) : (
                  empleadosPaginados.map((emp) => (
                    <tr key={emp.id_per}>
                      <td>
                        <div className="fw-semibold">{emp.Nombres} {emp.Apellidos}</div>
                      </td>
                      <td>{emp.Correo}</td>
                      <td>{emp.Cedula}</td>
                      <td>{emp.Celular}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {obtenerNombreRol(emp.id_rol)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${emp.activo ? 'bg-success' : 'bg-danger'}`}>
                          {emp.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleAbrirFormularioEdicion(emp)}
                        >
                          Editar
                        </button>
                        <button
                          className={`btn btn-sm ${emp.activo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                          onClick={() => handleToggleActivo(emp)}
                        >
                          {emp.activo ? 'Desactivar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINACIÓN */}
        {totalPaginas > 1 && (
          <div className="card-footer">
            <nav>
              <ul className="pagination justify-content-center mb-0">
                <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  >
                    &laquo;
                  </button>
                </li>
                
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <li key={num} className={`page-item ${paginaActual === num ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPaginaActual(num)}>
                      {num}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* MODAL DE FORMULARIO */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {empleadoEditando ? 'Editar Empleado' : 'Nuevo Empleado'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              
              <form onSubmit={handleSubmitFormulario}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Correo *</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formulario.Correo}
                        onChange={(e) => setFormulario({...formulario, Correo: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Nombres *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formulario.Nombres}
                        onChange={(e) => setFormulario({...formulario, Nombres: e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")})}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Apellidos *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formulario.Apellidos}
                        onChange={(e) => setFormulario({...formulario, Apellidos: e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "")})}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Cédula *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formulario.Cedula}
                        onChange={(e) => setFormulario({...formulario, Cedula: e.target.value.replace(/[^0-9]/g, "")})}
                        required
                        maxLength="20"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Celular *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formulario.Celular}
                        onChange={(e) => setFormulario({...formulario, Celular: e.target.value.replace(/[^0-9]/g, "").slice(0, 10)})}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Tipo Documento *</label>
                      <select
                        className="form-select"
                        value={formulario.Tipo_Doc}
                        onChange={(e) => setFormulario({...formulario, Tipo_Doc: e.target.value})}
                        required
                      >
                        <option value="CC">Cédula</option>
                        <option value="TI">Tarjeta de Identidad</option>
                        <option value="CE">Cédula de Extranjería</option>
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">Rol *</label>
                      <select
                        className="form-select"
                        value={formulario.id_rol}
                        onChange={(e) => setFormulario({...formulario, id_rol: parseInt(e.target.value)})}
                        required
                      >
                        {roles.map((rol) => (
                          <option key={rol.id_rol} value={rol.id_rol}>
                            {rol.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label">
                        Contraseña {empleadoEditando ? '(dejar vacío para no cambiar)' : '*'}
                      </label>
                      <div className="input-group">
                        <input
                          type={mostrarPassword ? "text" : "password"}
                          className="form-control"
                          value={formulario.Contrasena}
                          onChange={(e) => setFormulario({...formulario, Contrasena: e.target.value})}
                          required={!empleadoEditando}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setMostrarPassword(!mostrarPassword)}
                        >
                          {mostrarPassword ? "🙈" : "👀"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {empleadoEditando ? 'Actualizar' : 'Crear'}
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

export default EmpleadosCompleto;