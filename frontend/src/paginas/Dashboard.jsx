// Importamos React y los hooks de estado/efecto
import React, { useEffect, useState } from 'react';
// Axios para llamadas HTTP al backend
import axios from 'axios';
// Importamos componentes de Recharts para distintos tipos de gráficos
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    BarChart, Bar
} from 'recharts';


// Paleta de colores para los gráficos
const COLORS = ['#99EECC', '#CC948E', '#B73641', '#5F263A', '#AA00FF', '#FF6666'];


export default function Dashboard() {
    // -------------------------
    // ESTADOS PRINCIPALES
    // -------------------------


    // Datos para el gráfico de torta (formularios por cuadrilla)
    const [data, setData] = useState([]);


    // Contadores para tarjetas (Buddy1, Buddy2, Buddy3, Total)
    const [buddy1Count, setBuddy1Count] = useState(0);
    const [buddy2Count, setBuddy2Count] = useState(0);
    const [buddy3Count, setBuddy3Count] = useState(0);
    const [totalCount, setTotalCount] = useState(0);


    // Línea de progreso por etapas
    const [etapaActiva, setEtapaActiva] = useState('Inicio'); // Etapa seleccionada
    const [etapasData, setEtapasData] = useState({});         // Datos de cada etapa


    // Gráficos de barras para estados de herramienta, empleado y vehículo
    const [estadoHerramientaData, setEstadoHerramientaData] = useState([]);
    const [estadoEmpleadoData, setEstadoEmpleadoData] = useState([]);
    const [estadoVehiculoData, setEstadoVehiculoData] = useState([]);


    // Estado para saber qué gráfico de barras mostrar
    const [graficoActivo, setGraficoActivo] = useState("herramienta");


    // -------------------------
    // FETCH DE DATOS
    // -------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Llamada al backend
                const res = await axios.get('https://lidar-cush.onrender.com/api/buddy/BuddyPartner');
                const records = res.data; // Lista de registros


                // Contadores individuales
                let count1 = 0, count2 = 0, count3 = 0;


                // Para agrupar registros por cuadrilla (torta)
                const grouped = {};


                // Para agrupar registros por etapa (línea)
                const etapasAgrupadas = { 'Inicio': {}, 'En proceso': {}, 'Finalizó': {} };


                // Contadores por estado de herramienta, empleado y vehículo
                const estadoHerramientaCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };
                const estadoEmpleadoCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };
                const estadoVehiculoCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };


                // Recorremos cada registro del backend
                records.forEach(item => {
                    // --- Torta ---
                    const cuadrilla = item.num_cuadrilla;
                    grouped[cuadrilla] = (grouped[cuadrilla] || 0) + 1;


                    // --- Tarjetas por tipo ---
                    if (item.Tipo === 1) count1++;
                    else if (item.Tipo === 2) count2++;
                    else if (item.Tipo === 3) count3++;


                    // --- Línea por etapa ---
                    const etapa = item.Est_etapa;
                    if (etapasAgrupadas[etapa]) {
                        etapasAgrupadas[etapa][cuadrilla] = (etapasAgrupadas[etapa][cuadrilla] || 0) + 1;
                    }


                    // --- Barras por estados ---
                    if (estadoHerramientaCount[item.Est_her] !== undefined) {
                        estadoHerramientaCount[item.Est_her]++;
                    }
                    if (estadoEmpleadoCount[item.Est_empl] !== undefined) {
                        estadoEmpleadoCount[item.Est_empl]++;
                    }
                    if (estadoVehiculoCount[item.Est_vehi] !== undefined) {
                        estadoVehiculoCount[item.Est_vehi]++;
                    }
                });


                // -------------------------
                // TRANSFORMAMOS LOS DATOS
                // -------------------------


                // Torta: array de {name, value}
                const chartData = Object.entries(grouped).map(([cuadrilla, cantidad]) => ({
                    name: `Cuadrilla ${cuadrilla}`,
                    value: cantidad
                }));


                // Línea: convertimos los objetos de cada etapa en arrays
                const formatEtapa = etapa =>
                    Object.entries(etapasAgrupadas[etapa]).map(([cuadrilla, cantidad]) => ({
                        cuadrilla: `Cuadrilla ${cuadrilla}`,
                        registros: cantidad
                    }));


                // Barras: convertimos cada conteo en array de objetos
                const herramientaDataArray = Object.entries(estadoHerramientaCount).map(([estado, cantidad]) => ({
                    estado, cantidad
                }));
                const empleadoDataArray = Object.entries(estadoEmpleadoCount).map(([estado, cantidad]) => ({
                    estado, cantidad
                }));
                const VehiculoDataArray = Object.entries(estadoVehiculoCount).map(([estado, cantidad]) => ({
                    estado, cantidad
                }));


                // -------------------------
                // SETEAMOS LOS ESTADOS
                // -------------------------
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
                setEstadoVehiculoData(VehiculoDataArray);


            } catch (error) {
                console.error('Error al obtener datos del backend:', error);
            }
        };


        fetchData();
    }, []);


    // -------------------------
    // FUNCIONES AUXILIARES
    // -------------------------


    // Calcula porcentaje para las tarjetas
    const getPercentage = (value) => {
        if (!totalCount) return 0;
        return Math.round((value / totalCount) * 100);
    };


    // Selección del gráfico de barras según botón activo
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


    // -------------------------
    // RENDER DEL COMPONENTE
    // -------------------------
    return (
        <div style={{ padding: '0  50px' }}>
            <h1 style={{ textAlign: 'center' }}>Dashboard</h1>


            {/* ---------------- TARJETAS ---------------- */}
            <div className="row row-cols-2 row-cols-md-4 my-4">
                {/* Buddy1 */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-primary position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }} />
                        <h5 className='text-primary'>Buddy1</h5>
                        <p className='small text-primary'>{buddy1Count} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${getPercentage(buddy1Count)}%` }}>
                                {getPercentage(buddy1Count)}%
                            </div>
                        </div>
                    </div>
                </div>


                {/* Buddy2 */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-success position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }} />
                        <h5 className='text-success'>Buddy2</h5>
                        <p className='small text-success'>{buddy2Count} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: `${getPercentage(buddy2Count)}%` }}>
                                {getPercentage(buddy2Count)}%
                            </div>
                        </div>
                    </div>
                </div>


                {/* Buddy3 */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-danger position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }} />
                        <h5 className='text-danger'>Buddy3</h5>
                        <p className='small text-danger'>{buddy3Count} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${getPercentage(buddy3Count)}%` }}>
                                {getPercentage(buddy3Count)}%
                            </div>
                        </div>
                    </div>
                </div>


                {/* Total */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-warning position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }} />
                        <h5 className='text-warning'>Total General</h5>
                        <p className='small text-warning'>{totalCount} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-warning" role="progressbar" style={{ width: '100%' }}>
                                {totalCount} registros
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* ---------------- TORTA ---------------- */}
            <div className='row'>
                <div className="col-md-12 mb-4">
                    <div className='card rounded shadow p-4' style={{ minHeight: '500px' }}>
                        <h3 className="text-center">Formularios por Cuadrilla</h3>
                        <ResponsiveContainer width="100%" height={600}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={250}
                                    fill="#8884d8"
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


            {/* ---------------- LÍNEA + BARRAS ---------------- */}
            <div className="row">
                {/* Línea */}
                <div className="col-md-6 mb-4">
                    <div className='card rounded shadow p-4' style={{ minHeight: '500px' }}>
                        <h3 className="text-center">Progreso por Etapa</h3>


                        {/* Botones para cambiar etapa */}
                        <div className="d-flex justify-content-center gap-2 my-3">
                            {['Inicio', 'En proceso', 'Finalizó'].map(etapa => (
                                <button
                                    key={etapa}
                                    onClick={() => setEtapaActiva(etapa)}
                                    className={`btn ${etapaActiva === etapa ? 'btn-primary' : 'btn-light'}`}
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


                {/* Barras dinámicas */}
                <div className="col-md-6 mb-4">
                    <div className='card rounded shadow p-4' style={{ minHeight: '500px' }}>
                        <h3 className="text-center">{grafico.titulo}</h3>


                        {/* Botones de selección */}
                        <div className="d-flex justify-content-center gap-2 my-3">
                            <button
                                className={`btn ${graficoActivo === "herramienta" ? "btn-primary" : "btn-light"}`}
                                onClick={() => setGraficoActivo("herramienta")}
                            >
                                Herramienta
                            </button>
                            <button
                                className={`btn ${graficoActivo === "empleado" ? "btn-primary" : "btn-light"}`}
                                onClick={() => setGraficoActivo("empleado")}
                            >
                                Empleado
                            </button>
                            <button
                                className={`btn ${graficoActivo === "vehiculo" ? "btn-primary" : "btn-light"}`}
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
