import React from 'react';
import imagesImagen from '../assets/img/images.png';
import inspeccionImagen from '../assets/img/inspeccion.png';
import certificacionImagen from '../assets/img/certificacion.jpg';
import comunicacionesImagen from '../assets/img/comunicaciones.jpg';

export default function QuienesSomos() {
    return (
        <div className='container'>
            <h1 className='text-dark text-center col p-5 fw-bold fw-lighter'>¿Quienes Somos?</h1>
            <div className='row row-cols-1 row-cols-md-2 align-items-center'>
                {/* Sección 1: ¿Quienes Somos? */}
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
                {/* Columna para la Imagen de Oca (lado derecho) */}
                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={imagesImagen} alt="OCA" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>

                {/* Columna para las imagenes de inspeccion y certificacion (lado izquierdo) */}
                <div className="col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={inspeccionImagen} alt="inspeccion" className="img-fluid rounded" style={{ width: '300px', height: '200px', marginBottom: '10px' }} />
                    <img src={certificacionImagen} alt="certificacion" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>

                {/* Sección 2: Servicios que ofrece Oca */}
                <div className="col" style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1, paddingRight: '20px' }}>
                        <h2 className="text-center fw-lighter fw-bold">Servicios que ofrece Oca</h2>
                        <div className="border border-secondary rounded-4 p-3">
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Servicios de inspección:
                                <li>Inspección reglamentaria: Verificación del cumplimiento de normativas y regulaciones.</li>
                                <li>Control de calidad y asistencia técnica: Supervisión de procesos y productos para asegurar la calidad.</li>
                                <li>Inspecciones marítimas y de materias primas: Control de calidad en el transporte marítimo y en la manipulación de materias primas</li>
                            </p>
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Certificación:
                                <li>Certificación de sistemas de gestión (ISO).</li>
                                <li>Certificación de productos.</li>
                            </p>
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Ensayos:
                                <li>Ensayos de materiales.</li>
                                <li>Ensayos ambientales.</li>
                            </p>
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Formación:
                                <li>Programas de formación en diversas áreas técnicas y de gestión.</li>
                            </p>
                            <p className="text-dark fw-lighter" style={{ marginBottom: '15px' }}>
                                Consultoría y asesoría técnica:
                                <li>Asesoramiento en proyectos de ingeniería y construcción.</li>
                                <li>Consultoría en gestión de riesgos.</li>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sección 3: Sectores de Actividad */}
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

                <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src={comunicacionesImagen} alt="OCA" className="img-fluid rounded" style={{ width: '300px', height: '200px' }} />
                </div>
            </div>
        </div>
    );
}