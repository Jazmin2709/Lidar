import React, { useState, useEffect} from 'react'
import CustomeChart from '../componentes/CustomeChart'
import axios from 'axios'

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

  const [buddy_partners_1 , setBuddy_partners_1] = useState([]);
  useEffect(() => {
    const fetchBuddy_partners_1 = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner1/');
        setBuddy_partners_1(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBuddy_partners_1();
  }, []);

    
  return (
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col align-self-center p-3">
          <div className="table-responsive">
          <table className="table shadow rounded-5 border-3">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Numero Cuadrilla</th>
                <th scope="col">Hora</th>
                <th scope="col">Estado Empleado</th>
                <th scope="col">Estado Vehiculo</th>
                <th scope="col">Carnet</th>
                <th scope="col">Tarjeta Vida</th>
                <th scope="col">Fecha</th>
                <th scope="col">Estado Etapa</th>
                <th scope="col">Estado Heridos</th>
                <th scope="col">Id Empleado</th>
              </tr>
            </thead>
            <tbody>
              {buddy_partners_1.map((registro) => (
                <tr key={registro.id}>
                  <td>{registro.id_buddy1}</td>
                  <td>{registro.num_cuadrilla}</td>
                  <td>{registro.Hora_buddy}</td>
                  <td>{registro.Est_empl}</td>
                  <td>{registro.Est_vehi}</td>
                  <td>{registro.Carnet}</td>
                  <td>{registro.TarjetaVida}</td>
                  <td>{registro.Fecha}</td>
                  <td>{registro.Est_etapa}</td>
                  <td>{registro.Est_her}</td>
                  <td>{registro.id_empleado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
