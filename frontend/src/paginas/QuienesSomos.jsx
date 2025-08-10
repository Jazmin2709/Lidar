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
        <div className='container'>
            {/* Título principal */}
            <h1 className='text-dark text-center col p-5 fw-bold fw-lighter'>¿Quienes Somos?</h1>

            {/* Contenedor de columnas responsivas */}
            <div className='row row-cols-1 row-cols-md-2 align-items-center'>

                {/* Sección de descripción sobre la empresa */}
                <div className='col'>
                    <h2 className='text-center fw-lighter fw-bold'>¿Qué es Oca Global Solutions & Dynamics?</h2>
                    <div className='border border-secondary rounded-4 p-3'>
                        <p className='text-dark fw-lighter'>
                            OCA Global es una empresa multinacional que ofrece una amplia gama de servicios en los ámbitos de inspección,
                            certificación, ensayos, formación y consultoría. Su objetivo principal es aumentar el valor económico de los activos, proyectos,
                            productos y sistemas de sus clientes, reduciendo riesgos y garantizando el cumplimiento de los estándares de calidad y seguridad.
                        </p>
                    </div>
                </div>

                {/* Imagen representativa de la empresa (a la derecha) */}
                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={imagesImagen} alt="OCA" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>

                {/* Sección con imágenes de inspección y certificación */}
                <div className="col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={inspeccionImagen} alt="inspeccion" className="img-fluid rounded" style={{ width: '300px', height: '200px', marginBottom: '10px' }} />
                    <img src={certificacionImagen} alt="certificacion" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>

                {/* Sección de servicios que ofrece la empresa */}
                <div className="col" style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1, paddingRight: '20px' }}>
                        <h2 className="text-center fw-lighter fw-bold">Servicios que ofrece Oca</h2>
                        <div className="border border-secondary rounded-4 p-3">
                            {/* Servicios de inspección */}
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Servicios de inspección:
                                <li>Inspección reglamentaria: Verificación del cumplimiento de normativas y regulaciones.</li>
                                <li>Control de calidad y asistencia técnica: Supervisión de procesos y productos para asegurar la calidad.</li>
                                <li>Inspecciones marítimas y de materias primas: Control de calidad en el transporte marítimo y en la manipulación de materias primas</li>
                            </p>

                            {/* Servicios de certificación */}
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Certificación:
                                <li>Certificación de sistemas de gestión (ISO).</li>
                                <li>Certificación de productos.</li>
                            </p>

                            {/* Servicios de ensayos */}
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Ensayos:
                                <li>Ensayos de materiales.</li>
                                <li>Ensayos ambientales.</li>
                            </p>

                            {/* Servicios de formación */}
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Formación:
                                <li>Programas de formación en diversas áreas técnicas y de gestión.</li>
                            </p>

                            {/* Servicios de consultoría */}
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Consultoría y asesoría técnica:
                                <li>Asesoramiento en proyectos de ingeniería y construcción.</li>
                                <li>Consultoría en gestión de riesgos.</li>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sección de sectores de actividad */}
                <div className="col" style={{ marginBottom: '50px' }}>
                    <h2 className="text-center fw-lighter fw-bold">Sectores de Actividad</h2>
                    <div className="border border-secondary rounded-4 p-3">
                        <p className="text-dark fw-lighter">
                            <li>Infraestructuras.</li>
                            <li>Telecomunicaciones.</li>
                            <li>Energía.</li>
                            <li>Industria.</li>
                            <li>Medio ambiente.</li>
                            <li>Servicios Públicos.</li>
                        </p>
                    </div>
                </div>

                {/* Imagen adicional de comunicaciones */}
                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={comunicacionesImagen} alt="OCA" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>
            </div>
        </div>
    );
}
