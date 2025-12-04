// Importamos React para poder usar JSX
import React from "react";

// Importamos Link desde react-router-dom para navegación interna sin recargar la página
import { Link } from "react-router-dom";

// Importamos el logo de OCA desde la carpeta de imágenes
import ocaImagen from '/src/assets/img/OCA.png';

// Componente funcional que representa la barra de navegación de la página de inicio
function BarraNavInicio() {
  return (
    // Navbar con clases de Bootstrap y color de fondo personalizado
    <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
      <div className="container-fluid">
        {/* Logo que sirve como enlace a la ruta raíz (/) */}
        <Link to="/" className="navbar-brand fst-italic fw-bold">
          <img
            src={ocaImagen} // Imagen del logo importado
            alt="OCA"        // Texto alternativo para accesibilidad
            className="oca-logo"
            style={{ width: '100px', height: 'auto' }} // Tamaño del logo
          />
        </Link>

        {/* Contenedor alineado a la derecha con botones de navegación */}
        <div className="d-flex align-items-center ms-auto">
          {/* Botón que redirige a la sección LIDAR */}
          <Link to="/lidar" className="btn btn-light mx-2">
            Lidar
          </Link>

          {/* Botón que redirige a la sección de información de la empresa */}
          <Link to="/quienessomos" className="btn btn-light mx-2">
            Quienes Somos
          </Link>

          {/* Botón que redirige a registro */}
          <Link to="/registrar" className="btn btn-light mx-2">
            Registrar
          </Link>

          
          {/* Botón que redirige al login */}
          <Link to="/login" className="btn btn-light mx-2">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </nav>
  );
}

// Exportamos el componente para poder usarlo en otras partes de la aplicación
export default BarraNavInicio;
