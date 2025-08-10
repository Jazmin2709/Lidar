// Importamos React para utilizar JSX
import React from 'react'

// Importamos la imagen del logo de OCA desde la carpeta de assets
import ocaImagen from '/src/assets/img/OCA.png';

// Importamos SweetAlert2 para mostrar alertas visuales al cerrar sesión
import Swal from 'sweetalert2';

// Importamos Link desde react-router-dom para navegación sin recarga de página
import { Link } from 'react-router-dom';


// Componente funcional que representa la barra de navegación del supervisor
export default function BarraNavSupervisor() {

    // Función para cerrar sesión del usuario
    const cerrarSesion = async () => {
        // Eliminamos el token del localStorage
        localStorage.removeItem('token');

        // Mostramos una alerta de cierre de sesión exitoso
        Swal.fire({
            icon: 'success',
            title: 'Sesion cerrada',
            text: 'Sesion cerrada correctamente',
        }).then(() => {
            // Redireccionamos al login
            window.location.href = '/login';
        })
    };

    return (
        <div>
            {/* Navbar de Bootstrap con color azul personalizado */}
            <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
                <div className="container-fluid">
                    {/* Logo de OCA que redirige al inicio */}
                    <a className="navbar-brand fst-italic fw-bold" href="/">
                        <img
                            src={ocaImagen}  // Imagen del logo
                            alt="OCA"         // Texto alternativo para accesibilidad
                            className="oca-logo"
                            style={{ width: '100px', height: 'auto' }} // Tamaño del logo
                        />
                    </a>
                </div>

                {/* Menú desplegable de usuario (Supervisor) */}
                <div className="dropdown">
                    <button
                        className="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className='bi bi-person'>Supervisor</i>
                    </button>

                    {/* Opciones del menú del supervisor */}
                    <ul className="dropdown-menu dropdown-menu-end">
                        {/* Enlace al dashboard del supervisor */}
                        <li>
                            <Link className="dropdown-item fst-italic" to="/supervisor/dashboard">
                                Dashboard
                            </Link>
                        </li>

                        {/* Enlace a la sección de reportes */}
                        <li>
                            <Link className="dropdown-item fst-italic" to="/supervisor/reportes">
                                Reportes
                            </Link>
                        </li>

                        {/* Botón para cerrar sesión */}
                        <li>
                            <button className="dropdown-item fst-italic" onClick={cerrarSesion}>
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
