// Importamos React para usar JSX
import React from 'react'
// Importamos la imagen del logo desde la carpeta de assets
import ocaImagen from '/src/assets/img/OCA.png';
// Importamos SweetAlert2 para mostrar alertas elegantes
import Swal from 'sweetalert2';

// Exportamos el componente funcional BarraNavEmpleado
export default function BarraNavEmpleado() {

    // Función para cerrar sesión
    const cerrarSesion = async () => {
        // Eliminamos el token del almacenamiento local
        localStorage.removeItem('token');
        // Mostramos alerta de cierre de sesión con SweetAlert
        Swal.fire({
            icon: 'success',
            title: 'Sesion cerrada',
            text: 'Sesion cerrada correctamente',
        }).then(() => {
            // Redirigimos al login después de cerrar la alerta
            window.location.href = '/login';
        })
    };

    return (
        <div>
            {/* Barra de navegación con estilo personalizado */}
            <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
                <div className="container-fluid">
                    {/* Enlace al inicio con el logo de la empresa */}
                    <a className="navbar-brand fst-italic fw-bold" href="/">
                        {/* Logo importado desde assets con tamaño personalizado */}
                        <img src={ocaImagen} alt="OCA" className="oca-logo" style={{ width: '100px', height: 'auto' }} />
                    </a>
                </div>

                {/* Menú desplegable para el usuario (Empleado) */}
                <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {/* Ícono de persona y texto del botón */}
                        <i className='bi bi-person'>Empleado</i>
                    </button>

                    {/* Opciones del dropdown */}
                    <ul className="dropdown-menu dropdown-menu-end">
                        {/* Enlace a ajustes */}
                        <li><a className="dropdown-item fst-italic" href="/ajustes">Ajustes</a></li>
                        {/* Enlace a reportes */}
                        <li><a className="dropdown-item fst-italic" href="/dashboard">Reportes</a></li>
                        {/* Botón para cerrar sesión que llama a la función cerrarSesion */}
                        <li><button className="dropdown-item fst-italic" onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
