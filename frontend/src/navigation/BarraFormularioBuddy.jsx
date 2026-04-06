// Ejemplo: src/components/nav/BarraFormularioBuddy.jsx
// o donde prefieras: navigationAdminInjsx/BarraFormularioBuddy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
const BarraFormularioBuddy = ({ partnerNumber = 1 }) => {
    // Enlaces generados dinámicamente según el número del buddy
    const enlaces = [
        { to: /buddy${partnerNumber}/opcion1, label: 'Opción 1' },
        { to: /buddy${partnerNumber}/opcion2, label: 'Opción 2' },
        { to: /buddy${partnerNumber}/opcion3, label: 'Opción 3' },
    ];
    return (
        <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#0d6efd' }}>
            <div className="container-fluid">
                {/* Logo texto */}
                <Link className="navbar-brand fst-italic fw-bold text-white" to="/">
                    OCA Global
                </Link>
                {/* Título dinámico */}
                <div className="text-white fw-bold ms-4" style={{ fontSize: '1.1rem' }}>
                    Buddy Partner {partnerNumber}
                </div>
                {/* Menú desplegable */}
                <div className="dropdown ms-auto">
                    <button
                        className="btn dropdown-toggle text-white"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="bi bi-gear me-1"></i> Convergencia
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        {enlaces.map((enlace, index) => (
                            <li key={index}>
                                <Link className="dropdown-item fst-italic" to={enlace.to}>
                                    {enlace.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};
export default BarraFormularioBuddy;