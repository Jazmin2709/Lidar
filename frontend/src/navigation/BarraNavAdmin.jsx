// Importamos React para poder usar JSX
import React from 'react'

// Importamos la imagen del logo de OCA
import ocaImagen from '/src/assets/img/OCA.png';

// Importamos SweetAlert2 para mostrar alertas estilizadas
import Swal from 'sweetalert2';

// Componente funcional que representa la barra de navegación del administrador
export default function BarraNavAdmin() {

    // Función para cerrar sesión
    const cerrarSesion = async () => {
        // Eliminamos el token del almacenamiento local
        localStorage.removeItem('token');

        // Mostramos una alerta indicando que se cerró sesión exitosamente
        Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Sesión cerrada correctamente',
        }).then(() => {
            // Redirigimos al usuario a la página de login
            window.location.href = '/login';
        })
    };

    return (
        <div>
            {/* Barra de navegación principal */}
            <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
                <div className="container-fluid">
                    {/* Logo de la empresa con enlace a la página principal */}
                    <a className="navbar-brand fst-italic fw-bold" href="/">
                        <img src={ocaImagen} alt="OCA" className="oca-logo" style={{ width: '100px', height: 'auto' }} />
                    </a>
                </div>

                {/* Menú desplegable para el administrador */}
                <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {/* Ícono de usuario y texto 'Administrador' */}
                        <i className='bi bi-person'>Administrador</i>
                    </button>

                    {/* Opciones del menú desplegable */}
                    <ul className="dropdown-menu dropdown-menu-end">
                        {/* Enlace al dashboard del administrador */}
                        <li><a className="dropdown-item fst-italic" href="/admin/dashboard/">Dashboard</a></li>
                        {/* Enlace a la sección de reportes */}
                        <li><a className="dropdown-item fst-italic" href="/admin/reportes/">Reportes</a></li>
                        {/* Enlace al formulario de registro */}
                        <li><a className="dropdown-item fst-italic" href="/admin/registrar/">Registrar</a></li>
                        {/* Botón para cerrar sesión */}
                        <li><button className="dropdown-item fst-italic" onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
