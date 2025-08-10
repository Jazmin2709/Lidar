// Importamos React para usar JSX
import React from "react";
// Importamos Link desde react-router-dom para navegación interna sin recargar la página
import { Link } from "react-router-dom";

// Componente funcional que representa la barra de navegación para el Buddy Partner 1
function BarraNavBuddy1() {
  return (
    <div>
      {/* Barra de navegación principal con padding horizontal y color de fondo azul */}
      <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
        <div className="container-fluid">
          {/* Enlace al inicio con el nombre de la empresa */}
          <Link className="navbar-brand fst-italic fw-bold" to="/">
            OCA Global
          </Link>

          {/* Título o etiqueta del módulo actual */}
          <div
            className="buddy-title"
            style={{ color: "white", marginLeft: "20px" }}
          >
            Buddy Partner 1
          </div>
        </div>

        {/* Menú desplegable en la parte derecha de la barra */}
        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {/* Ícono de engranaje seguido de texto */}
            <i className="bi bi-gear"></i> Convergencia
          </button>

          {/* Lista de opciones dentro del dropdown */}
          <ul className="dropdown-menu dropdown-menu-end">
            {/* Cada opción navega a una ruta específica usando Link */}
            <li>
              <Link className="dropdown-item fst-italic" to="/buddy1/opcion1">
                Opción 1
              </Link>
            </li>
            <li>
              <Link className="dropdown-item fst-italic" to="/buddy1/opcion2">
                Opción 2
              </Link>
            </li>
            <li>
              <Link className="dropdown-item fst-italic" to="/buddy1/opcion3">
                Opción 3
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

// Exportamos el componente para poder utilizarlo en otras partes de la aplicación
export default BarraNavBuddy1;
