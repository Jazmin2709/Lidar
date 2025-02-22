
import React from "react";
import { Link } from "react-router-dom";

function BarraNavInicio() {
  return (
    <nav className="navbar navbar-expand-lg bg-primary px-5">
      <div className="container-fluid">
        <Link className="navbar-brand fst-italic fw-bold" to="/">
          <img
            src="/logo.png"
            alt="OCA Global Logo"
            style={{ height: "30px" }}
          />
        </Link>
        <div className="d-flex align-items-center ms-auto">
          <Link to="/lidar" className="btn btn-light mx-2">
            LIDAR
          </Link>
          <Link to="/quienes-somos" className="btn btn-light mx-2">
            QUIENES SOMOS
          </Link>
          <Link to="/Registrar" className="btn btn-light mx-2">
            REGISTRARSE
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
