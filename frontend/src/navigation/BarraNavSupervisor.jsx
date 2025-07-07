import React from 'react'
import ocaImagen from '/src/assets/img/OCA.png';
import Swal from 'sweetalert2'; 
import { Link } from 'react-router-dom';


export default function BarraNavSupervisor() {

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
                        <i className='bi bi-person'>Supervisor</i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><Link className="dropdown-item fst-italic" to="/supervisor/dashboard">Dashboard</Link></li>
                        <li><Link className="dropdown-item fst-italic" to="/supervisor/reportes">Reportes</Link></li>
                        <li><button className="dropdown-item fst-italic" onClick={cerrarSesion}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
