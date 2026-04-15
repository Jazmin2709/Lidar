// src/paginas/IndexEmpleado.jsx
import React, { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom';

import '../css/IndexE.css';  // Ya lo tenías, ahora lo optimizamos

export default function IndexEmpleado() {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let decoded;
        try {
            decoded = jwtDecode(token);
        } catch (e) {
            console.error("Error al decodificar token:", e);
            return;
        }

        const id_usuario = decoded.id;

        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        axios
            .get(`${API_URL}/buddy/pending/${id_usuario}`)
            .then((res) => {
                const pendientes = res.data;
                if (pendientes.length === 0) return;

                let detalleHTML = "<ul style='text-align:left; margin:0; padding-left:1.5rem;'>";
                pendientes.forEach((p) => {
                    detalleHTML += `
                        <li style="margin-bottom:0.8rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">
                            <span style="color:#1a3c6d; font-weight:bold;">Cuadrilla ${p.num_cuadrilla || '—'}</span><br/>
                            Buddy Partner ${p.Tipo} quedo en "<i>${p.Est_etapa}</i>"<br/>
                            <small style="color:#666">Fecha: ${moment(p.Fecha).format("DD/MM/YYYY")}</small>
                        </li>
                    `;
                });
                detalleHTML += "</ul>";

                Swal.fire({
                    icon: "warning",
                    title: "Tienes Buddy Partners pendientes",
                    html: `
                        <p>Las siguientes actividades quedaron sin finalizar:</p>
                        ${detalleHTML}
                        <p style="margin-top:1.5rem; font-weight:600; color:#e53e3e;">
                            Debes completarlas hoy.
                        </p>
                    `,
                    confirmButtonColor: "#3182ce",
                    confirmButtonText: "Entendido",
                });
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="index-empleado-page">
            <h1 className="page-title">Bienvenido al Panel de Empleado</h1>

            {/* Nueva sección de Asistencia y Cuadrilla */}
            <div className="asistencia-header-cards" style={{ display: 'flex', gap: '20px', marginBottom: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/asistencia" className="header-action-card" style={{ background: '#1a3c6d', color: 'white', padding: '20px', borderRadius: '15px', width: '280px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(26, 60, 109, 0.3)' }}>
                    <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>Registrar Asistencia</h3>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>Marca tu ingreso diario con foto y GPS para activar tu jornada.</p>
                </Link>
                <Link to="/mi-cuadrilla" className="header-action-card" style={{ background: '#fff', border: '2px solid #1a3c6d', color: '#1a3c6d', padding: '20px', borderRadius: '15px', width: '280px', textDecoration: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Mi Cuadrilla</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Consulta a qué equipo fuiste asignado hoy y quién es tu supervisor.</p>
                </Link>
            </div>

            <h1 className="page-title" style={{ fontSize: '1.5rem', marginTop: '20px' }}>Formularios Buddy Partner</h1>

            <div className="cards-container">
                {/* Buddy Partner 1 */}
                <div className="buddy-card">
                    <div className="card-content">
                        <div>
                            <h5 className="card-title">Buddy Partner 1</h5>
                            <p className="card-text">
                                Antes de salir de la empresa, se realiza un reporte sobre el estado de las herramientas, del vehículo y del bienestar emocional de los empleados.
                            </p>
                        </div>
                        <div className="text-center mt-3">
                            <Link to="/buddy/1" className="btn-ir">
                                Ir al formulario
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Buddy Partner 2 */}
                <div className="buddy-card">
                    <div className="card-content">
                        <div>
                            <h5 className="card-title">Buddy Partner 2</h5>
                            <p className="card-text">
                                Al llegar al lugar de trabajo, se verifica el estado de las herramientas, del vehículo y la condición física y emocional de los compañeros. Luego, se elabora el tablero operativo y se describe detalladamente el trabajo a realizar.
                            </p>
                        </div>
                        <div className="text-center mt-3">
                            <Link to="/buddy/2" className="btn-ir">
                                Ir al formulario
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Buddy Partner 3 */}
                <div className="buddy-card">
                    <div className="card-content">
                        <div>
                            <h5 className="card-title">Buddy Partner 3</h5>
                            <p className="card-text">
                                Al regresar a la empresa, se elabora el reporte diario del trabajo realizado, incluyendo el estado de las herramientas, del vehículo y el bienestar general de los empleados.
                            </p>
                        </div>
                        <div className="text-center mt-3">
                            <Link to="/buddy/3" className="btn-ir">
                                Ir al formulario
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}