// Importamos React desde la librería 'react'
import React from 'react';

// Componente funcional llamado IndexEmpleado
export default function IndexEmpleado() {
    return (
        // Contenedor principal con la clase Bootstrap 'container' para dar margen horizontal
        <div className='container'>

            {/* Encabezado centrado */}
            <div className="text-center">
                <h1>Formularios</h1>
            </div>

            {/* Fila que contiene las tarjetas, con separación vertical y columnas responsivas */}
            <div className="row my-5 row-cols-1 row-cols-md-3 g-4 align-items-stretch">

                {/* Primera tarjeta: Buddy Partner 1 */}
                <div className="col d-flex">
                    <div className="card h-100 w-100">
                        {/* Cuerpo de la tarjeta con disposición vertical y espaciado entre elementos */}
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                {/* Título centrado */}
                                <h5 className="card-title text-center">Buddy Partner 1</h5>
                                {/* Descripción del formulario */}
                                <p className="card-text">
                                    Antes de salir de la empresa, se realiza un reporte sobre el estado de las herramientas, del vehículo y del bienestar emocional de los empleados.
                                </p>
                            </div>
                            {/* Botón que redirige al formulario BuddyPartner1 */}
                            <div className="text-center mt-3">
                                <a href="/BuddyPartner1" className="btn btn-primary w-100">Ir</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segunda tarjeta: Buddy Partner 2 */}
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

                {/* Tercera tarjeta: Buddy Partner 3 */}
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

            </div> {/* Fin de la fila de tarjetas */}
        </div> // Fin del contenedor principal
    );
}
