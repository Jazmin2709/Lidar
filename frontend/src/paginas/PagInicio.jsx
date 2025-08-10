// Importa React, necesario para trabajar con componentes funcionales
import React from 'react';

// Importa las imágenes que se usarán en la página desde la carpeta de assets
import datosImagen from '/src/assets/img/Datos.jpg';
import grupo2Imagen from '/src/assets/img/grupo2.jpg';

// Define y exporta el componente funcional PagInicio
export default function PagInicio() {
  return (
    // Contenedor principal con clases de Bootstrap
    <div className="container">

      {/* Título principal de la página */}
      <h1 className="text-dark text-center col p-5 fw-bold fw-lighter">Página de inicio</h1>

      {/* Fila que contiene dos columnas por fila en pantallas medianas en adelante */}
      <div className="row row-cols-1 row-cols-md-2 align-items-center">

        {/* Columna izquierda: sección de Misión */}
        <div className="col">
          {/* Título de la sección */}
          <h2 className="text-center fw-lighter fw-bold">Misión</h2>

          {/* Contenedor con borde y padding para el contenido de Misión */}
          <div className="border border-secondary rounded-4 p-3">
            {/* Párrafo que describe la misión de la empresa */}
            <p className="text-dark fw-lighter">
              Nuestra misión es proporcionar servicios de levantamiento y modelado 3D de infraestructuras utilizando tecnología LIDAR de vanguardia,
              con el fin de generar gemelos digitales de alta precisión que permitan a nuestros clientes optimizar la gestión de sus activos,
              mejorar la eficiencia operativa y garantizar la seguridad en sus operaciones.
              Nos comprometemos a entregar datos geoespaciales confiables y actualizados,
              adaptándonos a las necesidades específicas de cada proyecto y contribuyendo al desarrollo de infraestructuras más inteligentes y sostenibles.
            </p>
          </div>
        </div>

        {/* Columna derecha: imagen asociada a la Misión */}
        <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={datosImagen} // Fuente de la imagen
            alt="Imagen de LIDAR" // Texto alternativo por accesibilidad
            className="img-fluid rounded" // Estilo responsive y bordes redondeados
            style={{ width: '300px', height: '200px' }} // Tamaño fijo
          />
        </div>

        {/* Columna izquierda: imagen asociada a la Visión */}
        <div className="col" style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={grupo2Imagen}
            alt="Imagen de LIDAR"
            className="img-fluid rounded"
            style={{ width: '300px', height: '200px' }}
          />
        </div>

        {/* Columna derecha: sección de Visión */}
        <div className="col" style={{ marginBottom: '50px' }}>
          {/* Título de la sección */}
          <h2 className="text-center fw-lighter fw-bold">Visión</h2>

          {/* Contenedor con borde y padding para el contenido de Visión */}
          <div className="border border-secondary rounded-4 p-3">
            {/* Párrafo que describe la visión de la empresa */}
            <p className="text-dark fw-lighter">
              Aspiramos a ser líderes en la prestación de servicios LIDAR en el ámbito de la inspección y modelado de infraestructuras,
              siendo reconocidos por nuestra excelencia técnica, la calidad de nuestros datos y nuestra capacidad de innovación.
              Buscamos ser el socio estratégico de nuestros clientes en la implementación de soluciones basadas en gemelos digitales,
              impulsando la transformación digital de sus operaciones y contribuyendo a la creación de un futuro más eficiente y seguro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
