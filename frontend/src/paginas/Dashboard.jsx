import React, { useState, useEffect } from 'react'
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

  const [buddy_partners_1, setBuddy_partners_1] = useState([]);
  const [buddy_partners_2, setBuddy_partners_2] = useState([]);
  const [buddy_partners_3, setBuddy_partners_3] = useState([]);
    useEffect(() => {
      const fetchBuddy_partners_1 = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner1/');
          setBuddy_partners_1(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchBuddy_partners_2 = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner2/');
          setBuddy_partners_2(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      const fetchBuddy_partners_3 = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner3/');
          setBuddy_partners_3(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      fetchBuddy_partners_1();
      fetchBuddy_partners_2();
      fetchBuddy_partners_3();
    }, []);

  return (
    <div className="container-fluid">
      <h1 className="text-center mt-3">Dashboard</h1>
      <div className="row align-items-center">
        <div className="col-12 row">
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Numero total de registros</h5>
                <p className="card-text">{buddy_partners_1.length}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Numero total por buddy partners 1</h5>
                <p className="card-text">{buddy_partners_2.length}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Numero total por buddy partners 2</h5>
                <p className="card-text">{buddy_partners_3.length}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Numero total por buddy partners 3</h5>
                <p className="card-text">{buddy_partners_1.length}</p>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">buddy partner con mas reportes</h5>
                <p className="card-text">{buddy_partners_1.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="text-center">
            <CustomeChart data={GraficaData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
