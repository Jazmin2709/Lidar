import React from 'react';

export default function PagInicio() {
  return (
    <div className="container">
      <h1 className="text-dark text-center col p-5 fw-bold fw-lighter">Página de inicio</h1>
      <div className="row row-cols-1 row-cols-md-2 align-items-center">
        {/* Usamos row-cols-md-2 para que en pantallas medianas y grandes se divida en dos columnas */}

        {/* Columna para la Misión */}
        <div className="col">
          <h1 className="text-center fw-lighter fw-bold">Misión</h1> {/* Título fuera del cuadro */}
          <div className="border border-secondary rounded-4 p-3"> {/* Cuadro para el texto */}
            <p className="text-dark fw-lighter">
              Nuestra misión es proporcionar servicios de levantamiento y modelado 3D de infraestructuras utilizando tecnología LIDAR de vanguardia,
              con el fin de generar gemelos digitales de alta precisión que permitan a nuestros clientes optimizar la gestión de sus activos,
              mejorar la eficiencia operativa y garantizar la seguridad en sus operaciones.
              Nos comprometemos a entregar datos geoespaciales confiables y actualizados,
              adaptándonos a las necesidades específicas de cada proyecto y contribuyendo al desarrollo de infraestructuras más inteligentes y sostenibles.
            </p>
          </div>
        </div>

        {/* Columna para la Imagen de la Misión (lado derecho) */}
        <div className="col">
          <img src="/ruta/a/tu/imagen-mision.jpg" alt="Imagen de la Misión" className="img-fluid rounded" />
        </div>

        {/* Columna para la Imagen de la Visión (lado izquierdo) */}
        <div className="col">
          <img src="/ruta/a/tu/imagen-vision.jpg" alt="Imagen de la Visión" className="img-fluid rounded" />
        </div>

        {/* Columna para la Visión */}
        <div className="col">
          <h1 className="text-center fw-lighter fw-bold">Visión</h1> {/* Título fuera del cuadro */}
          <div className="border border-secondary rounded-4 p-3"> {/* Cuadro para el texto */}
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