// Importa React para poder usar JSX
import React from 'react';

// Importa imágenes utilizadas en la página desde la carpeta assets
import imagesImagen from '../assets/img/images.png';
import inspeccionImagen from '../assets/img/inspeccion.png';
import certificacionImagen from '../assets/img/certificacion.jpg';
import comunicacionesImagen from '../assets/img/comunicaciones.jpg';

// Componente funcional que representa la página "¿Quiénes Somos?"
export default function QuienesSomos() {
    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-dark text-center fw-bold p-4'>¿Quiénes Somos?</h1>

            <div className='row row-cols-1 row-cols-md-2 g-4 align-items-center'>

                {/* Descripción */}
                <div className='col'>
                    <h2 className='text-center fw-bold'>¿Qué es Oca Global Solutions & Dynamics?</h2>
                    <div className='border border-secondary rounded-4 p-3'>
                        <p className='text-dark fw-light'>
                            OCA Global es una empresa multinacional que ofrece una amplia gama de servicios en los ámbitos de inspección,
                            certificación, ensayos, formación y consultoría. Su objetivo principal es aumentar el valor económico de los activos,
                            proyectos, productos y sistemas de sus clientes, reduciendo riesgos y garantizando el cumplimiento de los estándares
                            de calidad y seguridad.
                        </p>
                    </div>
                </div>

                {/* Imagen principal */}
                <div className='col d-flex justify-content-center'>
                    <img src={imagesImagen} alt='OCA' className='img-fluid rounded' style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>

                {/* Imágenes de inspección y certificación */}
                <div className='col d-flex flex-column align-items-center'>
                    <img src={inspeccionImagen} alt='inspeccion' className='img-fluid rounded mb-2' style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }} />
                    <img src={certificacionImagen} alt='certificacion' className='img-fluid rounded' style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>

                {/* Servicios */}
                <div className='col'>
                    <h2 className='text-center fw-bold'>Servicios que ofrece OCA</h2>
                    <div className='border border-secondary rounded-4 p-3'>
                        <ul className='text-dark fw-light'>
                            <p className='fw-bold'>Servicios de inspección:</p>
                            <li>Inspección reglamentaria.</li>
                            <li>Control de calidad y asistencia técnica.</li>
                            <li>Inspecciones marítimas y de materias primas.</li>

                            <p className='fw-bold mt-3'>Certificación:</p>
                            <li>Certificación de sistemas de gestión (ISO).</li>
                            <li>Certificación de productos.</li>

                            <p className='fw-bold mt-3'>Ensayos:</p>
                            <li>Ensayos de materiales.</li>
                            <li>Ensayos ambientales.</li>

                            <p className='fw-bold mt-3'>Formación:</p>
                            <li>Programas de formación en áreas técnicas y de gestión.</li>

                            <p className='fw-bold mt-3'>Consultoría:</p>
                            <li>Asesoramiento en ingeniería y construcción.</li>
                            <li>Gestión de riesgos.</li>
                        </ul>
                    </div>
                </div>

                {/* Sectores */}
                <div className='col mb-4'>
                    <h2 className='text-center fw-bold'>Sectores de Actividad</h2>
                    <div className='border border-secondary rounded-4 p-3'>
                        <ul className='text-dark fw-light'>
                            <li>Infraestructuras</li>
                            <li>Telecomunicaciones</li>
                            <li>Energía</li>
                            <li>Industria</li>
                            <li>Medio ambiente</li>
                            <li>Servicios Públicos</li>
                        </ul>
                    </div>
                </div>

                {/* Imagen adicional */}
                <div className='col d-flex justify-content-center'>
                    <img src={comunicacionesImagen} alt='comunicaciones' className='img-fluid rounded' style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>
            </div>
        </div>
    );
}
