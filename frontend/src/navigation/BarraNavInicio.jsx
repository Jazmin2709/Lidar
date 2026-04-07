// src/navigation/BarraNavInicio.jsx (o src/components/BarraNavInicio.jsx)
import React from 'react';
import ocaImagen from '/src/assets/img/OCA.png'; // ← tu logo importado


export default function BarraNavInicio({
  scrollTo,
  misionRef,
  quienesRef,
  visionRef,
  lidarRef,
  aplicacionesRef,
  beneficiosRef,
  tecnologiaRef,
}) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand fst-italic fw-bold" href="/">
          <img src={ocaImagen} alt="OCA" className="oca-logo" style={{ width: '100px', height: 'auto' }} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(misionRef)}>
                Misión
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(quienesRef)}>
                ¿Quiénes Somos?
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(visionRef)}>
                Visión
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(lidarRef)}>
                ¿Qué es LIDAR?
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(aplicacionesRef)}>
                Aplicaciones
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(beneficiosRef)}>
                Beneficios
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white fw-bold" onClick={() => scrollTo(tecnologiaRef)}>
                Tecnología
              </button>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-2 ms-lg-3 mt-3 mt-lg-0">
            <button
              type="button"
              className="btn btn-outline-light fw-semibold px-4 py-2 w-100 w-lg-auto"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              className="btn btn-light fw-semibold px-4 py-2 w-100 w-lg-auto"
              data-bs-toggle="modal"
              data-bs-target="#registerModal"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}