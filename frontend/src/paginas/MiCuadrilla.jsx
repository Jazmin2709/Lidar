import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Typography, List, Tag, Badge, Spin, Result, Button } from 'antd';
import { TeamOutlined, UserOutlined, EnvironmentOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const MiCuadrilla = () => {
    const [asignacion, setAsignacion] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAsignacion = async () => {
            try {
                const res = await axios.get(`${API_URL}/cuadrillas/mi-asignacion/${userId}`);
                setAsignacion(res.data);
            } catch (err) {
                console.error("Error fetching asignacion", err);
                setError(true);
            } finally {
                setCargando(false);
            }
        };

        if (userId) {
            fetchAsignacion();
        } else {
            setCargando(false);
        }
    }, [userId]);

    if (cargando) {
        return (
            <div style={{ padding: '100px', textAlign: 'center' }}>
                <Spin size="large" tip="Cargando tu asignación de hoy..." />
            </div>
        );
    }

    if (!asignacion || !asignacion.asignado) {
        return (
            <div style={{ padding: '50px' }}>
                <Result
                    status="info"
                    title="Aún no tienes una cuadrilla asignada"
                    subTitle="Si ya registraste tu asistencia, espera a que tu supervisor te asigne a un frente de trabajo."
                    extra={[
                        <Button type="primary" key="asistencia" onClick={() => window.location.href='/asistencia'}>
                            Marcar Asistencia
                        </Button>
                    ]}
                />
            </div>
        );
    }

    const { cuadrilla } = asignacion;

    return (
        <div style={{ padding: '40px 20px', maxWidth: 800, margin: '0 auto' }}>
            <Card 
                className="mi-cuadrilla-card"
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TeamOutlined style={{ fontSize: '24px', color: '#1a3c6d' }} />
                        <Title level={3} style={{ margin: 0 }}>Mi Cuadrilla Hoy</Title>
                    </div>
                }
                extra={<Tag color="green">ACTIVA</Tag>}
                style={{ borderRadius: '20px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)', overflow: 'hidden' }}
            >
                <div style={{ backgroundColor: '#f0f5ff', padding: '20px', borderRadius: '15px', marginBottom: '30px' }}>
                    <Title level={4} style={{ color: '#1a3c6d', marginBottom: '5px' }}>{cuadrilla.nombre}</Title>
                    <Tag color={cuadrilla.tipo === 'Normal' ? 'blue' : 'gold'} style={{ padding: '2px 10px', fontSize: '14px' }}>
                        {cuadrilla.tipo}
                    </Tag>
                    <div style={{ marginTop: '15px' }}>
                        <Text strong><UserOutlined /> Supervisor a cargo: </Text>
                        <Text>{cuadrilla.SupervisorNom} {cuadrilla.SupervisorApe}</Text>
                    </div>
                </div>

                <Title level={5}><TeamOutlined /> Compañeros de Equipo</Title>
                <List
                    dataSource={cuadrilla.companeros}
                    renderItem={item => (
                        <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Badge status="success" />
                                <Text>{item.Nombres} {item.Apellidos}</Text>
                            </div>
                        </List.Item>
                    )}
                    locale={{ emptyText: 'Estás trabajando solo en este frente.' }}
                />

                <div style={{ marginTop: '30px', padding: '15px', background: '#fffbe6', borderRadius: '10px', border: '1px solid #ffe58f' }}>
                    <Paragraph style={{ margin: 0 }}>
                        <InfoCircleOutlined style={{ color: '#faad14', marginRight: '8px' }} />
                        Recuerda que debes realizar el reporte <strong>Buddy Partner</strong> según la etapa en la que te encuentres.
                    </Paragraph>
                </div>
            </Card>
        </div>
    );
};

export default MiCuadrilla;
