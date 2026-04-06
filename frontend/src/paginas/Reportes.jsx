import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Modal, Form, Alert, Upload, Select, Tag, Popover, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/Reportes.css';  // ← Nuevo CSS específico
import moment from 'moment';

const { Option } = Select;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_BASE_URL = `${API_URL}/buddy/BuddyPartner`;
const API_IMAGE_UPLOAD = `${API_URL}/imagenes/subir`;

const getStageInfo = (text, recordDate) => {
    let color = 'default';
    let message = '';

    if (text === 'Completado') {
        color = 'green';
        message = 'Jornada completa (Buddy Partner 1, 2 y 3 finalizados).';
    } else if (text === 'Inicio') {
        color = 'gold';
        message = 'Última etapa registrada: Buddy Partner 1 (Inicio).';
    } else if (text === 'En proceso') {
        color = 'blue';
        message = 'Última etapa registrada: Buddy Partner 2 (En proceso).';
    }

    const dias = moment().diff(moment(recordDate), 'days');
    if (dias > 1 && text !== 'Completado') {
        color = 'red';
        message += ` ¡ATRASO! Lleva ${dias} días sin avanzar. Completar la(s) etapa(s) pendiente(s) lo antes posible.`;
    }

    return { color, message };
};

export default function Reportes() {
    const [buddyPartners, setBuddyPartners] = useState([]);
    const [pendingBuddies, setPendingBuddies] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [activeFilters, setActiveFilters] = useState({});

    const [newFileTablero, setNewFileTablero] = useState(null);
    const [newFileCalentamiento, setNewFileCalentamiento] = useState(null);
    const [newFileCarnet, setNewFileCarnet] = useState(null);
    const [newFileTarjetaVida, setNewFileTarjetaVida] = useState(null);

    useEffect(() => {
        fetchBuddyPartners();
    }, []);

    const fetchBuddyPartners = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            const hoy = moment().format("YYYY-MM-DD");

            const groupedMap = {};

            response.data.forEach(item => {
                const fecha = moment(item.Fecha).format('YYYY-MM-DD');
                const key = `${item.num_cuadrilla}_${fecha}_${item.id_empleado}`;

                if (!groupedMap[key]) {
                    groupedMap[key] = {
                        key,
                        num_cuadrilla: item.num_cuadrilla,
                        Fecha: fecha,
                        id_empleado: item.id_empleado,
                        etapas: [],
                    };
                }

                groupedMap[key].etapas.push(item);
            });

            const groupedData = Object.values(groupedMap).map(group => {
                const etapas = group.etapas;

                const inicio = etapas.find(e => e.Tipo === 1) || {};
                const proceso = etapas.find(e => e.Tipo === 2) || {};
                const finalizo = etapas.find(e => e.Tipo === 3) || {};

                let estadoGeneral = 'Inicio';

                if (finalizo.id_buddy1) {
                    estadoGeneral = 'Finalizó';
                } else if (proceso.id_buddy1) {
                    estadoGeneral = 'En proceso';
                } else if (inicio.id_buddy1) {
                    estadoGeneral = 'Inicio';
                }

                if (inicio.id_buddy1 && proceso.id_buddy1 && finalizo.id_buddy1) {
                    estadoGeneral = 'Completado';
                }

                const ref = finalizo || proceso || inicio || {};

                const dias = moment().diff(moment(group.Fecha), 'days');
                const isPending = (estadoGeneral !== 'Completado' && dias > 1);

                return {
                    ...group,
                    ...ref,
                    Carnet: inicio.Carnet || '—',
                    TarjetaVida: inicio.TarjetaVida || '—',
                    Tablero: proceso.Tablero || '—',
                    Calentamiento: proceso.Calentamiento || '—',
                    Est_etapa: estadoGeneral,
                    isPending,
                    diasAtraso: dias > 1 ? dias : 0,
                    etapas
                };
            });

            setBuddyPartners(groupedData);

            const pendientes = groupedData.filter(g => g.isPending);
            setPendingBuddies(pendientes);

        } catch (error) {
            console.error("Error al cargar los reportes:", error);
        }
    };

    const uploadImage = async (file, preset, publicId) => {
        const formData = new FormData();
        formData.append("foto", file);
        formData.append("upload_preset", preset);
        formData.append("public_id", publicId);

        const response = await axios.post(API_IMAGE_UPLOAD, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.url;
    };

    const handleDelete = async (recordId) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${API_BASE_URL}/${recordId}`);
                Swal.fire({
                    title: "¡Eliminado!",
                    text: response.data.message || "El reporte ha sido eliminado correctamente.",
                    icon: "success",
                    confirmButtonColor: "#1677ff",
                });
                fetchBuddyPartners();
            } catch (error) {
                console.error("Error al eliminar el reporte:", error);
                Swal.fire({
                    title: "Error al eliminar",
                    text: error.response?.data?.message || "Ocurrió un error desconocido.",
                    icon: "error",
                    confirmButtonColor: "#1677ff",
                });
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
        setNewFileTablero(null);
        setNewFileCalentamiento(null);
        setNewFileCarnet(null);
        setNewFileTarjetaVida(null);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            let payload = { ...values };

            if (payload.Est_empl !== "Malo") payload.MotivoEmp = null;
            if (payload.Est_vehi !== "Malo") payload.MotivoVeh = null;
            if (payload.Est_her !== "Malo") payload.MotivoHer = null;

            const updateFile = async (newFileState, preset, fieldName) => {
                if (newFileState) {
                    const publicIdBase = `${payload.id_empleado || "anon"}_${Date.now()}`;
                    const url = await uploadImage(
                        newFileState,
                        preset,
                        `${fieldName.toLowerCase()}_edit_${publicIdBase}`
                    );
                    payload[fieldName] = url;
                }
            };

            if (editingRecord.Tipo === 1) {
                await updateFile(newFileCarnet, "Carnet", "Carnet");
                await updateFile(newFileTarjetaVida, "TarjetaVida", "TarjetaVida");
            }
            if (editingRecord.Tipo === 2) {
                await updateFile(newFileTablero, "tableros", "Tablero");
                await updateFile(newFileCalentamiento, "calentamientos", "Calentamiento");
            }

            const response = await axios.put(`${API_BASE_URL}/${editingRecord.id_buddy1}`, payload);

            Swal.fire({
                icon: "success",
                title: "¡Actualización Exitosa!",
                text: response.data.message || "El reporte ha sido guardado correctamente.",
                confirmButtonColor: "#1677ff",
            });

            setIsModalOpen(false);
            fetchBuddyPartners();

        } catch (error) {
            console.error("Error en la actualización:", error);
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: error.response?.data?.message || "Ocurrió un error desconocido al guardar el reporte.",
            });
        }
    };

    const exportPDF = () => {
        const queryParams = new URLSearchParams();
        Object.entries(activeFilters).forEach(([key, values]) => {
            if (values && values.length > 0) {
                queryParams.append(key, values[0]);
            }
        });

        const url = `${API_BASE_URL}/export-pdf?${queryParams.toString()}`;
        window.open(url, "_blank");
    };

    const exportExcel = () => {
        const queryParams = new URLSearchParams();
        Object.entries(activeFilters).forEach(([key, values]) => {
            if (values && values.length > 0) {
                queryParams.append(key, values[0]);
            }
        });

        const url = `${API_BASE_URL}/export-excel?${queryParams.toString()}`;
        window.open(url, "_blank");
    };

    const columns = [
        { title: 'Cuadrilla', dataIndex: 'num_cuadrilla', key: 'num_cuadrilla', width: 100 },
        {
            title: 'Fecha',
            dataIndex: 'Fecha',
            key: 'Fecha',
            width: 120,
            sorter: (a, b) => moment(b.Fecha).valueOf() - moment(a.Fecha).valueOf(),
            defaultSortOrder: 'descend',
            render: (text) => moment(text).format('YYYY-MM-DD'),
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        type="date"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        style={{ marginBottom: 8 }}
                    />
                    <Button type="primary" size="small" onClick={() => confirm()} icon={<SearchOutlined />}>Buscar</Button>
                    <Button size="small" onClick={() => clearFilters()} style={{ marginLeft: 8 }}>Limpiar</Button>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
            onFilter: (value, record) => record.Fecha.includes(value),
        },
        {
            title: 'Hora (Buddy)',
            dataIndex: 'Hora_buddy',
            key: 'Hora_buddy',
            width: 100,
            render: (text) => text || '—'
        },
        {
            title: 'Estado General',
            dataIndex: 'Est_etapa',
            key: 'Est_etapa',
            width: 180,
            filters: [
                { text: 'Completado', value: 'Completado' },
                { text: 'Inicio', value: 'Inicio' },
                { text: 'En proceso', value: 'En proceso' },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.Est_etapa === value,
            render: (text, record) => {
                const { color, message } = getStageInfo(text, record.Fecha);
                return (
                    <Popover title={`Estado: ${text}`} content={message}>
                        <Tag color={color} className="reportes-status-tag">
                            {text.toUpperCase()}
                        </Tag>
                    </Popover>
                );
            },
        },
        {
            title: 'Estado Empleado',
            dataIndex: 'Est_empl',
            key: 'Est_empl',
            width: 120,
            render: (text) => text ? (
                <Tag color={text === 'Malo' ? 'red' : text === 'Excelente' ? 'green' : 'blue'}>
                    {text.toUpperCase()}
                </Tag>
            ) : '—',
            filters: [{ text: 'Excelente', value: 'Excelente' }, { text: 'Malo', value: 'Malo' }],
            onFilter: (value, record) => record.Est_empl?.includes(value),
        },
        {
            title: 'Estado Vehículo',
            dataIndex: 'Est_vehi',
            key: 'Est_vehi',
            width: 120,
            render: (text) => text ? (
                <Tag color={text === 'Malo' ? 'red' : text === 'Excelente' ? 'green' : 'blue'}>
                    {text.toUpperCase()}
                </Tag>
            ) : '—',
            filters: [{ text: 'Excelente', value: 'Excelente' }, { text: 'Malo', value: 'Malo' }],
            onFilter: (value, record) => record.Est_vehi?.includes(value),
        },
        {
            title: 'Estado Herramienta',
            dataIndex: 'Est_her',
            key: 'Est_her',
            width: 120,
            render: (text) => text ? (
                <Tag color={text === 'Malo' ? 'red' : text === 'Excelente' ? 'green' : 'blue'}>
                    {text.toUpperCase()}
                </Tag>
            ) : '—',
            filters: [{ text: 'Excelente', value: 'Excelente' }, { text: 'Malo', value: 'Malo' }],
            onFilter: (value, record) => record.Est_her?.includes(value),
        },
        {
            title: 'Carnet (Inicio)',
            dataIndex: 'Carnet',
            key: 'Carnet',
            width: 100,
            render: (url) => url && url !== '—' ? (
                <img 
                    src={url} 
                    alt="Carnet" 
                    className="reportes-preview-image" 
                    onClick={() => window.open(url, '_blank')} 
                />
            ) : '—'
        },
        {
            title: 'Tarjeta Vida (Inicio)',
            dataIndex: 'TarjetaVida',
            key: 'TarjetaVida',
            width: 100,
            render: (url) => url && url !== '—' ? (
                <img 
                    src={url} 
                    alt="Tarjeta Vida" 
                    className="reportes-preview-image" 
                    onClick={() => window.open(url, '_blank')} 
                />
            ) : '—'
        },
        {
            title: 'Tablero (Proceso)',
            dataIndex: 'Tablero',
            key: 'Tablero',
            width: 100,
            render: (url) => url && url !== '—' ? (
                <img 
                    src={url} 
                    alt="Tablero" 
                    className="reportes-preview-image" 
                    onClick={() => window.open(url, '_blank')} 
                />
            ) : '—'
        },
        {
            title: 'Calentamiento (Proceso)',
            dataIndex: 'Calentamiento',
            key: 'Calentamiento',
            width: 120,
            render: (url) => url && url !== '—' ? (
                <img 
                    src={url} 
                    alt="Calentamiento" 
                    className="reportes-preview-image" 
                    onClick={() => window.open(url, '_blank')} 
                />
            ) : '—'
        },
        {
            title: 'Acciones',
            key: 'acciones',
            width: 280,
            fixed: 'right',
            render: (_, record) => {
                const { etapas } = record;
                const inicio = etapas.find(e => e.Tipo === 1);
                const proceso = etapas.find(e => e.Tipo === 2);
                const finalizo = etapas.find(e => e.Tipo === 3);

                const handleDeleteJornada = async () => {
                    const result = await Swal.fire({
                        title: '¿Eliminar toda la jornada?',
                        text: 'Se eliminarán las 3 etapas de esta cuadrilla y fecha.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Sí, eliminar todo',
                    });

                    if (result.isConfirmed) {
                        try {
                            if (inicio?.id_buddy1) await axios.delete(`${API_BASE_URL}/${inicio.id_buddy1}`);
                            if (proceso?.id_buddy1) await axios.delete(`${API_BASE_URL}/${proceso.id_buddy1}`);
                            if (finalizo?.id_buddy1) await axios.delete(`${API_BASE_URL}/${finalizo.id_buddy1}`);

                            Swal.fire('Eliminado', 'Jornada completa eliminada.', 'success');
                            fetchBuddyPartners();
                        } catch (err) {
                            Swal.fire('Error', 'No se pudo eliminar toda la jornada.', 'error');
                        }
                    }
                };

                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {inicio && <Button type="link" size="small" onClick={() => handleEdit(inicio)}>Editar Inicio</Button>}
                        {proceso && <Button type="link" size="small" onClick={() => handleEdit(proceso)}>Editar En proceso</Button>}
                        {finalizo && <Button type="link" size="small" onClick={() => handleEdit(finalizo)}>Editar Finalizó</Button>}
                        <Button type="link" danger size="small" onClick={handleDeleteJornada}>
                            Eliminar Jornada
                        </Button>
                    </div>
                );
            },
        },
    ];

    const getBeforeUploadHandler = (setNewFile) => (file) => {
        setNewFile(file);
        return false;
    };

    const FileUploadDisplay = ({ label, fieldName, newFileState, setNewFileState }) => {
        const currentUrl = editingRecord ? editingRecord[fieldName] : null;

        const previewUrl = newFileState ? URL.createObjectURL(newFileState) :
            (typeof currentUrl === 'string' && currentUrl.length > 5 && (currentUrl.startsWith('http') || currentUrl.startsWith('https')) ? currentUrl : null);

        const buttonText = newFileState ? `Cambiar ${label}: ${newFileState.name}` : `Seleccionar Nuevo ${label}`;

        return (
            <Form.Item label={`Imagen ${label}`}>
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={`Previsualización ${label}`}
                        className="reportes-preview-image"
                    />
                ) : (
                    <p className="reportes-no-image">No hay imagen de {label} actual.</p>
                )}

                <Upload
                    beforeUpload={getBeforeUploadHandler(setNewFileState)}
                    showUploadList={false}
                    accept="image/*"
                >
                    <Button type="default">{buttonText}</Button>
                </Upload>
                {newFileState && (
                    <p style={{ marginTop: 8, color: '#1677ff' }}>Archivo listo para subir: **{newFileState.name}**</p>
                )}
            </Form.Item>
        );
    };

    return (
        <div className="reportes-container">
            <h1 className="reportes-title">Reportes de Buddy Partners</h1>

            {pendingBuddies.length > 0 && (
                <Alert
                    className="reportes-alert"
                    message={`¡Alerta! Hay ${pendingBuddies.length} Buddy Partners pendientes o atrasados.`}
                    description={
                        <ul>
                            {pendingBuddies.map(b => (
                                <li key={b.key}>
                                    Cuadrilla <strong>{b.num_cuadrilla}</strong> —
                                    Fecha <strong>{moment(b.Fecha).format('YYYY-MM-DD')}</strong> —
                                    Estado: <strong>{b.Est_etapa}</strong> —
                                    <strong> ¡Buddy Partner(es) pendiente(s)! Completar las etapas faltantes lo antes posible.</strong>
                                    {b.diasAtraso > 0 && ` (atraso de ${b.diasAtraso} días)`}
                                </li>
                            ))}
                        </ul>
                    }
                    type="warning"
                    showIcon
                />
            )}

            <Space className="reportes-export-buttons">
                <Button type="primary" onClick={exportPDF}>
                    Exportar PDF
                </Button>
                <Button type="default" onClick={exportExcel}>
                    Exportar Excel
                </Button>
            </Space>

            <Table
                className="reportes-table shadow rounded-5 border-3"
                columns={columns}
                dataSource={buddyPartners}
                rowKey="key"
                pagination={{ pageSize: 10 }}
                onChange={(pagination, filters, sorter, extra) => setActiveFilters(filters)}
                scroll={{ x: 2200 }}
                expandable={{
                    expandedRowRender: (record) => {
                        if (record.Est_etapa !== 'Completado' || record.etapas.length !== 3) {
                            return <p style={{ padding: '16px', color: '#888' }}>No hay detalles adicionales para mostrar.</p>;
                        }

                        const etapasData = record.etapas.map(etapa => {
                            const motivos = [];
                            if (etapa.MotivoEmp) motivos.push(`Empleado: ${etapa.MotivoEmp}`);
                            if (etapa.MotivoVeh) motivos.push(`Vehículo: ${etapa.MotivoVeh}`);
                            if (etapa.MotivoHer) motivos.push(`Herramienta: ${etapa.MotivoHer}`);

                            return {
                                key: etapa.id_buddy1,
                                etapa: etapa.Tipo === 1 ? 'Inicio (Buddy Partner 1)' :
                                    etapa.Tipo === 2 ? 'En proceso (Buddy Partner 2)' :
                                        'Finalizó (Buddy Partner 3)',
                                est_empl: etapa.Est_empl || '—',
                                est_vehi: etapa.Est_vehi || '—',
                                est_her: etapa.Est_her || '—',
                                motivos: motivos.length > 0 ? motivos.join('\n') : '—',
                                imagen: etapa.Tipo === 1 ? (etapa.Carnet || etapa.TarjetaVida || '—') :
                                    etapa.Tipo === 2 ? (etapa.Tablero || etapa.Calentamiento || '—') : '—',
                            };
                        });

                        return (
                            <div className="reportes-expanded-content">
                                <h4 className="reportes-expanded-title">Detalles de las 3 fases (Completado)</h4>
                                <Table
                                    columns={[
                                        { title: 'Etapa', dataIndex: 'etapa', key: 'etapa', width: 180 },
                                        {
                                            title: 'Empleado', dataIndex: 'est_empl', key: 'est_empl', width: 120,
                                            render: (text) => text !== '—' ? <Tag color={text === 'Malo' ? 'red' : text === 'Excelente' ? 'green' : 'blue'}>{text}</Tag> : '—'
                                        },
                                        {
                                            title: 'Vehículo', dataIndex: 'est_vehi', key: 'est_vehi', width: 120,
                                            render: (text) => text !== '—' ? <Tag color={text === 'Malo' ? 'red' : text === 'Excelente' ? 'green' : 'blue'}>{text}</Tag> : '—'
                                        },
                                        {
                                            title: 'Herramienta', dataIndex: 'est_her', key: 'est_her', width: 120,
                                            render: (text) => text !== '—' ? <Tag color={text === 'Malo' ? 'red' : text === 'Excelente' ? 'green' : 'blue'}>{text}</Tag> : '—'
                                        },
                                        {
                                            title: 'Motivos',
                                            dataIndex: 'motivos',
                                            key: 'motivos',
                                            width: 250,
                                            render: (text) => text !== '—' ? (
                                                <div style={{ whiteSpace: 'pre-line', lineHeight: '1.4' }}>{text}</div>
                                            ) : '—'
                                        },
                                        {
                                            title: 'Imagen', dataIndex: 'imagen', key: 'imagen', width: 100,
                                            render: (url) => url && url !== '—' ? (
                                                <img
                                                    src={url}
                                                    alt="Imagen de etapa"
                                                    className="reportes-preview-image"
                                                    onClick={() => window.open(url, '_blank')}
                                                />
                                            ) : '—'
                                        },
                                    ]}
                                    dataSource={etapasData}
                                    pagination={false}
                                    size="small"
                                    bordered
                                />
                            </div>
                        );
                    },
                    rowExpandable: (record) => record.Est_etapa === 'Completado' && record.etapas.length === 3,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        record.Est_etapa === 'Completado' && record.etapas.length === 3 ? (
                            <Popover content={expanded ? 'Ocultar detalles de las 3 fases' : 'Ver detalles de las 3 fases'}>
                                <span
                                    className="reportes-expand-icon"
                                    onClick={e => onExpand(record, e)}
                                >
                                    {expanded ? '▼' : '▶'}
                                </span>
                            </Popover>
                        ) : null,
                }}
            />

            <Modal
                title="Editar Reporte"
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Guardar"
                cancelText="Cancelar"
                width={800}
                className="reportes-modal"
            >
                <Form
                    form={form}
                    layout="vertical"
                    key={editingRecord ? editingRecord.id_buddy1 : 'new'}
                >
                    <Form.Item label="Numero Cuadrilla" name="num_cuadrilla"><Input disabled /></Form.Item>
                    <Form.Item label="Hora" name="Hora_buddy"><Input type="time" /></Form.Item>

                    <Form.Item label="Estado Empleado" name="Est_empl">
                        <Select onChange={() => form.setFieldsValue({ MotivoEmp: null })}>
                            <Option value="Excelente">Excelente</Option>
                            <Option value="Bueno">Bueno</Option>
                            <Option value="Malo">Malo</Option>
                        </Select>
                    </Form.Item>
                    {Form.useWatch("Est_empl", form) === "Malo" && (
                        <Form.Item label="Motivo empleado" name="MotivoEmp"><Input.TextArea /></Form.Item>
                    )}

                    <Form.Item label="Estado Vehiculo" name="Est_vehi">
                        <Select onChange={() => form.setFieldsValue({ MotivoVeh: null })}>
                            <Option value="Excelente">Excelente</Option>
                            <Option value="Bueno">Bueno</Option>
                            <Option value="Malo">Malo</Option>
                        </Select>
                    </Form.Item>
                    {Form.useWatch("Est_vehi", form) === "Malo" && (
                        <Form.Item label="Motivo vehículo" name="MotivoVeh"><Input.TextArea /></Form.Item>
                    )}

                    {Form.useWatch("Tipo", form) === 1 && (
                        <>
                            <h3 style={{ marginTop: 20 }}>Documentos (Buddy Partner 1)</h3>
                            <FileUploadDisplay label="Carnet" fieldName="Carnet" newFileState={newFileCarnet} setNewFileState={setNewFileCarnet} />
                            <FileUploadDisplay label="Tarjeta Vida" fieldName="TarjetaVida" newFileState={newFileTarjetaVida} setNewFileState={setNewFileTarjetaVida} />
                        </>
                    )}

                    <Form.Item label="Fecha" name="Fecha"><Input type="date" /></Form.Item>
                    <Form.Item label="Estado Etapa" name="Est_etapa">
                        <Select>
                            <Option value="Inicio">Inicio</Option>
                            <Option value="En proceso">En proceso</Option>
                            <Option value="Finalizó">Finalizó</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Estado Herramienta" name="Est_her">
                        <Select onChange={() => form.setFieldsValue({ MotivoHer: null })}>
                            <Option value="Excelente">Excelente</Option>
                            <Option value="Bueno">Bueno</Option>
                            <Option value="Malo">Malo</Option>
                        </Select>
                    </Form.Item>
                    {Form.useWatch("Est_her", form) === "Malo" && (
                        <Form.Item label="Motivo herramienta" name="MotivoHer"><Input.TextArea /></Form.Item>
                    )}

                    <Form.Item label="Id Empleado" name="id_empleado"><Input disabled /></Form.Item>
                    <Form.Item label="Tipo" name="Tipo"><Input disabled /></Form.Item>

                    {Form.useWatch("Tipo", form) === 2 && (
                        <>
                            <h3 style={{ marginTop: 20 }}>Evidencias (Buddy Partner 2)</h3>
                            <FileUploadDisplay label="Tablero" fieldName="Tablero" newFileState={newFileTablero} setNewFileState={setNewFileTablero} />
                            <FileUploadDisplay label="Calentamiento" fieldName="Calentamiento" newFileState={newFileCalentamiento} setNewFileState={setNewFileCalentamiento} />
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
}