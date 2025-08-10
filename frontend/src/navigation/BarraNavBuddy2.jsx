// Importamos React para usar JSX
import React from "react";
// Importamos Link desde react-router-dom para navegar entre rutas sin recargar la página
import { Link } from "react-router-dom";

// Componente funcional para la barra de navegación del Buddy Partner 2
function BarraNavBuddy2() {
    return (
        <div>
            {/* Barra de navegación con padding horizontal y color azul de fondo */}
            <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
                <div className="container-fluid">
                    {/* Enlace a la página principal con estilo en cursiva y negrita */}
                    <Link className="navbar-brand fst-italic fw-bold" to="/">
                        OCA Global
                    </Link>

                    {/* Título que identifica al módulo Buddy Partner 2 */}
                    <div
                        className="buddy-title"
                        style={{ color: "white", marginLeft: "20px" }}
                    >
                        Buddy Partner 2
                    </div>
                </div>

                {/* Menú desplegable ubicado a la derecha con opciones de navegación */}
                <div className="dropdown">
                    <button
                        className="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {/* Ícono de engranaje y texto del botón */}
                        <i className="bi bi-gear"></i> Convergencia
                    </button>

                    {/* Lista de opciones del menú desplegable */}
                    <ul className="dropdown-menu dropdown-menu-end">
                        {/* Cada opción redirige a una ruta específica usando Link */}
                        <li>
                            <Link className="dropdown-item fst-italic" to="/buddy2/opcion1">
                                Opción 1
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item fst-italic" to="/buddy2/opcion2">
                                Opción 2
                            </Link>
                        </li>
                        <li>
                            <Link className="dropdown-item fst-italic" to="/buddy2/opcion3">
                                Opción 3
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

// Exportamos el componente para poder usarlo en otros archivos del proyecto
export default BarraNavBuddy2;
