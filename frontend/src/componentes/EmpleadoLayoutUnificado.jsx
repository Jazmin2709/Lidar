// 📁 EmpleadoLayoutUnificado.jsx - Layout completo para empleados
import React, { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

// ------------------------------------------------------------
// 🎯 COMPONENTE DE LAYOUT PARA EMPLEADOS
// ------------------------------------------------------------
const EmpleadoLayoutUnificado = () => {
  const location = useLocation();
  
  // ------------------------------------------------------------
  // 🔥 EFECTO PARA ALERTAS DE BUDDYS PENDIENTES
  // ------------------------------------------------------------
  useEffect(() => {
    // Solo ejecutar en la página principal de empleados
    if (!location.pathname.includes("IndexEmpleado")) return;
    
    const verificarPendientes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const API_URL = process.env.API_URL || "https://lidar-cush.onrender.com/api";
        const response = await axios.get(`${API_URL}/buddy/pending/${decoded.id}`);
        const pendientes = response.data;

        if (pendientes.length === 0) return;

        let detalleHTML = "<ul style='text-align:left'>";
        pendientes.forEach((p) => {
          detalleHTML += `
            <li>
              <b>Buddy ${p.tipo}</b> quedó en 
              <b>${p.estado}</b> el día 
              <b>${moment(p.fecha).format("DD/MM/YYYY")}</b>
            </li>
          `;
        });
        detalleHTML += "</ul>";

        Swal.fire({
          icon: "warning",
          title: "Tienes Buddy Partners pendientes",
          html: `
            <p>Las siguientes actividades quedaron sin finalizar:</p>
            ${detalleHTML}
            <p><b>Debes completarlas hoy para continuar.</b></p>
          `,
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        console.error("Error verificando pendientes:", error);
      }
    };

    verificarPendientes();
  }, [location.pathname]);

  // ------------------------------------------------------------
  // 🎨 COMPONENTE DE PÁGINA PRINCIPAL DE EMPLEADOS
  // ------------------------------------------------------------
  const PaginaPrincipalEmpleado = () => (
    <div className="container d-flex flex-column justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">Panel de Empleado</h1>
        <p className="lead text-muted">Selecciona el formulario que necesitas completar</p>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
        {/* Tarjeta Buddy 1 */}
        <div className="col">
          <div className="card h-100 border-primary border-2 shadow-sm">
            <div className="card-body d-flex flex-column">
              <div className="text-center mb-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3">
                  <span className="display-6">1️⃣</span>
                </div>
              </div>
              <h5 className="card-title text-center text-primary">Buddy Partner 1</h5>
              <p className="card-text flex-grow-1">
                <strong>Antes de salir:</strong> Verificación del estado de herramientas, vehículo y bienestar emocional del equipo.
              </p>
              <div className="mt-auto">
                <Link to="/BuddyPartner1" className="btn btn-primary w-100">
                  <i className="bi bi-play-circle me-2"></i>Comenzar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta Buddy 2 */}
        <div className="col">
          <div className="card h-100 border-success border-2 shadow-sm">
            <div className="card-body d-flex flex-column">
              <div className="text-center mb-3">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex p-3">
                  <span className="display-6">2️⃣</span>
                </div>
              </div>
              <h5 className="card-title text-center text-success">Buddy Partner 2</h5>
              <p className="card-text flex-grow-1">
                <strong>Al llegar al trabajo:</strong> Verificación completa y planificación del tablero operativo.
              </p>
              <div className="mt-auto">
                <Link to="/BuddyPartner2" className="btn btn-success w-100">
                  <i className="bi bi-clipboard-check me-2"></i>Comenzar
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta Buddy 3 */}
        <div className="col">
          <div className="card h-100 border-warning border-2 shadow-sm">
            <div className="card-body d-flex flex-column">
              <div className="text-center mb-3">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex p-3">
                  <span className="display-6">3️⃣</span>
                </div>
              </div>
              <h5 className="card-title text-center text-warning">Buddy Partner 3</h5>
              <p className="card-text flex-grow-1">
                <strong>Al regresar:</strong> Reporte diario final con estado de herramientas, vehículo y equipo.
              </p>
              <div className="mt-auto">
                <Link to="/BuddyPartner3" className="btn btn-warning w-100">
                  <i className="bi bi-flag-fill me-2"></i>Comenzar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">📋 Información importante</h5>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                  Completa los Buddy Partners en orden secuencial
                </li>
                <li className="list-group-item">
                  <i className="bi bi-clock-history text-info me-2"></i>
                  Los reportes pendientes se muestran automáticamente
                </li>
                <li className="list-group-item">
                  <i className="bi bi-camera-fill text-success me-2"></i>
                  Asegúrate de tomar fotos claras cuando sea necesario
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ------------------------------------------------------------
  // 🎨 BARRA DE NAVEGACIÓN PARA EMPLEADOS
  // ------------------------------------------------------------
  const BarraNavEmpleado = () => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/IndexEmpleado">
          <i className="bi bi-shield-check me-2"></i>LIDAR - Empleado
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarEmpleado">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarEmpleado">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/IndexEmpleado' ? 'active' : ''}`} to="/IndexEmpleado">
                <i className="bi bi-house-door me-1"></i>Inicio
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="buddyDropdown" role="button" data-bs-toggle="dropdown">
                <i className="bi bi-clipboard-data me-1"></i>Buddy Partners
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/BuddyPartner1">
                    <span className="badge bg-primary me-2">1</span>Buddy Partner 1
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/BuddyPartner2">
                    <span className="badge bg-success me-2">2</span>Buddy Partner 2
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/BuddyPartner3">
                    <span className="badge bg-warning me-2">3</span>Buddy Partner 3
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Registrar">
                <i className="bi bi-person-plus me-1"></i>Registrar
              </Link>
            </li>
          </ul>
          
          <div className="d-flex">
            <button 
              className="btn btn-outline-light me-2"
              onClick={() => {
                Swal.fire({
                  title: '¿Cerrar sesión?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, salir',
                  cancelButtonText: 'Cancelar'
                }).then((result) => {
                  if (result.isConfirmed) {
                    localStorage.removeItem('token');
                    window.location.href = '/Login';
                  }
                });
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i>Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  // ------------------------------------------------------------
  // 🎨 FOOTER
  // ------------------------------------------------------------
  const Footer = () => (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Sistema LIDAR</h5>
            <p>Sistema de gestión de reportes de seguridad Buddy Partner</p>
          </div>
          <div className="col-md-6 text-end">
            <p className="mb-0">
              <i className="bi bi-shield-check me-2"></i>
              Seguridad primero - Reporta siempre
            </p>
            <small>© {new Date().getFullYear()} Todos los derechos reservados</small>
          </div>
        </div>
      </div>
    </footer>
  );

  // ------------------------------------------------------------
  // 🎨 RENDER PRINCIPAL
  // ------------------------------------------------------------
  return (
    <div className="d-flex flex-column min-vh-100">
      <BarraNavEmpleado />
      
      <main className="flex-grow-1">
        {/* Renderizar página principal o contenido según ruta */}
        {location.pathname === '/IndexEmpleado' || location.pathname === '/' ? (
          <PaginaPrincipalEmpleado />
        ) : (
          <div className="container mt-4">
            <Outlet />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default EmpleadoLayoutUnificado;