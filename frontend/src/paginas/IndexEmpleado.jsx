// -----------------------------------------------------------------------------
// COMPONENTE: IndexEmpleado
// Descripción: Muestra la lista de formularios 'Buddy Partner' y una alerta
//              inicial si existen tareas pendientes.
// -----------------------------------------------------------------------------

import React, { useEffect } from "react"; // Importa React y el hook useEffect para manejar efectos secundarios.
import axios from "axios"; // Importa axios para realizar peticiones HTTP.
import Swal from "sweetalert2"; // Importa SweetAlert2 para mostrar alertas modernas.
import moment from "moment"; // Importa moment para formatear fechas.
import { jwtDecode } from "jwt-decode"; // Importa jwtDecode para decodificar el token de autenticación.

export default function IndexEmpleado() {

    // ---------------------------------------------------
    // 🔥 Efecto de Carga: Alerta de Buddys Pendientes
    // Se ejecuta una sola vez al montar el componente.
    // ---------------------------------------------------
    useEffect(() => {
        // Obtener el token de localStorage. Si no existe, la función termina.
        const token = localStorage.getItem("token");
        if (!token) return;

        let decoded;
        try {
            // Decodificar el token para obtener el ID del usuario.
            decoded = jwtDecode(token);
        } catch (e) {
            console.error("Error al decodificar token:", e);
            return;
        }

        const id_usuario = decoded.id; // Asignación del ID del usuario decodificado.

        // Petición al backend para obtener las actividades pendientes del usuario.
        axios
            .get(`http://localhost:3000/BuddyPartner/pending/${id_usuario}`)
            .then((res) => {
                const pendientes = res.data;

                // Si no hay tareas pendientes, no hacer nada.
                if (pendientes.length === 0) return;

                // Construcción dinámica del HTML para el detalle de la alerta.
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

                // Mostrar la alerta SweetAlert2 si hay tareas pendientes.
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
            // Manejo de errores en la petición.
            .catch((err) => console.log(err));
    }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez al montar.


    // ---------------------------------------------------
    // 🖼️ Renderizado del Componente
    // Se utiliza Bootstrap para el diseño y centrado.
    // ---------------------------------------------------
    return (
        // Contenedor principal: Centrado vertical (minHeight: 80vh) y horizontal (d-flex, justify-content-center).
        <div 
            className='container d-flex flex-column justify-content-center' 
            style={{ minHeight: '80vh' }}
        >

            {/* Título principal de la sección */}
            <div className="text-center">
                <h1>Formularios</h1>
            </div>

            {/* Fila de tarjetas: Centrado horizontal (justify-content-center) y responsive (row-cols-md-3). */}
            <div className="row my-5 row-cols-1 row-cols-md-3 g-4 align-items-stretch justify-content-center">

                {/* --- Tarjeta Buddy Partner 1 --- */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            {/* Contenido superior de la tarjeta */}
                            <div>
                                <h5 className="card-title text-center">Buddy Partner 1</h5>
                                <p className="card-text">
                                    Antes de salir de la empresa, se realiza un reporte sobre el estado de las herramientas, del vehículo y del bienestar emocional de los empleados.
                                </p>
                            </div>
                            {/* Botón de acción: Alineado en la parte inferior */}
                            <div className="text-center mt-3">
                                <a href="/BuddyPartner1" className="btn btn-primary w-100">Ir</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Tarjeta Buddy Partner 2 --- */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            {/* Contenido superior de la tarjeta */}
                            <div>
                                <h5 className="card-title text-center">Buddy Partner 2</h5>
                                <p className="card-text">
                                    Al llegar al lugar de trabajo, se verifica el estado de las herramientas, del vehículo y la condición física y emocional de los compañeros.
                                    Luego, se elabora el tablero operativo y se describe detalladamente el trabajo a realizar.
                                </p>
                            </div>
                            {/* Botón de acción: Alineado en la parte inferior */}
                            <div className="text-center mt-3">
                                <a href="/BuddyPartner2" className="btn btn-primary w-100">Ir</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Tarjeta Buddy Partner 3 --- */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            {/* Contenido superior de la tarjeta */}
                            <div>
                                <h5 className="card-title text-center">Buddy Partner 3</h5>
                                <p className="card-text">
                                    Al regresar a la empresa, se elabora el reporte diario del trabajo realizado, incluyendo el estado de las herramientas, del vehículo y el bienestar general de los empleados.
                                </p>
                            </div>
                            {/* Botón de acción: Alineado en la parte inferior */}
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