import  React from 'react'


export default function BarraNavAdmin() {
    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-primary px-5">
                <div className="container-fluid">
                    <a className="navbar-brand fst-italic fw-bold" href="/">
                        OCA Global
                    </a>
                </div>
                <div className="dropdown">
                    <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className='bi bi-person'>Administrador</i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item fst-italic" href="/ajustes">Ajustes</a></li>
                        <li><a className="dropdown-item fst-italic" href="/dashboard">Reportes</a></li>
                        <li><a className="dropdown-item fst-italic" href="/">Cerrar Sesión</a></li>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
