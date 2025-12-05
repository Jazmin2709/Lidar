import React, { useState, useMemo } from "react";
import Swal from 'sweetalert2'; // 👈 Swal está importado y listo para usarse

const EmpleadosTable = ({ empleados = [], onToggleActivo, onEditar }) => {
    // -------------------------------
    // 🔍 FILTROS (Segmentados por Columna)
    // -------------------------------
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCedula, setFiltroCedula] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroRol, setFiltroRol] = useState("todos");

    // NUEVOS ESTADOS para manejar la VISIBILIDAD del dropdown de cada filtro
    const [showFiltroEstado, setShowFiltroEstado] = useState(false);
    const [showFiltroRol, setShowFiltroRol] = useState(false);

    // El filtro de búsqueda general se mantiene para buscar por Nombre, Apellido, Cédula
    const [busqueda, setBusqueda] = useState("");


    // Lista de Roles actualizada para coincidir con tu DB (IDs 1, 2, 3)
    const roles = [
        { id: 1, nombre: "supervisor" },
        { id: 2, nombre: "empleado" },
        { id: 3, nombre: "Administrador" },
    ];

    // Función de ayuda para buscar el nombre del Rol por ID
    const getNombreRol = (id_rol) => {
        const rolEncontrado = roles.find(rol => rol.id === id_rol);
        return rolEncontrado ? rolEncontrado.nombre : 'Desconocido';
    };


    const empleadosFiltrados = useMemo(() => {
        return empleados
            .filter((emp) => {
                // 1. Filtrado por Búsqueda General (Texto/Número)
                const texto = busqueda.toLowerCase().trim();
                if (texto === "") return true;

                const esSoloNumero = /^\d+$/.test(texto);

                if (esSoloNumero) {
                    // Buscar SOLAMENTE POR CÉDULA
                    return String(emp.Cedula).includes(texto);
                } else {
                    // Buscar por Nombre, Apellido o Cédula
                    return (
                        emp.Nombres.toLowerCase().includes(texto) ||
                        emp.Apellidos.toLowerCase().includes(texto) ||
                        String(emp.Cedula).includes(texto)
                    );
                }
            })
            .filter((emp) => {
                // 2. Filtrado por Estado (Columna Estado)
                if (filtroEstado === "activos") return emp.activo === 1;
                if (filtroEstado === "inactivos") return emp.activo === 0;
                return true;
            })
            .filter((emp) => {
                // **✅ MODIFICACIÓN CLAVE PARA FILTRAR EL ROL**
                if (filtroRol === "todos") return true;

                // Aseguramos que emp.id_rol (que puede ser number o string) se compara
                // con filtroRol (que viene como string y lo convertimos a number)
                return Number(emp.id_rol) === parseInt(filtroRol, 10);
            });
    }, [empleados, busqueda, filtroEstado, filtroRol]);

    // -------------------------------
    // 📄 PAGINACIÓN
    // -------------------------------
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

    // Función helper para aplicar filtro y cerrar el dropdown
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

    // ----------------------------------------------------
    // 🚨 FUNCIÓN DE ALERTA 1: ACTIVAR/DESACTIVAR
    // ----------------------------------------------------
    const handleToggleActivo = (empleado) => {
        const accion = empleado.activo === 1 ? "Desactivar" : "Activar";
        const estado = empleado.activo === 1 ? "inactivo" : "activo";

        Swal.fire({
            title: `¿Estás seguro de ${accion}?`,
            text: `Esta acción cambiará el estado de ${empleado.Nombres} a ${estado}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: accion === 'Desactivar' ? '#dc3545' : '#198754', // Rojo para Desactivar, Verde para Activar
            cancelButtonColor: '#6c757d',
            confirmButtonText: `Sí, ${accion}!`
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, llama a la función prop que manejará la lógica de negocio (API call)
                onToggleActivo(empleado);
                // NOTA IMPORTANTE: La ALERTA DE ÉXITO debe ir en la función API (onToggleActivo)
                // del componente padre, después de recibir la respuesta 200 OK del backend.
            }
        });
    };
    // ----------------------------------------------------
    // 🚨 FUNCIÓN DE ALERTA 2: EDITAR (Confirmación previa)
    // ----------------------------------------------------
    const handleEditarConfirm = (empleado) => {
        Swal.fire({
            title: '¿Deseas editar este empleado?',
            text: `Estás a punto de modificar la información de ${empleado.Nombres}.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3b82f6', // Color azul para Editar
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, Editar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Si el usuario confirma, llama a la función prop que abrirá el modal de edición
                onEditar(empleado);
            }
        });
    };
    // ----------------------------------------------------


    return (
        <div className="container-fluid bg-light p-4" style={{ minHeight: "100vh" }}>
            {/* Estilos CSS adaptados para filtros DESPLEGABLES */}
            <style>{`
                /* ... Estilos custom-card, custom-table, etc. se mantienen ... */
                .custom-card {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                    overflow: hidden;
                    padding-bottom: 20px;
                }

                .custom-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 0.85rem;
                }
                
                /* Contenedor de la cabecera */
                .custom-table thead th {
                    background-color: #f8f9fa;
                    color: #6c757d;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 16px;
                    border-bottom: 2px solid #e9ecef;
                    text-align: left;
                    position: relative; /* Clave para posicionar el dropdown */
                }
                
                /* Estilo para el icono de filtro */
                .filter-header-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .filter-icon {
                    cursor: pointer;
                    margin-left: 8px;
                    font-size: 0.8rem;
                    color: #6c757d;
                }
                /* Color del icono cuando el filtro está activo */
                .filter-icon.active {
                    color: #3b82f6; 
                    font-weight: bold;
                }
                
                /* Estilo del Dropdown de filtro (replicando la imagen) */
                .filter-dropdown {
                    position: absolute;
                    top: 100%; /* Justo debajo del header */
                    left: 0;
                    z-index: 1000;
                    background: white;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    padding: 10px;
                    min-width: 150px;
                }
                .filter-dropdown label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: normal;
                }
                .filter-dropdown button {
                    background-color: #3b82f6;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    float: right;
                    margin-top: 10px;
                    font-size: 0.85rem;
                }
                .filter-dropdown button.reset {
                    background-color: #f8f9fa;
                    color: #6c757d;
                    margin-right: 5px;
                }

                .custom-table tbody tr {
                  background-color: white;
                  border-bottom: 1px solid #f1f3f5;
                  transition: background-color 0.2s;
                }

                .custom-table tbody tr:hover {
                  background-color: #f8f9fa;
                }

                .custom-table td {
                  padding: 14px 16px;
                  color: #374151;
                  vertical-align: middle;
                }
                
                .action-link {
                  cursor: pointer;
                  font-weight: 500;
                  text-decoration: none;
                  margin-right: 15px;
                  font-size: 0.8rem;
                  transition: color 0.2s;
                }
                .action-link:hover { text-decoration: underline; }
                .text-blue { color: #3b82f6; }
                .text-blue:hover { color: #2563eb; }
                .text-red { color: #ef4444; }
                .text-red:hover { color: #dc2626; }
                
                /* Inputs modernos (mantengo el estilo de búsqueda general si lo quieres reincorporar) */
                .modern-input {
                  border: 1px solid #e2e8f0;
                  border-radius: 8px;
                  padding: 10px 15px;
                  width: 100%;
                  outline: none;
                  transition: border-color 0.2s, box-shadow 0.2s;
                }
                .modern-input:focus { 
                  border-color: #3b82f6; 
                  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
            `}</style>
            
            {/* Barra de Búsqueda General (Mantengo por utilidad, si no la quieres, puedes borrar este div) */}
            <div className="row mb-4">
                <div className="col-md-12">
                    <input
                        type="text"
                        className="modern-input"
                        placeholder="🔍 Búsqueda rápida por nombre, apellido o cédula..."
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPaginaActual(1);
                        }}
                    />
                </div>
            </div>

            <div className="custom-card p-0"> 
                {/* ------------------------------ */}
                {/* 📋 TABLA ESTILIZADA CON FILTROS DESPLEGABLES */}
                {/* ------------------------------ */}
                <div className="table-responsive">
                    <table className="custom-table">
                        <thead>
                            {/* FILA ÚNICA: Encabezados de Columna con Iconos de Filtro */}
                            <tr>
                                {/* Nombre Completo: Opción de añadir búsqueda textual aquí si se requiere */}
                                <th>Nombre Completo</th>
                                <th>Email</th>
                                <th>Cédula</th>
                                <th>Celular</th>
                                
                                {/* Columna Rol con Filtro Desplegable */}
                                <th>
                                    <div className="filter-header-content">
                                        Rol
                                        <span 
                                            className={`filter-icon ${filtroRol !== 'todos' ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evitar cualquier acción de ordenamiento
                                                setShowFiltroRol(!showFiltroRol);
                                                setShowFiltroEstado(false); // Cierra el otro filtro
                                            }}
                                        >
                                            {filtroRol !== 'todos' ? '▼' : '▼'}
                                        </span>
                                    </div>
                                    
                                    {/* Dropdown del Filtro Rol */}
                                    {showFiltroRol && (
                                        <div className="filter-dropdown" onClick={e => e.stopPropagation()}>
                                            <div className="mb-2">
                                                {/* El mapeo de roles usa la lista actualizada (1, 2, 3) */}
                                                {roles.map((rol) => (
                                                    <label key={rol.id}>
                                                        <input 
                                                            type="checkbox" 
                                                            value={String(rol.id)}
                                                            // Se mantiene la lógica de selección única/toggle para este checkbox
                                                            checked={filtroRol === String(rol.id)}
                                                            onChange={() => handleApplyFiltroRol(filtroRol === String(rol.id) ? 'todos' : String(rol.id))}
                                                        />
                                                        {' '} {rol.nombre}
                                                    </label>
                                                ))}
                                            </div>
                                            {/* Botones de acción, como en tu imagen */}
                                            <button onClick={() => handleApplyFiltroRol(filtroRol)}>OK</button>
                                            <button className="reset" onClick={() => handleApplyFiltroRol('todos')}>Reset</button>
                                        </div>
                                    )}
                                </th>

                                {/* Columna Estado con Filtro Desplegable */}
                                <th>
                                    <div className="filter-header-content">
                                        Estado
                                        <span 
                                            className={`filter-icon ${filtroEstado !== 'todos' ? 'active' : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation(); // Evitar cualquier acción de ordenamiento
                                                setShowFiltroEstado(!showFiltroEstado);
                                                setShowFiltroRol(false); // Cierra el otro filtro
                                            }}
                                        >
                                            {filtroEstado !== 'todos' ? '▼' : '▼'}
                                        </span>
                                    </div>
                                    
                                    {/* Dropdown del Filtro Estado (replicando la imagen) */}
                                    {showFiltroEstado && (
                                        <div className="filter-dropdown" onClick={e => e.stopPropagation()}>
                                            <div className="mb-2">
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={filtroEstado === 'activos'}
                                                        onChange={() => handleApplyFiltroEstado(filtroEstado === 'activos' ? 'todos' : 'activos')}
                                                    />
                                                    {' '} Activo
                                                </label>
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={filtroEstado === 'inactivos'}
                                                        onChange={() => handleApplyFiltroEstado(filtroEstado === 'inactivos' ? 'todos' : 'inactivos')}
                                                    />
                                                    {' '} Inactivo
                                                </label>
                                            </div>
                                            {/* Botones de acción, como en tu imagen */}
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
                                            {/* Usar la función getNombreRol para mostrar el nombre correcto */}
                                            <span className="badge bg-light text-dark border shadow-sm fw-normal">
                                                {getNombreRol(emp.id_rol)}
                                            </span>
                                        </td>
                                        <td>
                                            {emp.activo === 1 ? (
                                                <div className="d-flex align-items-center">
                                                    <span style={{ height: '8px', width: '8px', backgroundColor: '#16a34a', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>
                                                    <span style={{ color: '#166534', fontWeight: '500' }}>Activo</span>
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center">
                                                    <span style={{ height: '8px', width: '8px', backgroundColor: '#dc2626', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></span>
                                                    <span style={{ color: '#991b1b', fontWeight: '500' }}>Inactivo</span>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span
                                                className="action-link text-blue"
                                                // 🚨 CAMBIO: Llama a la nueva función de confirmación de edición
                                                onClick={() => handleEditarConfirm(emp)}
                                            >
                                                Editar
                                            </span>

                                            <span
                                                className="action-link text-red"
                                                // Llama a la función de confirmación de activar/desactivar
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

                {/* ------------------------------ */}
                {/* 🔢 PAGINACIÓN */}
                {/* ------------------------------ */}
                {totalPaginas > 1 && (
                    <div className="d-flex justify-content-end mt-4 pt-2 border-top px-4">
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
                                        className={`page-item ${
                                            paginaActual === index + 1 ? "active" : ""
                                        }`}
                                    >
                                        <button
                                            className={`page-link border-0 ${paginaActual === index + 1 ? "bg-dark text-white rounded-circle mx-1" : "text-dark"}`}
                                            onClick={() => cambiarPagina(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                <li
                                    className={`page-item ${
                                        paginaActual === totalPaginas ? "disabled" : ""
                                    }`}
                                >
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
    );
};

export default EmpleadosTable;  