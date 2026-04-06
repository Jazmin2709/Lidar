// src/paginas/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    BarChart, Bar
} from 'recharts';

import '../css/Dashboard.css';  // ← Importamos el CSS

// Paleta de colores para los gráficos
const COLORS = ['#99EECC', '#CC948E', '#B73641', '#5F263A', '#AA00FF', '#FF6666'];

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [buddy1Count, setBuddy1Count] = useState(0);
    const [buddy2Count, setBuddy2Count] = useState(0);
    const [buddy3Count, setBuddy3Count] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [etapaActiva, setEtapaActiva] = useState('Inicio');
    const [etapasData, setEtapasData] = useState({});
    const [estadoHerramientaData, setEstadoHerramientaData] = useState([]);
    const [estadoEmpleadoData, setEstadoEmpleadoData] = useState([]);
    const [estadoVehiculoData, setEstadoVehiculoData] = useState([]);
    const [graficoActivo, setGraficoActivo] = useState("herramienta");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/buddy/BuddyPartner');
                const records = res.data;

                let count1 = 0, count2 = 0, count3 = 0;
                const grouped = {};
                const etapasAgrupadas = { 'Inicio': {}, 'En proceso': {}, 'Finalizó': {} };
                const estadoHerramientaCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };
                const estadoEmpleadoCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };
                const estadoVehiculoCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };

                records.forEach(item => {
                    const cuadrilla = item.num_cuadrilla;
                    grouped[cuadrilla] = (grouped[cuadrilla] || 0) + 1;

                    if (item.Tipo === 1) count1++;
                    else if (item.Tipo === 2) count2++;
                    else if (item.Tipo === 3) count3++;

                    const etapa = item.Est_etapa;
                    if (etapasAgrupadas[etapa]) {
                        etapasAgrupadas[etapa][cuadrilla] = (etapasAgrupadas[etapa][cuadrilla] || 0) + 1;
                    }

                    if (estadoHerramientaCount[item.Est_her] !== undefined) estadoHerramientaCount[item.Est_her]++;
                    if (estadoEmpleadoCount[item.Est_empl] !== undefined) estadoEmpleadoCount[item.Est_empl]++;
                    if (estadoVehiculoCount[item.Est_vehi] !== undefined) estadoVehiculoCount[item.Est_vehi]++;
                });

                const chartData = Object.entries(grouped).map(([cuadrilla, cantidad]) => ({
                    name: `Cuadrilla ${cuadrilla}`,
                    value: cantidad
                }));

                const formatEtapa = etapa =>
                    Object.entries(etapasAgrupadas[etapa]).map(([cuadrilla, cantidad]) => ({
                        cuadrilla: `Cuadrilla ${cuadrilla}`,
                        registros: cantidad
                    }));

                const herramientaDataArray = Object.entries(estadoHerramientaCount).map(([estado, cantidad]) => ({
                    estado, cantidad
                }));
                const empleadoDataArray = Object.entries(estadoEmpleadoCount).map(([estado, cantidad]) => ({
                    estado, cantidad
                }));
                const vehiculoDataArray = Object.entries(estadoVehiculoCount).map(([estado, cantidad]) => ({
                    estado, cantidad
                }));

                setData(chartData);
                setBuddy1Count(count1);
                setBuddy2Count(count2);
                setBuddy3Count(count3);
                setTotalCount(records.length);
                setEtapasData({
                    'Inicio': formatEtapa('Inicio') || [],
                    'En proceso': formatEtapa('En proceso') || [],
                    'Finalizó': formatEtapa('Finalizó') || []
                });
                setEstadoHerramientaData(herramientaDataArray);
                setEstadoEmpleadoData(empleadoDataArray);
                setEstadoVehiculoData(vehiculoDataArray);

            } catch (error) {
                console.error('Error al obtener datos del backend:', error);
            }
        };

        fetchData();
    }, []);

    const getPercentage = (value) => {
        if (!totalCount) return 0;
        return Math.round((value / totalCount) * 100);
    };

    const getGraficoData = () => {
        if (graficoActivo === "herramienta") {
            return { titulo: "Estado Herramienta", data: estadoHerramientaData };
        } else if (graficoActivo === "empleado") {
            return { titulo: "Estado Empleado", data: estadoEmpleadoData };
        } else {
            return { titulo: "Estado Vehículo", data: estadoVehiculoData };
        }
    };

    const grafico = getGraficoData();

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Tarjetas */}
            <div className="row row-cols-2 row-cols-md-4 my-4">
                <div className="col mb-3">
                    <div className={`card dashboard-card dashboard-card-primary`}>
                        <div className="dashboard-card-bar" />
                        <div className="p-3">
                            <h5 className="dashboard-card-title text-primary">Buddy1</h5>
                            <p className="dashboard-card-count small text-primary">{buddy1Count} registros</p>
                            <div className="progress dashboard-progress">
                                <div 
                                    className="progress-bar bg-primary" 
                                    role="progressbar" 
                                    style={{ width: `${getPercentage(buddy1Count)}%` }}
                                >
                                    {getPercentage(buddy1Count)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col mb-3">
                    <div className={`card dashboard-card dashboard-card-success`}>
                        <div className="dashboard-card-bar" />
                        <div className="p-3">
                            <h5 className="dashboard-card-title text-success">Buddy2</h5>
                            <p className="dashboard-card-count small text-success">{buddy2Count} registros</p>
                            <div className="progress dashboard-progress">
                                <div 
                                    className="progress-bar bg-success" 
                                    role="progressbar" 
                                    style={{ width: `${getPercentage(buddy2Count)}%` }}
                                >
                                    {getPercentage(buddy2Count)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col mb-3">
                    <div className={`card dashboard-card dashboard-card-danger`}>
                        <div className="dashboard-card-bar" />
                        <div className="p-3">
                            <h5 className="dashboard-card-title text-danger">Buddy3</h5>
                            <p className="dashboard-card-count small text-danger">{buddy3Count} registros</p>
                            <div className="progress dashboard-progress">
                                <div 
                                    className="progress-bar bg-danger" 
                                    role="progressbar" 
                                    style={{ width: `${getPercentage(buddy3Count)}%` }}
                                >
                                    {getPercentage(buddy3Count)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col mb-3">
                    <div className={`card dashboard-card dashboard-card-warning`}>
                        <div className="dashboard-card-bar" />
                        <div className="p-3">
                            <h5 className="dashboard-card-title text-warning">Total General</h5>
                            <p className="dashboard-card-count small text-warning">{totalCount} registros</p>
                            <div className="progress dashboard-progress">
                                <div 
                                    className="progress-bar bg-warning" 
                                    role="progressbar" 
                                    style={{ width: '100%' }}
                                >
                                    {totalCount} registros
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico de torta */}
            <div className="row">
                <div className="col-md-12 mb-4">
                    <div className="card dashboard-chart-card">
                        <h3 className="dashboard-chart-title">Formularios por Cuadrilla</h3>
                        <ResponsiveContainer width="100%" height={600}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={250}
                                    label
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Línea + Barras */}
            <div className="row">
                {/* Gráfico de línea */}
                <div className="col-md-6 mb-4">
                    <div className="card dashboard-chart-card">
                        <h3 className="dashboard-chart-title">Progreso por Etapa</h3>

                        <div className="dashboard-btn-group">
                            {['Inicio', 'En proceso', 'Finalizó'].map(etapa => (
                                <button
                                    key={etapa}
                                    onClick={() => setEtapaActiva(etapa)}
                                    className={`btn dashboard-btn ${etapaActiva === etapa ? 'btn-primary' : 'btn-light'}`}
                                >
                                    {etapa}
                                </button>
                            ))}
                        </div>

                        <ResponsiveContainer width="100%" height={450}>
                            <LineChart data={etapasData[etapaActiva]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="cuadrilla" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="registros"
                                    stroke="#8884d8"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico de barras dinámico */}
                <div className="col-md-6 mb-4">
                    <div className="card dashboard-chart-card">
                        <h3 className="dashboard-chart-title">{grafico.titulo}</h3>

                        <div className="dashboard-btn-group">
                            <button
                                className={`btn dashboard-btn ${graficoActivo === "herramienta" ? "btn-primary" : "btn-light"}`}
                                onClick={() => setGraficoActivo("herramienta")}
                            >
                                Herramienta
                            </button>
                            <button
                                className={`btn dashboard-btn ${graficoActivo === "empleado" ? "btn-primary" : "btn-light"}`}
                                onClick={() => setGraficoActivo("empleado")}
                            >
                                Empleado
                            </button>
                            <button
                                className={`btn dashboard-btn ${graficoActivo === "vehiculo" ? "btn-primary" : "btn-light"}`}
                                onClick={() => setGraficoActivo("vehiculo")}
                            >
                                Vehículo
                            </button>
                        </div>

                        <ResponsiveContainer width="100%" height={450}>
                            <BarChart data={grafico.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                                    {grafico.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}