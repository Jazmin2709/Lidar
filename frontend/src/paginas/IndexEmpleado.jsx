// Importamos React desde la librería 'react'
import React, { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

export default function IndexEmpleado() {

    // -------------------------
    // 🔥 ALERTA DE BUDDYS PENDIENTES
    // -------------------------
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

        axios
            .get(`http://localhost:3000/BuddyPartner/pending/${id_usuario}`)
            .then((res) => {
                const pendientes = res.data;

                if (pendientes.length === 0) return;

                let detalleHTML = "<ul style='text-align:left'>";
                pendientes.forEach((p) => {
                    detalleHTML += `
                        <li>
                            <b>Buddy ${p.Tipo}</b> quedó en 
                            <b>${p.Est_etapa}</b> el día 
                            <b>${moment(p.Fecha).format("DD/MM/YYYY")}</b>
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
                        <p><b>Debes completarlas hoy para continuar.</b></p>
                    `,
                    confirmButtonColor: "#3085d6",
                });
            })
            .catch((err) => console.log(err));
    }, []);


    // -------------------------
    // 🖼️ TU DISEÑO ORIGINAL
    // -------------------------
    return (
        <div className='container'>

            <div className="text-center">
                <h1>Formularios</h1>
            </div>

            <div className="row my-5 row-cols-1 row-cols-md-3 g-4 align-items-stretch">

                {/* Tarjeta Buddy Partner 1 */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="card-title text-center">Buddy Partner 1</h5>
                                <p className="card-text">
                                    Antes de salir de la empresa, se realiza un reporte sobre el estado de las herramientas, del vehículo y del bienestar emocional de los empleados.
                                </p>
                            </div>
                            <div className="text-center mt-3">
                                <a href="/BuddyPartner1" className="btn btn-primary w-100">Ir</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Buddy Partner 2 */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="card-title text-center">Buddy Partner 2</h5>
                                <p className="card-text">
                                    Al llegar al lugar de trabajo, se verifica el estado de las herramientas, del vehículo y la condición física y emocional de los compañeros.
                                    Luego, se elabora el tablero operativo y se describe detalladamente el trabajo a realizar.
                                </p>
                            </div>
                            <div className="text-center mt-3">
                                <a href="/BuddyPartner2" className="btn btn-primary w-100">Ir</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Buddy Partner 3 */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h5 className="card-title text-center">Buddy Partner 3</h5>
                                <p className="card-text">
                                    Al regresar a la empresa, se elabora el reporte diario del trabajo realizado, incluyendo el estado de las herramientas, del vehículo y el bienestar general de los empleados.
                                </p>
                            </div>
                            <div className="text-center mt-3">
                                <a href="/BuddyPartner3" className="btn btn-primary w-100">Ir</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
