import React from 'react'


export default function BarraNav() {
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-primary px-5">
        <div class="container-fluid">
          <a class="navbar-brand fst-italic fw-bold" href="/">
            OCA Global
          </a>
        </div>
        <div class="dropdown">
          <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className='bi bi-person'>Administrador</i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item fst-italic" href="/ajustes">Ajustes</a></li>
            <li><a class="dropdown-item fst-italic" href="/dashboard">Reportes</a></li>
            <li><a class="dropdown-item fst-italic" href="/">Cerrar Sesión</a></li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
  