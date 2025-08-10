// Importamos React para poder usar JSX
import React from "react";
// Importamos Link de react-router-dom para navegación sin recargar la página
import { Link } from "react-router-dom";

// Declaramos el componente funcional BarraNavBuddy3
function BarraNavBuddy3() {
    return (
        <div>
            {/* Barra de navegación con clases de Bootstrap y estilo personalizado */}
            <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
                <div className="container-fluid">
                    {/* Logo o nombre de la marca que redirige al inicio */}
                    <Link className="navbar-brand fst-italic fw-bold" to="/">
                        OCA Global
                    </Link>

                    {/* Título del módulo correspondiente al Buddy Partner 3 */}
                    <div
                        className="buddy-title"
                        style={{ color: "white", marginLeft: "20px" }}
                    >
                        Buddy Partner 3
                    </div>
                </div>

                {/* Menú desplegable al lado derecho para opciones de navegación */}
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

                    {/* Lista de opciones dentro del dropdown */}
                    <ul className="dropdown-menu dropdown-menu-end">
                        {/* Opción 1 del Buddy 3 */}
                        <li>
                            <Link className="dropdown-item fst-italic" to="/buddy3/opcion1">
                                Opción 1
                            </Link>
                        </li>

                        {/* Opción 2 del Buddy 3 */}
                        <li>
                            <Link className="dropdown-item fst-italic" to="/buddy3/opcion2">
                                Opción 2
                            </Link>
                        </li>

                        {/* Opción 3 del Buddy 3 */}
                        <li>
                            <Link className="dropdown-item fst-italic" to="/buddy3/opcion3">
                                Opción 3
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}

// Exportamos el componente para que pueda ser utilizado en otros archivos
export default BarraNavBuddy3;
