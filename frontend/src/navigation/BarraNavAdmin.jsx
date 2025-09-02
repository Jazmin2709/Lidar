import React from 'react'
import ocaImagen from '/src/assets/img/OCA.png';
import Swal from 'sweetalert2';


export default function BarraNavAdmin() {

    const cerrarSesion = async () => {
        localStorage.removeItem('token');
        Swal.fire({
            icon: 'success',
            title: 'Sesion cerrada',
            text: 'Sesion cerrada correctamente',
        }).then(() => {
            window.location.href = '/login';
        })
    };
    
    return (
        <div>
            <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
                <div className="container-fluid">
                    <a className="navbar-brand fst-italic fw-bold" href="/">
                        <img src={ocaImagen} alt="OCA" className="oca-logo" style={{ width: '100px', height: 'auto' }} />
                    </a>
                </div>
                <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className='bi bi-person'>Administrador</i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
<<<<<<< Updated upstream
                        <li><a className="dropdown-item fst-italic" href="/ajustes">Ajustes</a></li>
                        <li><a className="dropdown-item fst-italic" href="/dashboard">Reportes</a></li>
=======
                        {/* Enlace al dashboard del administrador */}
                        <li><a className="dropdown-item fst-italic" href="/admin/dashboard/">Dashboard</a></li>
                        {/* Enlace a la sección de reportes */}
                        <li><a className="dropdown-item fst-italic" href="/admin/reportes/">Reportes</a></li>
                        {/* Enlace a la gestión de empleados */}
                        <li><a className="dropdown-item fst-italic" href="/admin/empleados/">Empleados</a></li>
                        {/* Botón para cerrar sesión */}
>>>>>>> Stashed changes
                        <li><button className="dropdown-item fst-italic" onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
