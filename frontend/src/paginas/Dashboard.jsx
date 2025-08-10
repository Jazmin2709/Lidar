// Importación de React y hooks
import React, { useEffect, useState } from 'react';
// Importación de Axios para hacer solicitudes HTTP
import axios from 'axios';
// Importación de componentes del paquete 'recharts' para gráficas
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Colores para la gráfica de torta
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA00FF', '#FF6666'];

export default function Dashboard() {
    // Estados para contar los tipos de Buddy
    const [data, setData] = useState([]);
    const [buddy1Count, setBuddy1Count] = useState(0);
    const [buddy2Count, setBuddy2Count] = useState(0);
    const [buddy3Count, setBuddy3Count] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    // Estados para manejar las etapas y su data
    const [etapaActiva, setEtapaActiva] = useState('Inicio');
    const [etapasData, setEtapasData] = useState({});

    // Hook useEffect para cargar datos al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Petición al backend para obtener los datos
                const res = await axios.get('http://localhost:3000/api/buddy/BuddyPartner');
                const records = res.data;

                // Contadores para los tipos
                let count1 = 0, count2 = 0, count3 = 0;

                // Agrupar por cuadrilla y etapa
                const grouped = {};
                const etapasAgrupadas = {
                    'Inicio': {},
                    'En proceso': {},
                    'Finalizó': {}
                };

                // Recorremos los registros para contar y agrupar
                records.forEach(item => {
                    const cuadrilla = item.num_cuadrilla;
                    grouped[cuadrilla] = (grouped[cuadrilla] || 0) + 1;

                    // Contar tipos de Buddy
                    if (item.Tipo === 1) count1++;
                    else if (item.Tipo === 2) count2++;
                    else if (item.Tipo === 3) count3++;

                    // Agrupar por etapa
                    const etapa = item.Est_etapa;
                    if (etapasAgrupadas[etapa]) {
                        etapasAgrupadas[etapa][cuadrilla] = (etapasAgrupadas[etapa][cuadrilla] || 0) + 1;
                    }
                });

                // Preparar data para la gráfica de torta
                const chartData = Object.entries(grouped).map(([cuadrilla, cantidad]) => ({
                    name: `Cuadrilla ${cuadrilla}`,
                    value: cantidad
                }));

                // Dar formato a los datos por etapa para la gráfica de líneas
                const formatEtapa = etapa =>
                    Object.entries(etapasAgrupadas[etapa]).map(([cuadrilla, cantidad]) => ({
                        cuadrilla: `Cuadrilla ${cuadrilla}`,
                        registros: cantidad
                    }));

                // Guardar estados con la información obtenida
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
            } catch (error) {
                console.error('Error al obtener datos del backend:', error);
            }
        };

        fetchData();
    }, []);

    // Función para calcular el porcentaje sobre el total
    const getPercentage = (value) => {
        if (!totalCount) return 0;
        return Math.round((value / totalCount) * 100);
    };

    return (
        <div style={{ padding: '30px' }}>
            <h1 style={{ textAlign: 'center' }}>Dashboard</h1>

            {/* Tarjetas informativas por tipo de Buddy */}
            <div className="row row-cols-2 row-cols-md-4 my-4">
                {/* Tarjeta Buddy1 */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-primary position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }}></div>
                        <h5 className='text-primary'>Buddy1</h5>
                        <p className='small text-primary'>{buddy1Count} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${getPercentage(buddy1Count)}%` }}>
                                {getPercentage(buddy1Count)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Buddy2 */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-success position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }}></div>
                        <h5 className='text-success'>Buddy2</h5>
                        <p className='small text-success'>{buddy2Count} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-success" role="progressbar" style={{ width: `${getPercentage(buddy2Count)}%` }}>
                                {getPercentage(buddy2Count)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Buddy3 */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-danger position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }}></div>
                        <h5 className='text-danger'>Buddy3</h5>
                        <p className='small text-danger'>{buddy3Count} registros</p>
                        <div className="progress">
                            <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${getPercentage(buddy3Count)}%` }}>
                                {getPercentage(buddy3Count)}%
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tarjeta Total */}
                <div className="col mb-3">
                    <div className='card rounded shadow p-3 position-relative'>
                        <div className="bg-warning position-absolute top-0 start-0" style={{ width: '4px', height: '100%' }}></div>
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

            {/* Gráficas */}
            <div className="row">
                {/* Gráfica de Línea: Progreso por Etapa */}
                <div className="col-md-6 mb-4">
                    <div className='card rounded shadow p-4' style={{ minHeight: '500px' }}>
                        <h3 className="text-center">Progreso por Etapa</h3>

                        {/* Botones para cambiar la etapa activa */}
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

                        {/* Gráfica de Línea */}
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={etapasData[etapaActiva]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="cuadrilla" />
                                <YAxis />
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

                {/* Gráfica de Torta: Formularios por Cuadrilla */}
                <div className="col-md-6 mb-4">
                    <div className='card rounded shadow p-4' style={{ minHeight: '500px' }}>
                        <h3 className="text-center">Formularios por Cuadrilla</h3>

                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={130}
                                    fill="#8884d8"
                                    label
                                >
                                    {/* Colores para cada sector */}
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
        </div>
    );
}
