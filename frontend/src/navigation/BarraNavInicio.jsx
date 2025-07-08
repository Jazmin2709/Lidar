import React from "react";
import { Link } from "react-router-dom";
import ocaImagen from '/src/assets/img/OCA.png';

function BarraNavInicio() {
  return (
    <nav className="navbar navbar-expand-lg px-5" style={{ backgroundColor: '#3483cd' }}>
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fst-italic fw-bold">
          <img src={ocaImagen} alt="OCA" className="oca-logo" style={{ width: '100px', height: 'auto' }} />
        </Link>
        <div className="d-flex align-items-center ms-auto">
          <Link to="/lidar" className="btn btn-light mx-2">
            LIDAR
          </Link>
          <Link to="/quienessomos" className="btn btn-light mx-2">
            QUIENES SOMOS
          </Link>
          <Link to="/login" className="btn btn-light mx-2">
            INICIAR SESIÓN
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default BarraNavInicio;