// navigationAdminInjsx/BarraBase.jsx
import React from 'react';
import Swal from 'sweetalert2';
import ocaImagen from '/src/assets/img/OCA.png';

const BarraBase = ({ titulo = 'LIDAR', enlaces = [] }) => {
    const nombreUsuario = localStorage.getItem('userName') || 'Usuario';
    const rol = localStorage.getItem('userRol') || 'Usuario';

    const cerrarSesion = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRol');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');

        await Swal.fire({
            icon: 'success',
            title: 'Sesión cerrada',
            text: 'Sesión cerrada correctamente',
            timer: 1500,
            showConfirmButton: false,
        });

        window.location.href = '/?open=login';
    };

    return (
        <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#0d6efd' }}>
            <div className="container-fluid">
                {/* Logo */}
                <a className="navbar-brand fst-italic fw-bold" href="/">
                    <img src={ocaImagen} alt="OCA" className="oca-logo" style={{ width: '100px', height: 'auto' }} />
                </a>

                {/* Título opcional */}
                <span className="navbar-text fst-italic fw-bold ms-3 text-white">
                    {titulo}
                </span>

                {/* Dropdown de usuario */}
                <div className="dropdown ms-auto">
                    <button
                        className="btn dropdown-toggle text-white d-flex align-items-center gap-2 border-0 bg-transparent p-0"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-person"></i>
                        <span>{nombreUsuario}</span>
                        <span className="small opacity-75">({rol})</span>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                        {enlaces.map((enlace, index) => (
                            <li key={index}>
                                <a className="dropdown-item fst-italic" href={enlace.href}>
                                    {enlace.label}
                                </a>
                            </li>
                        ))}
                        <li>
                            <button className="dropdown-item fst-italic" onClick={cerrarSesion}>
                                Cerrar Sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default BarraBase;