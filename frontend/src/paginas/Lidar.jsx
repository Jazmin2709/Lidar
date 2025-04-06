import React from 'react';
import beneficiosImagen from '/src/assets/img/Beneficios.jpg';
import herramientasImagen from '/src/assets/img/Herramientas.jpg';
import lidarImagen from '/src/assets/img/LIDAR.webp';
import topografiaImagen from '/src/assets/img/Topografia.jpg';
import cartografiaImagen from '/src/assets/img/Cartografia.jpg';

export default function Lidar() {
    return (
        <div className='container'>
            <h1 className='text-dark text-center col p-5 fw-bold fw-lighter'>PROYECTO LIDAR</h1>
            <div className='row row-cols-1 row-cols-md-2 align-items-center'>

                {/* Sección 1: ¿Qué es el proyecto LIDAR? */}
                <div className='col'>
                    <h1 className='text-center fw-lighter fw-bold'>¿Qué es el proyecto LIDAR?</h1>
                    <div className='border border-secondary rounded-4 p-3'>
                        <p className='text-dark fw-lighter'>
                            LIDAR (Light Detection and Ranging) es una tecnología de teledetección que utiliza pulsos láser para medir distancias y crear modelos 3D precisos del entorno.
                            Funciona emitiendo pulsos de luz láser hacia un objeto o superficie y midiendo el tiempo que tarda la luz en regresar al sensor.
                            Esta información, combinada con datos de posición y orientación, permite generar nubes de puntos densas que representan la forma y la estructura del terreno,
                            la vegetación, edificios y otros objetos.
                        </p>
                    </div>
                </div>
                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={lidarImagen} alt="Imagen de LIDAR" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>

                {/* Sección 2: Aplicaciones del Proyecto LIDAR */}
                <div className="col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}> {/* Cambios aquí */}
                    <img src={topografiaImagen} alt="Imagen de Topografía" className="img-fluid rounded" style={{ width: '300px', height: '200px', marginBottom: '10px' }} />
                    <img src={cartografiaImagen} alt="Imagen de Cartografía" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>
                <div className="col">
                    <h1 className="text-center fw-lighter fw-bold">Aplicaciones del Proyecto LIDAR de Global Solutions y Dynamics</h1>
                    <div className="border border-secondary rounded-4 p-3">
                        <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                            Topografía y cartografía:
                            <li>Generación de modelos digitales del terreno (MDT) y modelos digitales de superficie (MDS) de alta precisión.</li>
                            <li>Creación de mapas topográficos detallados para proyectos de ingeniería, construcción y planificación urbana.</li>
                            <li>Levantamiento de infraestructuras lineales como carreteras, ferrocarriles y líneas eléctricas.</li>
                        </p>
                        <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                            Gestión de recursos naturales:
                            <li>Monitoreo de la deforestación y la salud de los bosques.</li>
                            <li>Evaluación de riesgos de inundaciones y deslizamientos de tierra.</li>
                            <li>Modelado de la biomasa forestal y el almacenamiento de carbono.</li>
                        </p>
                        <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                            Agricultura de precisión:
                            <li>Análisis de la estructura de los cultivos y la variabilidad del terreno</li>
                            <li>Optimización del uso de fertilizantes y pesticidas.</li>
                            <li>Monitoreo del crecimiento de los cultivos y la detección de enfermedades.</li>
                        </p>
                        <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                            Inspección de infraestructuras:
                            <li>Evaluación del estado de puentes, presas y otras estructuras.</li>
                            <li>Detección de deformaciones y daños estructurales.</li>
                            <li>Generación de modelos 3D para la planificación de mantenimiento.</li>
                        </p>
                        <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                            Medio ambiente:
                            <li>Monitoreo de cambios medioambientales.</li>
                            <li>Apoyo a proyectos de gestión ambiental.</li>
                            <li>Medición y monitoreo de cambios en el medio ambiente.</li>
                        </p>
                    </div>
                </div>

                {/* Sección 3: Beneficios del uso de LIDAR */}
                <div className="col">
                    <h1 className="text-center fw-lighter fw-bold">Beneficios del uso de LIDAR</h1>
                    <div className="border border-secondary rounded-4 p-3">
                        <p className="text-dark fw-lighter">
                            <li>Alta precisión y densidad de datos.</li>
                            <li>Capacidad para penetrar la vegetación y obtener datos del terreno subyacente.</li>
                            <li>Rapidez y eficiencia en la captura de datos en grandes áreas.</li>
                            <li>Generación de modelos 3D detallados y precisos.</li>
                        </p>
                    </div>
                </div>
                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={beneficiosImagen} alt="Imagen de Beneficios" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>

                {/* Sección 4: Tecnología y software utilizados */}
                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={herramientasImagen} alt="Imagen de Herramientas" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>
                <div className="col">
                    <h1 className="text-center fw-lighter fw-bold">Tecnología y software utilizados:</h1>
                    <div className="border border-secondary rounded-4 p-3">
                        <p className="text-dark fw-lighter">
                            Global Solutions y Dynamics utiliza equipos LIDAR de última generación, tanto aéreos como terrestres, y software especializado para el procesamiento y análisis de los datos.
                            Esto incluye herramientas para la generación de nubes de puntos, la creación de MDT/MDS, la extracción de características y la visualización 3D.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}