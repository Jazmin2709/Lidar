import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Card, Row, Col, Typography, List, Checkbox, 
    Button, Select, Input, Tag, Badge, message, Modal, Tooltip,
    Avatar, Image, Space
} from 'antd';
import { 
    TeamOutlined, UserOutlined, PlusOutlined, 
    SafetyOutlined, ThunderboltOutlined, RocketOutlined,
    EnvironmentOutlined, EyeOutlined
} from '@ant-design/icons';
import Swal from 'sweetalert2';

const { Title, Text } = Typography;
const { Option } = Select;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const GestionCuadrillas = () => {
    const [disponibles, setDisponibles] = useState([]);
    const [cuadrillas, setCuadrillas] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [nombreCuadrilla, setNombreCuadrilla] = useState('');
    const [tipoCuadrilla, setTipoCuadrilla] = useState('Normal');
    const [cargando, setCargando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [detalleCuadrilla, setDetalleCuadrilla] = useState(null);
    const [modalDetalleVisible, setModalDetalleVisible] = useState(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [dispRes, cuadRes] = await Promise.all([
                axios.get(`${API_URL}/cuadrillas/disponibles`),
                axios.get(`${API_URL}/cuadrillas/dia`)
            ]);
            setDisponibles(dispRes.data);
            setCuadrillas(cuadRes.data);
        } catch (error) {
            console.error("Error al cargar datos de cuadrillas", error);
            message.error("Error al sincronizar datos");
        }
    };

    const crearCuadrilla = async () => {
        if (!nombreCuadrilla || seleccionados.length === 0) {
            message.warning("Debes dar un nombre y seleccionar al menos un empleado.");
            return;
        }

        setCargando(true);
        try {
            await axios.post(`${API_URL}/cuadrillas/crear`, {
                nombre: nombreCuadrilla,
                tipo: tipoCuadrilla,
                id_supervisor: userId,
                miembros: seleccionados
            });

            Swal.fire('¡Éxito!', `La cuadrilla ${nombreCuadrilla} ha sido asignada.`, 'success');
            
            // Reset
            setNombreCuadrilla('');
            setTipoCuadrilla('Normal');
            setSeleccionados([]);
            setModalVisible(false);
            cargarDatos();
        } catch (error) {
            console.error("Error al crear cuadrilla", error);
            message.error("No se pudo crear la cuadrilla.");
        } finally {
            setCargando(false);
        }
    };

    const toggleSeleccion = (id) => {
        if (seleccionados.includes(id)) {
            setSeleccionados(seleccionados.filter(sid => sid !== id));
        } else {
            setSeleccionados([...seleccionados, id]);
        }
    };

    const getIconoTipo = (tipo) => {
        switch(tipo) {
            case 'MMS': return <ThunderboltOutlined style={{ color: '#faad14' }} />;
            case 'AEROLASER': return <RocketOutlined style={{ color: '#1890ff' }} />;
            case 'BACKPACK': return <SafetyOutlined style={{ color: '#52c41a' }} />;
            default: return <TeamOutlined style={{ color: '#1a3c6d' }} />;
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Gestión de Cuadrillas</Title>
                    <Text type="secondary">Asigna personal que ya marcó asistencia a los frentes de trabajo.</Text>
                </div>
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    size="large" 
                    onClick={() => setModalVisible(true)}
                    style={{ borderRadius: '8px', height: '45px' }}
                >
                    Nueva Cuadrilla
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {/* Panel de Cuadrillas Actuales */}
                <Col xs={24} lg={16}>
                    <Card title={<Title level={4} style={{ margin: 0 }}>Cuadrillas del Día</Title>} style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        {cuadrillas.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <TeamOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                                <p style={{ marginTop: '15px' }}>No hay cuadrillas creadas para hoy todavía.</p>
                            </div>
                        ) : (
                            <Row gutter={[16, 16]}>
                                {cuadrillas.map(c => (
                                    <Col xs={24} md={12} key={c.id_cuadrilla}>
                                        <Card 
                                            hoverable 
                                            size="small"
                                            style={{ 
                                                borderRadius: '12px', 
                                                borderLeft: `5px solid ${c.tipo === 'Normal' ? '#1a3c6d' : '#faad14'}`,
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => {
                                                setDetalleCuadrilla(c);
                                                setModalDetalleVisible(true);
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <Title level={5} style={{ margin: 0 }}>{c.nombre}</Title>
                                                    <Space>
                                                        <Tag color={c.tipo === 'Normal' ? 'blue' : 'orange'} style={{ margin: 0 }}>
                                                            {getIconoTipo(c.tipo)} {c.tipo}
                                                        </Tag>
                                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                                            {c.miembros.length} personal
                                                        </Text>
                                                    </Space>
                                                </div>
                                                <Button type="link" icon={<EyeOutlined />} />
                                            </div>
                                            
                                            <Avatar.Group
                                                maxCount={4}
                                                size="small"
                                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                                style={{ marginTop: '15px' }}
                                            >
                                                {c.miembros.map(m => (
                                                    <Tooltip title={`${m.Nombres} ${m.Apellidos}`} key={m.id_per}>
                                                        <Avatar src={m.foto_url} icon={<UserOutlined />} />
                                                    </Tooltip>
                                                ))}
                                            </Avatar.Group>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card>
                </Col>

                {/* Panel de Disponibles (Sidebar rápido) */}
                <Col xs={24} lg={8}>
                    <Card 
                        title={<Title level={4} style={{ margin: 0 }}>Personal Disponible ({disponibles.length})</Title>} 
                        extra={<Tooltip title="Sólo aparecen quienes ya marcaron asistencia"><Badge status="processing" /></Tooltip>}
                        style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    >
                        <List
                            dataSource={disponibles}
                            renderItem={item => (
                                <List.Item 
                                    style={{ padding: '12px 10px', borderRadius: '8px', marginBottom: '8px', backgroundColor: '#f9f9f9', border: '1px solid #eee' }}
                                    actions={[
                                        <Tooltip title="Ver Ubicación">
                                            <Button 
                                                type="text" 
                                                icon={<EnvironmentOutlined style={{ color: '#ff4d4f' }} />} 
                                                onClick={() => window.open(`https://www.google.com/maps?q=${item.latitud},${item.longitud}`, '_blank')}
                                            />
                                        </Tooltip>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <Badge status="success" offset={[-2, 32]}>
                                                <Image
                                                    width={45}
                                                    height={45}
                                                    src={item.foto_url}
                                                    fallback="https://via.placeholder.com/45?text=User"
                                                    style={{ borderRadius: '8px', objectFit: 'cover' }}
                                                    preview={{
                                                        mask: <EyeOutlined />,
                                                        maskClassName: 'rounded-8'
                                                    }}
                                                />
                                            </Badge>
                                        }
                                        title={<Text strong>{item.Nombres} {item.Apellidos}</Text>}
                                        description={
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>Entrada: {item.hora_asistencia}</Text>
                                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                                    GPS: {item.latitud ? Number(item.latitud).toFixed(4) : '0.0000'}, {item.longitud ? Number(item.longitud).toFixed(4) : '0.0000'}
                                                </Text>
                                            </Space>
                                        }
                                    />
                                </List.Item>
                            )}
                            style={{ maxHeight: '450px', overflowY: 'auto' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Modal para Crear Cuadrilla */}
            <Modal
                title="Configurar Nueva Cuadrilla"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
                style={{ borderRadius: '20px' }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <div style={{ marginBottom: '15px' }}>
                            <Text strong>Nombre de Cuadrilla (Ej: Cuadrilla 10)</Text>
                            <Input 
                                placeholder="Ingresa el nombre o número" 
                                value={nombreCuadrilla} 
                                onChange={(e) => setNombreCuadrilla(e.target.value)}
                                style={{ marginTop: '5px' }}
                            />
                        </div>
                    </Col>
                    <Col span={12}>
                        <div style={{ marginBottom: '15px' }}>
                            <Text strong>Tipo de Cuadrilla</Text>
                            <Select 
                                style={{ width: '100%', marginTop: '5px' }} 
                                value={tipoCuadrilla} 
                                onChange={setTipoCuadrilla}
                            >
                                <Option value="Normal">Normal</Option>
                                <Option value="MMS">MMS</Option>
                                <Option value="AEROLASER">AEROLASER</Option>
                                <Option value="BACKPACK">BACKPACK</Option>
                            </Select>
                        </div>
                    </Col>
                </Row>

                <div style={{ marginBottom: '20px' }}>
                    <Text strong>Seleccionar Miembros ({seleccionados.length} seleccionados):</Text>
                    <div style={{ 
                        marginTop: '10px', 
                        maxHeight: '300px', 
                        overflowY: 'auto', 
                        border: '1px solid #eee', 
                        padding: '10px',
                        borderRadius: '8px' 
                    }}>
                        {disponibles.length === 0 ? (
                            <Text type="secondary">No hay personal disponible para asignar.</Text>
                        ) : (
                            <Row>
                                {disponibles.map(d => (
                                    <Col span={12} key={d.id_per}>
                                        <Checkbox 
                                            checked={seleccionados.includes(d.id_per)}
                                            onChange={() => toggleSeleccion(d.id_per)}
                                            style={{ marginBottom: '8px' }}
                                        >
                                            {d.Nombres} {d.Apellidos}
                                        </Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <Button onClick={() => setModalVisible(false)} style={{ marginRight: '10px' }}>Cancelar</Button>
                    <Button 
                        type="primary" 
                        loading={cargando} 
                        onClick={crearCuadrilla}
                        disabled={!nombreCuadrilla || seleccionados.length === 0}
                    >
                        Asignar Cuadrilla Ahora
                    </Button>
                </div>
            </Modal>
            {/* Modal para Ver Detalles de Cuadrilla */}
            <Modal
                title={detalleCuadrilla ? `Integrantes de: ${detalleCuadrilla.nombre}` : 'Detalles'}
                open={modalDetalleVisible}
                onCancel={() => setModalDetalleVisible(false)}
                footer={[
                    <Button key="close" type="primary" onClick={() => setModalDetalleVisible(false)}>
                        Cerrar
                    </Button>
                ]}
                width={600}
                style={{ borderRadius: '20px' }}
            >
                {detalleCuadrilla && (
                    <List
                        itemLayout="horizontal"
                        dataSource={detalleCuadrilla.miembros}
                        renderItem={m => (
                            <List.Item
                                actions={[
                                    <Tooltip title="Ubicación de registro">
                                        <Button 
                                            type="text" 
                                            icon={<EnvironmentOutlined style={{ color: '#ff4d4f' }} />} 
                                            onClick={() => window.open(`https://www.google.com/maps?q=${m.latitud},${m.longitud}`, '_blank')}
                                        />
                                    </Tooltip>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Image
                                            width={50}
                                            height={50}
                                            src={m.foto_url}
                                            style={{ borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                    }
                                    title={<Text strong>{m.Nombres} {m.Apellidos}</Text>}
                                    description={<Text type="secondary">Asistencia: {m.hora_asistencia || '—'}</Text>}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </Modal>
        </div>
    );
};

export default GestionCuadrillas;
