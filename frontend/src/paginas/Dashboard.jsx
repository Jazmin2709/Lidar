import React from 'react'
import CustomeChart from '../componentes/CustomeChart'

export default function Dashboard() {

    const GraficaData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [
          {
            label: 'Numero de reportes',
            data: [12, 19, 3, 5, 2, 3, 5, 2, 3, 5, 2, 3],
          },
        ],
    }

  const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Reportes por mes',
          },
        },
    }

    function col (nombre, valor, porcentaje) {
      return (
        <div className="col p-2 row">
          <div className="col-2 text-center align-self-center">
            <i className="bi bi-person fs-1 border border-secondary rounded-circle p-2"></i>
          </div>
          <div className="col-10">
            <p>{nombre}</p>
            <p>${valor}</p>
            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-bar bg-success" style={{width: porcentaje}}></div>
            </div>
          </div>
        </div>
      );
    }
  
  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-sm-2 align-items-center">
        <div className="col align-self-center border border-secondary rounded-4 p-3">
          <div className="row row-cols-1 ">
            <h1 className='fst-italic'>Reportes</h1>
            {col("Camilo", 50000, "50%")}
            {col("Dilan", 100000, "70%")}
            {col("Cielo", 90000, "90%")}
          </div>
        </div>
        <div className="col p-5">
          <h1 className="text-center fst-italic">Grafica</h1>
          <CustomeChart data={GraficaData} tipo="doughnut" options={options} />
        </div>
      </div>
    </div>
  );
}
