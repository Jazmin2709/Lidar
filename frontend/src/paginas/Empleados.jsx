import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import '../css/Empleados.css';  // ← Importamos el CSS extraído

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    Correo: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    Celular: '',
    Contrasena: '',
    Tipo_Doc: 'CC',
    id_rol: 2,
  });

  const API_URL = 'http://localhost:3000/api/empleados';

  const soloTexto = (valor) => valor.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ ]/g, "");
  const soloNumeros = (valor) => valor.replace(/[^0-9]/g, "");

  const cargarEmpleados = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmpleados(response.data);
    } catch (error) {
      Swal.fire('Error de Carga', 'Hubo un error al intentar cargar la lista de empleados.', 'error');
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

  useEffect(() => {
    if (editando) {
      const { Contrasena, ...rest } = editando;
      setForm({ ...rest, Contrasena: '' });
    } else {
      setForm({
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
  }, [editando]);

  const onChangeForm = (e) => {
    const { name, value } = e.target;

    if (name === 'Nombres' || name === 'Apellidos') {
      if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) return;
    }
    if (name === 'Cedula') {
      if (!/^\d*$/.test(value)) return;
    }
    if (name === 'Celular') {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    if (name === 'Contrasena') {
      if (/\s/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const onClearForm = () => {
    setForm({
      Correo: '',
      Nombres: '',
      Apellidos: '',
      Cedula: '',
      Celular: '',
      Contrasena: '',
      Tipo_Doc: 'CC',
      id_rol: 2,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Correo)) {
      return Swal.fire('Correo inválido', 'Ingresa un correo válido', 'warning');
    }
    if (!form.Nombres || !form.Apellidos) {
      return Swal.fire('Campos requeridos', 'Ingresa nombres y apellidos válidos', 'warning');
    }
    if (form.Cedula.length < 5) {
      return Swal.fire('Cédula inválida', 'Debe contener al menos 5 dígitos', 'warning');
    }
    if (form.Celular.length < 7) {
      return Swal.fire('Celular inválido', 'Debe contener al menos 7 dígitos', 'warning');
    }
    if (!editando && form.Contrasena.length < 6) {
      return Swal.fire('Contraseña inválida', 'Debe tener mínimo 6 caracteres', 'warning');
    }

    try {
      if (editando) {
        await axios.put(`${API_URL}/${editando.id_per}`, form);
        Swal.fire('¡Actualizado!', 'Empleado actualizado correctamente', 'success');
      } else {
        if (!form.Contrasena) {
          return Swal.fire('Falta contraseña', 'Para crear un empleado, ingresa la contraseña', 'info');
        }
        await axios.post(API_URL, form);
        Swal.fire('¡Creado!', 'Empleado creado correctamente', 'success');
      }

      setShowModal(false);
      cargarEmpleados();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Error al guardar empleado', 'error');
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  useEffect(() => {
    cargarEmpleados();
    cargarRoles();
  }, []);

  // Lógica de tabla y filtros
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroRol, setFiltroRol] = useState("todos");
  const [showFiltroEstado, setShowFiltroEstado] = useState(false);
  const [showFiltroRol, setShowFiltroRol] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const getNombreRol = (id_rol) => {
    const rolEncontrado = roles.find(rol => rol.id_rol === id_rol);
    return rolEncontrado ? rolEncontrado.nombre : 'Desconocido';
  };

  const empleadosFiltrados = useMemo(() => {
    return empleados
      .filter((emp) => {
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
        if (filtroEstado === "activos") return emp.activo === 1;
        if (filtroEstado === "inactivos") return emp.activo === 0;
        return true;
      })
      .filter((emp) => {
        if (filtroRol === "todos") return true;
        return Number(emp.id_rol) === parseInt(filtroRol, 10);
      });
  }, [empleados, busqueda, filtroEstado, filtroRol]);

  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 8;
  const totalPaginas = Math.ceil(empleadosFiltrados.length / registrosPorPagina);

  const empleadosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * registrosPorPagina;
    return empleadosFiltrados.slice(inicio, inicio + registrosPorPagina);
  }, [empleadosFiltrados, paginaActual]);

  const cambiarPagina = (nueva) => {
    if (nueva >= 1 && nueva <= totalPaginas) setPaginaActual(nueva);
  };

  const handleApplyFiltroEstado = (value) => {
    setFiltroEstado(value);
    setPaginaActual(1);
    setShowFiltroEstado(false);
  };

  const handleApplyFiltroRol = (value) => {
    setFiltroRol(value);
    setPaginaActual(1);
    setShowFiltroRol(false);
  };

  const handleToggleActivo = async (empleado) => {
    const accion = empleado.activo === 1 ? "Desactivar" : "Activar";
    const estado = empleado.activo === 1 ? "inactivo" : "activo";

    Swal.fire({
      title: `¿Estás seguro de ${accion}?`,
      text: `Esta acción cambiará el estado de ${empleado.Nombres} a ${estado}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: accion === 'Desactivar' ? '#dc3545' : '#198754',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${accion}!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const nuevoEstado = empleado.activo === 1 ? 0 : 1;
          await axios.put(`${API_URL}/${empleado.id_per}/activo`, { activo: nuevoEstado });
          Swal.fire('¡Actualizado!', `El empleado ha sido ${nuevoEstado ? 'activado' : 'desactivado'} correctamente.`, 'success');
          cargarEmpleados();
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Error al cambiar estado del empleado', 'error');
        }
      }
    });
  };

  const handleEditarConfirm = (empleado) => {
    Swal.fire({
      title: '¿Deseas editar este empleado? 📝',
      text: `Estás a punto de modificar la información de ${empleado.Nombres}.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, Editar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleEditar(empleado);
      }
    });
  };

  return (
    <div className="container-fluid empleados-container">
      <div className="d-flex justify-content-between align-items-center mb-4 empleados-header">
        <h2>Gestión de Empleados</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditando(null);
            setShowPassword(false);
            setForm({
              Correo: '',
              Nombres: '',
              Apellidos: '',
              Cedula: '',
              Celular: '',
              Contrasena: '',
              Tipo_Doc: 'CC',
              id_rol: 2
            });
            setShowModal(true);
          }}
        >
          <i className="bi bi-person-plus"></i> Nuevo Empleado
        </button>
      </div>

      <div className="container-fluid bg-light p-4" style={{ minHeight: "100vh" }}>
        {/* Barra de búsqueda */}
        <div className="row mb-4">
          <div className="col-md-12">
            <input
              type="text"
              className="empleados-modern-input"
              placeholder="🔍 Búsqueda rápida por nombre, apellido o cédula..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
        </div>

        <div className="empleados-custom-card p-0">
          <div className="table-responsive">
            <table className="empleados-custom-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Cédula</th>
                  <th>Celular</th>
                  <th>
                    <div className="empleados-filter-header-content">
                      Rol
                      <span
                        className={`empleados-filter-icon ${filtroRol !== 'todos' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFiltroRol(!showFiltroRol);
                          setShowFiltroEstado(false);
                        }}
                      >
                        {filtroRol !== 'todos' ? '▼' : '▼'}
                      </span>
                    </div>
                    {showFiltroRol && (
                      <div className="empleados-filter-dropdown" onClick={e => e.stopPropagation()}>
                        <div className="mb-2">
                          {roles.map((rol) => (
                            <label key={rol.id_rol}>
                              <input
                                type="radio"
                                name="filtroRol"
                                value={String(rol.id_rol)}
                                checked={filtroRol === String(rol.id_rol)}
                                onChange={() => handleApplyFiltroRol(String(rol.id_rol))}
                              />
                              {' '} {rol.nombre}
                            </label>
                          ))}
                          <label>
                            <input
                              type="radio"
                              name="filtroRol"
                              value="todos"
                              checked={filtroRol === "todos"}
                              onChange={() => handleApplyFiltroRol("todos")}
                            />
                            {' '} Todos
                          </label>
                        </div>
                        <button onClick={() => handleApplyFiltroRol(filtroRol)}>OK</button>
                        <button className="reset" onClick={() => handleApplyFiltroRol('todos')}>Reset</button>
                      </div>
                    )}
                  </th>
                  <th>
                    <div className="empleados-filter-header-content">
                      Estado
                      <span
                        className={`empleados-filter-icon ${filtroEstado !== 'todos' ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFiltroEstado(!showFiltroEstado);
                          setShowFiltroRol(false);
                        }}
                      >
                        {filtroEstado !== 'todos' ? '▼' : '▼'}
                      </span>
                    </div>
                    {showFiltroEstado && (
                      <div className="empleados-filter-dropdown" onClick={e => e.stopPropagation()}>
                        <div className="mb-2">
                          <label>
                            <input
                              type="radio"
                              checked={filtroEstado === 'activos'}
                              onChange={() => handleApplyFiltroEstado(filtroEstado === 'activos' ? 'todos' : 'activos')}
                            />
                            {' '} Activo
                          </label>
                          <label>
                            <input
                              type="radio"
                              checked={filtroEstado === 'inactivos'}
                              onChange={() => handleApplyFiltroEstado(filtroEstado === 'inactivos' ? 'todos' : 'inactivos')}
                            />
                            {' '} Inactivo
                          </label>
                          <label>
                            <input
                              type="radio"
                              checked={filtroEstado === 'todos'}
                              onChange={() => handleApplyFiltroEstado('todos')}
                            />
                            {' '} Todos
                          </label>
                        </div>
                        <button onClick={() => handleApplyFiltroEstado(filtroEstado)}>OK</button>
                        <button className="reset" onClick={() => handleApplyFiltroEstado('todos')}>Reset</button>
                      </div>
                    )}
                  </th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleadosPaginados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-5 text-muted">
                      No se encontraron resultados
                    </td>
                  </tr>
                ) : (
                  empleadosPaginados.map((emp) => (
                    <tr key={emp.id_per}>
                      <td>
                        <div className="fw-bold">{emp.Nombres}</div>
                        <div className="small text-muted">{emp.Apellidos}</div>
                      </td>
                      <td>{emp.Correo}</td>
                      <td>{emp.Cedula}</td>
                      <td>{emp.Celular}</td>
                      <td>
                        <span className="badge bg-light text-dark border shadow-sm fw-normal empleados-role-badge">
                          {getNombreRol(emp.id_rol)}
                        </span>
                      </td>
                      <td>
                        {emp.activo === 1 ? (
                          <div className="d-flex align-items-center">
                            <span 
                              className="empleados-status-dot" 
                              style={{ backgroundColor: '#16a34a' }}
                            ></span>
                            <span style={{ color: '#166534', fontWeight: '500' }}>Activo</span>
                          </div>
                        ) : (
                          <div className="d-flex align-items-center">
                            <span 
                              className="empleados-status-dot" 
                              style={{ backgroundColor: '#dc2626' }}
                            ></span>
                            <span style={{ color: '#991b1b', fontWeight: '500' }}>Inactivo</span>
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span
                          className="empleados-action-link empleados-text-blue me-3"
                          onClick={() => handleEditarConfirm(emp)}
                        >
                          Editar
                        </span>
                        <span
                          className="empleados-action-link empleados-text-red"
                          onClick={() => handleToggleActivo(emp)}
                        >
                          {emp.activo === 1 ? "Desactivar" : "Activar"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className="d-flex justify-content-end mt-4 pt-2 border-top px-4 empleados-pagination">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link border-0 text-dark"
                      onClick={() => cambiarPagina(paginaActual - 1)}
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPaginas }).map((_, index) => (
                    <li
                      key={index}
                      className={`page-item ${paginaActual === index + 1 ? "active" : ""}`}
                    >
                      <button
                        className={`page-link border-0 ${paginaActual === index + 1 ? "bg-dark text-white rounded-circle mx-1" : "text-dark"}`}
                        onClick={() => cambiarPagina(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button
                      className="page-link border-0 text-dark"
                      onClick={() => cambiarPagina(paginaActual + 1)}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="modal-backdrop fade show empleados-modal-backdrop"
            onClick={() => setShowModal(false)}
          />
          <div
            className="modal fade show empleados-modal"
            tabIndex="-1"
            style={{
              display: 'block',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
              outline: 0
            }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editando ? 'Editar Empleado' : 'Nuevo Empleado'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  />
                </div>
                <form className='row g-3' onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <label className='form-label'>Correo</label>
                        <input
                          className='form-control'
                          type='email'
                          name='Correo'
                          value={form.Correo}
                          onChange={onChangeForm}
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Nombres</label>
                        <input
                          className='form-control'
                          type='text'
                          name='Nombres'
                          value={form.Nombres}
                          onChange={onChangeForm}
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Apellidos</label>
                        <input
                          className='form-control'
                          type='text'
                          name='Apellidos'
                          value={form.Apellidos}
                          onChange={onChangeForm}
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Cédula</label>
                        <input
                          className='form-control'
                          type='text'
                          name='Cedula'
                          value={form.Cedula}
                          onChange={onChangeForm}
                        />
                      </div>
                      <div className='col-md-6'>
                        <label className='form-label'>Celular</label>
                        <input
                          className='form-control'
                          type='text'
                          name='Celular'
                          value={form.Celular}
                          onChange={onChangeForm}
                        />
                      </div>
                      <div className='col-md-4'>
                        <label className='form-label'>Tipo Documento</label>
                        <select
                          className='form-select'
                          name='Tipo_Doc'
                          value={form.Tipo_Doc}
                          onChange={onChangeForm}
                        >
                          <option value='CC'>Cédula</option>
                          <option value='TI'>Tarjeta de Identidad</option>
                          <option value='CE'>Cédula de Extranjería</option>
                        </select>
                      </div>
                      <div className='col-md-4'>
                        <label className='form-label'>Rol</label>
                        <select
                          className='form-select'
                          name='id_rol'
                          value={form.id_rol}
                          onChange={onChangeForm}
                        >
                          {roles.map((r) => (
                            <option key={r.id_rol} value={r.id_rol}>
                              {r.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='col-md-4' style={{ position: 'relative' }}>
                        <label className='form-label'>
                          Contraseña {editando ? '(deja en blanco para no cambiar)' : ''}
                        </label>
                        <input
                          className='form-control'
                          type={showPassword ? 'text' : 'password'}
                          name='Contrasena'
                          value={form.Contrasena}
                          onChange={onChangeForm}
                          placeholder={editando ? 'No cambiar' : ''}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '30px',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            color: showPassword ? 'green' : 'red'
                          }}
                        >
                          {showPassword ? "👀" : "🙈"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className='btn btn-primary' type='submit'>
                      {editando ? 'Actualizar' : 'Agregar'}
                    </button>
                    <button
                      className='btn btn-secondary ms-2'
                      type='button'
                      onClick={onClearForm}
                    >
                      Limpiar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Empleados;