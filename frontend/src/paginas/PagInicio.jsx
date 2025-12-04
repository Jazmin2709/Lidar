// Importa React, necesario para trabajar con componentes funcionales
import React from 'react';

// Importa las imágenes que se usarán en la página desde la carpeta de assets
import datosImagen from '/src/assets/img/Datos.jpg';
import grupo2Imagen from '/src/assets/img/grupo2.jpg';

// Define y exporta el componente funcional PagInicio
export default function PagInicio() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-dark text-center fw-bold p-4">Página de Inicio</h1>

      {/* Grid responsiva usando Bootstrap */}
      <div className="row row-cols-1 row-cols-md-2 g-4 align-items-center">

        {/* Misión */}
        <div className="col">
          <h2 className="text-center fw-bold">Misión</h2>
          <div className="border border-secondary rounded-4 p-3">
            <p className="text-dark fw-light">
              Nuestra misión es proporcionar servicios de levantamiento y modelado 3D de infraestructuras utilizando tecnología LIDAR de vanguardia,
              con el fin de generar gemelos digitales de alta precisión que permitan a nuestros clientes optimizar la gestión de sus activos,
              mejorar la eficiencia operativa y garantizar la seguridad en sus operaciones.
              Nos comprometemos a entregar datos geoespaciales confiables y actualizados,
              adaptándonos a las necesidades específicas de cada proyecto y contribuyendo al desarrollo de infraestructuras más inteligentes y sostenibles.
            </p>
          </div>
        </div>

        {/* Imagen Misión */}
        <div className="col d-flex justify-content-center">
          <img
            src={datosImagen}
            alt="Imagen de LIDAR"
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* Imagen Visión */}
        <div className="col d-flex justify-content-center">
          <img
            src={grupo2Imagen}
            alt="Imagen de LIDAR"
            className="img-fluid rounded"
            style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover' }}
          />
        </div>

        {/* Visión */}
        <div className="col mb-5">
          <h2 className="text-center fw-bold">Visión</h2>
          <div className="border border-secondary rounded-4 p-3">
            <p className="text-dark fw-light">
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
