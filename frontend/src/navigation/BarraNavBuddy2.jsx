
import React from "react";
import { Link } from "react-router-dom";

function BarraNavBuddy2() {
return (
    <div>
        <nav className="navbar navbar-expand-lg bg-primary px-5">
            <div className="container-fluid">
            <Link className="navbar-brand fst-italic fw-bold" to="/">
                OCA Global
            </Link>
            <div
                className="buddy-title"
                style={{ color: "white", marginLeft: "20px" }}
            >
                Buddy Partner 2
            </div>
            </div>
            <div className="dropdown">
            <button
                className="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bi bi-gear"></i> Convergencia
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                <Link className="dropdown-item fst-italic" to="/buddy2/opcion1">
                    Opción 1
                </Link>
                </li>
                <li>
                <Link className="dropdown-item fst-italic" to="/buddy2/opcion2">
                    Opción 2
                </Link>
                </li>
                <li>
                <Link className="dropdown-item fst-italic" to="/buddy2/opcion3">
                    Opción 3
                </Link>
                </li>
            </ul>
            </div>
        </nav>
    </div>
);
}

export default BarraNavBuddy2;
