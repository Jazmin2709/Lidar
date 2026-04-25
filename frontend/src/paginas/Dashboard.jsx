// src/paginas/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Importamos componentes de Recharts para visualizar métricas
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend,
    BarChart, Bar, ResponsiveContainer, Cell
} from 'recharts';
// Importamos componentes de Ant Design para lograr una vista más bonita ("más bonito y premium")
import { Card, Row, Col, Typography, Progress, List, Avatar, Tag, Tooltip } from 'antd';
import { UserOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
// CSS adicional (se mantiene el existente por si hubiera reglas importantes)
import '../css/Dashboard.css';

const { Title, Text } = Typography;

// Paleta de colores mejorada para los gráficos
const COLORS = ['#99EECC', '#CC948E', '#B73641', '#5F263A', '#AA00FF', '#FF6666', '#FFC107', '#17A2B8'];

export default function Dashboard() {
    // --- ESTADOS PARA GRÁFICOS ORIGINALES ---
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

    // --- ESTADOS NUEVOS PARA ASISTENCIA Y CUADRILLAS ---
    // Aquí guardamos los reportes de asistencias y de cuadrillas para que se vean en el dashbboard
    const [asistencias, setAsistencias] = useState([]);
    const [cuadrillas, setCuadrillas] = useState([]);
    
    // Estado para controlar la pantalla de carga (spinner / skeleton de antd)
    const [cargando, setCargando] = useState(true);

    // --- EFECTO DE MONTAJE: PETICIÓN DE DATOS ---
    useEffect(() => {
        const fetchData = async () => {
            setCargando(true);
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
                
                // Realizar las tres peticiones simultáneamente para aprovechar el asincronismo
                // 1. Obtener los buddies
                // 2. Obtener asistencias de HOY
                // 3. Obtener cuadrillas creadas HOY
                const [resBuddy, resAsistencias, resCuadrillas] = await Promise.all([
                    axios.get(`${API_URL}/buddy/BuddyPartner`),
                    axios.get(`${API_URL}/asistencia/hoy`).catch(() => ({ data: [] })),
                    axios.get(`${API_URL}/cuadrillas/dia`).catch(() => ({ data: [] }))
                ]);

                // Asignamos datos retornados para los módulos nuevos
                const records = resBuddy.data || [];
                setAsistencias(resAsistencias.data || []);
                setCuadrillas(resCuadrillas.data || []);

                // Procesamiento estadístico general (agrupar para Recharts)
                let count1 = 0, count2 = 0, count3 = 0;
                const grouped = {};
                const etapasAgrupadas = { 'Inicio': {}, 'En proceso': {}, 'Finalizó': {} };
                const estadoHerramientaCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };
                const estadoEmpleadoCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };
                const estadoVehiculoCount = { 'Excelente': 0, 'Bueno': 0, 'Malo': 0 };

                records.forEach(item => {
                    const cuadrilla = item.num_cuadrilla;

                    // Clasificamos tipos de Buddies
                    if (item.Tipo === 1) count1++;
                    else if (item.Tipo === 2) count2++;
                    else if (item.Tipo === 3) count3++;

                    // Agrupamos etapas para la línea de progreso
                    const etapa = item.Est_etapa;
                    if (etapasAgrupadas[etapa]) {
                        etapasAgrupadas[etapa][cuadrilla] = (etapasAgrupadas[etapa][cuadrilla] || 0) + 1;
                    }

                    // Sumamos condiciones generales
                    if (estadoHerramientaCount[item.Est_her] !== undefined) estadoHerramientaCount[item.Est_her]++;
                    if (estadoEmpleadoCount[item.Est_empl] !== undefined) estadoEmpleadoCount[item.Est_empl]++;
                    if (estadoVehiculoCount[item.Est_vehi] !== undefined) estadoVehiculoCount[item.Est_vehi]++;
                });

                // Formatación final a arrays consumibles por Recharts
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

                // Guardar todo en estados
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
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, []);

    // Función auxiliar para obtener el % del progreso total
    const getPercentage = (value) => {
        if (!totalCount) return 0;
        return Math.round((value / totalCount) * 100);
    };

    // Selección dinámica de la data para el BarChart final
    const getGraficoData = () => {
        if (graficoActivo === "herramienta") return { titulo: "Estado Herramienta", data: estadoHerramientaData };
        if (graficoActivo === "empleado") return { titulo: "Estado Empleado", data: estadoEmpleadoData };
        return { titulo: "Estado Vehículo", data: estadoVehiculoData };
    };

    const grafico = getGraficoData();

    return (
        <div className="dashboard-container" style={{ padding: '30px' }}>
            {/* Título Principal */}
            <Title level={2} style={{ color: '#1a3c6d', marginBottom: '30px' }}>Dashboard de Operación</Title>

            {/* SECCIÓN 1: Tarjetas superiores de reportes Buddies */}
            <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ borderRadius: '12px', borderLeft: '6px solid #1890ff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Text type="secondary" style={{ fontSize: '14px' }}>Buddy 1</Text>
                        <Title level={3} style={{ margin: '5px 0', color: '#1890ff' }}>{buddy1Count}</Title>
                        <Progress percent={getPercentage(buddy1Count)} showInfo={false} strokeColor="#1890ff" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ borderRadius: '12px', borderLeft: '6px solid #52c41a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Text type="secondary" style={{ fontSize: '14px' }}>Buddy 2</Text>
                        <Title level={3} style={{ margin: '5px 0', color: '#52c41a' }}>{buddy2Count}</Title>
                        <Progress percent={getPercentage(buddy2Count)} showInfo={false} strokeColor="#52c41a" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ borderRadius: '12px', borderLeft: '6px solid #ff4d4f', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Text type="secondary" style={{ fontSize: '14px' }}>Buddy 3</Text>
                        <Title level={3} style={{ margin: '5px 0', color: '#ff4d4f' }}>{buddy3Count}</Title>
                        <Progress percent={getPercentage(buddy3Count)} showInfo={false} strokeColor="#ff4d4f" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card style={{ borderRadius: '12px', borderLeft: '6px solid #faad14', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Text type="secondary" style={{ fontSize: '14px' }}>Total Generales</Text>
                        <Title level={3} style={{ margin: '5px 0', color: '#faad14' }}>{totalCount}</Title>
                        <Progress percent={100} showInfo={false} strokeColor="#faad14" />
                    </Card>
                </Col>
            </Row>

            {/* SECCIÓN 2 (NUEVA): Panel de Asistencias y Cuadrillas */}
            {/* Este bloque de código provee una vista rápida de la actividad de los empleados. */}
            <Row gutter={[24, 24]} style={{ marginBottom: '30px' }}>
                
                {/* Cuadro de asistencia de los empleados */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={<><CheckCircleOutlined style={{ color: '#52c41a' }} /> Asistencia de Empleados Hoy</>} 
                        style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '24px' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={asistencias} 
                                loading={cargando}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.foto_url} icon={<UserOutlined />} />}
                                            title={`${item.Nombres} ${item.Apellidos}`}
                                            description={`Hora de entrada: ${item.hora || item.hora_asistencia || '--:--'} | Lat: ${Number(item.latitud).toFixed(4)}, Lon: ${Number(item.longitud).toFixed(4)}`}
                                        />
                                        <Tag color="success">Presente</Tag>
                                    </List.Item>
                                )}
                            />
                            {/* Mensaje por si nadie ha registrado asistencia */}
                            {asistencias.length === 0 && !cargando && (
                                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No hay asistencias registradas hoy en el sistema.</div>
                            )}
                        </div>
                    </Card>
                </Col>

                {/* Cuadro de Gestión / Visualización rápida de Cuadrillas */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={<><TeamOutlined style={{ color: '#1890ff' }} /> Gestión Rápida de Cuadrillas</>} 
                        style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}
                        bodyStyle={{ padding: 0 }}
                    >
                        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '24px' }}>
                            <List
                                grid={{ gutter: 16, column: 2 }}
                                dataSource={cuadrillas} 
                                loading={cargando}
                                renderItem={item => (
                                    <List.Item>
                                        <Card size="small" hoverable style={{ borderRadius: '8px', border: '1px solid #e8e8e8' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.nombre}</div>
                                            <div style={{ marginBottom: '10px' }}>
                                                <Tag color={item.tipo === 'Normal' ? 'blue' : 'orange'}>{item.tipo}</Tag>
                                            </div>
                                            {/* Agrupamos fotos de los integrantes para crear un efecto visual agradable */}
                                            <Avatar.Group maxCount={3} size="small" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                                                {item.miembros && item.miembros.map(m => (
                                                    <Tooltip title={`${m.Nombres} ${m.Apellidos}`} key={m.id_per}>
                                                        <Avatar src={m.foto_url} icon={<UserOutlined />} />
                                                    </Tooltip>
                                                ))}
                                            </Avatar.Group>
                                        </Card>
                                    </List.Item>
                                )}
                            />
                            {/* Respaldo visual si no hay cuadrillas */}
                            {cuadrillas.length === 0 && !cargando && (
                                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No hay cuadrillas asignadas hoy por el momento.</div>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* SECCIÓN 3: Gráficos principales */}
            <Row gutter={[24, 24]}>
                {/* Grafico de líneas - Progreso en etapas del día */}
                <Col xs={24} lg={12}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ textAlign: 'center', color: '#333' }}>Progreso por Etapa Operacional</h4>
                        
                        {/* Botones estilo pill (Tag de AntD) para seleccionar etapa de la línea */}
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            {['Inicio', 'En proceso', 'Finalizó'].map(etapa => (
                                <Tag 
                                    color={etapaActiva === etapa ? 'blue' : 'default'}
                                    key={etapa}
                                    style={{ cursor: 'pointer', fontSize: '14px', padding: '4px 12px' }}
                                    onClick={() => setEtapaActiva(etapa)}
                                >
                                    {etapa}
                                </Tag>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={etapasData[etapaActiva]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="cuadrilla" />
                                <YAxis allowDecimals={false} />
                                <RechartsTooltip />
                                <Line
                                    type="monotone"
                                    dataKey="registros"
                                    stroke="#1890ff"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* Gráfico de barras de Estado de herramientas / equipo */}
                <Col xs={24} lg={12}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ textAlign: 'center', color: '#333' }}>{grafico.titulo}</h4>
                        
                        {/* Botones para alternar el gráfico de barras */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {['herramienta', 'empleado', 'vehiculo'].map(tipo => (
                                <Tag
                                    color={graficoActivo === tipo ? 'purple' : 'default'}
                                    key={tipo}
                                    style={{ cursor: 'pointer', fontSize: '14px', padding: '4px 12px', textTransform: 'capitalize' }}
                                    onClick={() => setGraficoActivo(tipo)}
                                >
                                    {tipo}
                                </Tag>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={grafico.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis allowDecimals={false} />
                                <RechartsTooltip />
                                <Legend />
                                <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                                    {grafico.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
