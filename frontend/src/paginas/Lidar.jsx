import React from 'react';

// Importación de imágenes desde la carpeta assets
import beneficiosImagen from '/src/assets/img/Beneficios.jpg';
import herramientasImagen from '/src/assets/img/Herramientas.jpg';
import lidarImagen from '/src/assets/img/LIDAR.webp';
import topografiaImagen from '/src/assets/img/Topografia.jpg';
import cartografiaImagen from '/src/assets/img/Cartografia.jpg';

// Componente principal de la página LIDAR
export default function Lidar() {
  return (
    // Contenedor principal con margenes y padding
    <div className="container mx-auto p-4">
      
      {/* Título principal de la página */}
      <h1 className="text-dark text-center fw-bold p-4">Proyecto Lidar</h1>

      {/* Grid responsiva con Bootstrap (1 columna en móvil, 2 en pantallas medianas) */}
      <div className="row row-cols-1 row-cols-md-2 g-4 align-items-center">

        {/* --- SECCIÓN: ¿Qué es LIDAR? --- */}
        <div className="col">
          <h2 className="text-center fw-bold">¿Qué es LIDAR?</h2>

          {/* Cuadro con borde y texto explicativo */}
          <div className="border border-secondary rounded-4 p-3">
            <p className="text-dark fw-light">
              LIDAR (Light Detection and Ranging) es una tecnología de teledetección que utiliza pulsos láser para medir distancias y crear modelos 3D precisos del entorno.
              Funciona emitiendo pulsos de luz láser hacia un objeto o superficie y midiendo el tiempo que tarda la luz en regresar al sensor.
              Esta información permite generar nubes de puntos densas que representan la forma y estructura del terreno y otros objetos.
            </p>
          </div>
        </div>

        {/* Imagen principal del LIDAR */}
        <div className="col d-flex justify-content-center">
          <img
            src={lidarImagen}
            alt="Imagen de LIDAR"
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* Imágenes de topografía y cartografía apiladas */}
        <div className="col d-flex flex-column align-items-center">
          <img
            src={topografiaImagen}
            alt="Topografía"
            className="img-fluid rounded mb-3"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />

          <img
            src={cartografiaImagen}
            alt="Cartografía"
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* --- SECCIÓN: Aplicaciones del Proyecto LIDAR --- */}
        <div className="col">
          <h2 className="text-center fw-bold">Aplicaciones del Proyecto LIDAR</h2>

          {/* Cuadro con lista de aplicaciones */}
          <div className="border border-secondary rounded-4 p-3">

            {/* Subtemas con listas */}
            <p className="fw-light">Topografía y cartografía:</p>
            <ul>
              <li>Generación de modelos digitales del terreno (MDT) y de superficie (MDS).</li>
              <li>Mapas topográficos para ingeniería y construcción.</li>
              <li>Levantamientos de carreteras, ferrocarriles y líneas eléctricas.</li>
            </ul>

            <p className="fw-light mt-3">Gestión de recursos naturales:</p>
            <ul>
              <li>Monitoreo de deforestación y salud de bosques.</li>
              <li>Evaluación de riesgos ambientales.</li>
              <li>Modelado de biomasa y carbono.</li>
            </ul>

            <p className="fw-light mt-3">Agricultura de precisión:</p>
            <ul>
              <li>Análisis de estructura de cultivos.</li>
              <li>Optimización de fertilizantes y pesticidas.</li>
              <li>Monitoreo de crecimiento y detección de enfermedades.</li>
            </ul>

            <p className="fw-light mt-3">Inspección de infraestructuras:</p>
            <ul>
              <li>Evaluación de estado de estructuras.</li>
              <li>Detección de deformaciones.</li>
              <li>Modelos 3D para mantenimiento.</li>
            </ul>

            <p className="fw-light mt-3">Medio ambiente:</p>
            <ul>
              <li>Monitoreo de cambios ambientales.</li>
              <li>Apoyo a gestión ambiental.</li>
              <li>Medición de cambios en ecosistemas.</li>
            </ul>

          </div>
        </div>

        {/* --- SECCIÓN: Beneficios de LIDAR --- */}
        <div className="col">
          <h2 className="text-center fw-bold">Beneficios del uso de LIDAR</h2>

          <div className="border border-secondary rounded-4 p-3">
            <ul className="fw-light">
              <li>Alta precisión y densidad de datos.</li>
              <li>Penetración de vegetación para medir el terreno.</li>
              <li>Rapidez en captura de datos.</li>
              <li>Modelos 3D detallados.</li>
            </ul>
          </div>
        </div>

        {/* Imagen asociada a los beneficios */}
        <div className="col d-flex justify-content-center">
          <img
            src={beneficiosImagen}
            alt="Beneficios"
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* Imagen de herramientas LIDAR */}
        <div className="col d-flex justify-content-center">
          <img
            src={herramientasImagen}
            alt="Herramientas"
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* --- SECCIÓN: Tecnología utilizada --- */}
        <div className="col mb-5">
          <h2 className="text-center fw-bold">Tecnología y software utilizados</h2>

          <div className="border border-secondary rounded-4 p-3">
            <p className="fw-light">
              Utilizamos equipos LIDAR de última generación, tanto aéreos como terrestres, junto con software especializado para el procesamiento de datos,
              nubes de puntos, MDT/MDS, extracción de características y visualización 3D.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
