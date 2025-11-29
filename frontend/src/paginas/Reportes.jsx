import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Modal, Form, Alert, Upload, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/styles.css';
import moment from 'moment';

const { Option } = Select;
const API_BASE_URL = 'http://localhost:3000/api/buddy/BuddyPartner';
const API_IMAGE_UPLOAD = 'http://localhost:3000/api/imagenes/subir';

/**
 * Componente principal para la gestión y visualización de Reportes (Buddy Partners).
 * @returns {JSX.Element} El componente Reportes
 */
export default function Reportes() {
    // 1. Estados principales para la data y UI
    const [buddyPartners, setBuddyPartners] = useState([]);
    const [pendingBuddies, setPendingBuddies] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [activeFilters, setActiveFilters] = useState({});

    // 2. ESTADOS para manejar los nuevos archivos a subir durante la edición
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

            const data = response.data.map(item => {
                const Fecha = moment(item.Fecha).format('YYYY-MM-DD');
                const isPending = (item.Est_etapa === "Inicio" || item.Est_etapa === "En proceso") && Fecha < hoy;

                return {
                    ...item,
                    Fecha,
                    isPending
                };
            });

            setBuddyPartners(data);

            const pendientes = data.filter(b => b.isPending);
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
        // Resetear estados de archivos al abrir el modal para evitar confusiones
        setNewFileTablero(null);
        setNewFileCalentamiento(null);
        setNewFileCarnet(null);
        setNewFileTarjetaVida(null);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            let payload = { ...values };

            // 1. Limpieza de motivos si el estado no es 'Malo'
            if (payload.Est_empl !== "Malo") payload.MotivoEmp = null;
            if (payload.Est_vehi !== "Malo") payload.MotivoVeh = null;
            if (payload.Est_her !== "Malo") payload.MotivoHer = null;

            // 2. Función genérica para subir un archivo si existe uno nuevo
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

            // 3. Manejar subida de imágenes - CONDICIONAL para Carnet/Tarjeta Vida (Tipo 1)
            // Si el registro es de Tipo 1, permite subir las imágenes, si no, mantiene el valor existente o ""
            if (editingRecord.Tipo === 1) {
                await updateFile(newFileCarnet, "Carnet", "Carnet");
                await updateFile(newFileTarjetaVida, "TarjetaVida", "TarjetaVida");
            } else {
                // Si no es Tipo 1, nos aseguramos de no enviar los archivos nuevos
                // y mantenemos el valor actual de Carnet/TarjetaVida que ya está en 'payload'
            }

            // Manejar subida de imágenes - CONDICIONAL para Tablero/Calentamiento (Tipo 2)
            if (editingRecord.Tipo === 2) {
                await updateFile(newFileTablero, "tableros", "Tablero");
                await updateFile(newFileCalentamiento, "calentamientos", "Calentamiento");
            } else {
                // Si no es Tipo 2, mantenemos el valor actual de Tablero/Calentamiento que ya está en 'payload'
            }


            // 4. Enviar la actualización al backend
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


    // Configuración de las columnas de la tabla de Ant Design (Sin cambios aquí)
    const columns = [
        { title: 'Id', dataIndex: 'id_buddy1', key: 'id_buddy1', sorter: (a, b) => a.id_buddy1 - b.id_buddy1 },
        { title: 'Numero Cuadrilla', dataIndex: 'num_cuadrilla', key: 'num_cuadrilla' },
        { title: 'Hora', dataIndex: 'Hora_buddy', key: 'Hora_buddy' },
        {
            title: 'Estado Empleado', dataIndex: 'Est_empl', key: 'Est_empl',
            filters: [{ text: 'Excelente', value: 'Excelente' }, { text: 'Malo', value: 'Malo' }],
            onFilter: (value, record) => record.Est_empl.includes(value),
        },
        {
            title: 'Estado Vehiculo', dataIndex: 'Est_vehi', key: 'Est_vehi',
            filters: [{ text: 'Excelente', value: 'Excelente' }, { text: 'Malo', value: 'Malo' }],
            onFilter: (value, record) => record.Est_vehi.includes(value),
        },
        {
            title: 'Carnet', dataIndex: 'Carnet', key: 'Carnet',
            render: (url) => (typeof url === 'string' && url.length > 5 && (url.startsWith('http') || url.startsWith('https'))
                ? (<img src={url} alt="Carnet" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />)
                : '—')
        },
        {
            title: 'Tarjeta Vida', dataIndex: 'TarjetaVida', key: 'TarjetaVida',
            render: (url) => (typeof url === 'string' && url.length > 5 && (url.startsWith('http') || url.startsWith('https'))
                ? (<img src={url} alt="Tarjeta Vida" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />)
                : '—')
        },
        {
            title: 'Fecha', dataIndex: 'Fecha', key: 'Fecha',
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
            title: 'Estado Etapa', dataIndex: 'Est_etapa', key: 'Est_etapa',
            filters: [{ text: 'Inicio', value: 'Inicio' }, { text: 'En proceso', value: 'En proceso' }, { text: 'Finalizó', value: 'Finalizó' }],
            onFilter: (value, record) => record.Est_etapa.includes(value),
        },
        {
            title: 'Estado Herramienta', dataIndex: 'Est_her', key: 'Est_her',
            filters: [{ text: 'Excelente', value: 'Excelente' }, { text: 'Malo', value: 'Malo' }],
            onFilter: (value, record) => record.Est_her.includes(value),
        },
        // Columnas de Motivos
        { title: 'Motivo Emp', dataIndex: 'MotivoEmp', key: 'MotivoEmp' },
        { title: 'Motivo Veh', dataIndex: 'MotivoVeh', key: 'MotivoVeh' },
        { title: 'Motivo Her', dataIndex: 'MotivoHer', key: 'MotivoHer' },
        // Columnas de Imágenes Tablero y Calentamiento
        {
            title: 'Tablero', dataIndex: 'Tablero', key: 'Tablero',
            render: (url) => url ? (<img src={url} alt="tablero" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />) : '—'
        },
        {
            title: 'Calentamiento', dataIndex: 'Calentamiento', key: 'Calentamiento',
            render: (url) => url ? (<img src={url} alt="calentamiento" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }} onClick={() => window.open(url, '_blank')} />) : '—'
        },
        // Columnas de metadatos
        { title: 'Id Empleado', dataIndex: 'id_empleado', key: 'id_empleado' },
        { title: 'Tipo', dataIndex: 'Tipo', key: 'Tipo' },
        // Columna de Acciones (Editar/Eliminar)
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id_buddy1)}>Eliminar</Button>
                </>
            ),
        },
    ];

    const getBeforeUploadHandler = (setNewFile) => (file) => {
        setNewFile(file);
        return false;
    };

    /**
     * Componente de visualización y subida de archivo reutilizable para el Modal.
     */
    const FileUploadDisplay = ({ label, fieldName, newFileState, setNewFileState }) => {
        const currentUrl = editingRecord ? editingRecord[fieldName] : null;

        const previewUrl = newFileState ? URL.createObjectURL(newFileState) :
            (typeof currentUrl === 'string' && currentUrl.length > 5 && (currentUrl.startsWith('http') || currentUrl.startsWith('https')) ? currentUrl : null);

        const buttonText = newFileState ? `Cambiar ${label}: ${newFileState.name}` : `Seleccionar Nuevo ${label}`;

        return (
            <Form.Item label={`Imagen ${label}`}>
                {/* 1. Vista previa de la imagen */}
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={`Previsualización ${label}`}
                        style={{ width: "100%", maxHeight: "350px", objectFit: "contain", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "10px" }}
                    />
                ) : (
                    <p style={{ color: "#888", marginBottom: 10 }}>No hay imagen de {label} actual.</p>
                )}

                {/* 2. Componente de subida de archivo */}
                <Upload
                    beforeUpload={getBeforeUploadHandler(setNewFileState)}
                    showUploadList={false}
                    accept="image/*"
                >
                    <Button type="default">{buttonText}</Button>
                </Upload>
                {/* Mensaje de archivo listo para subir */}
                {newFileState && (
                    <p style={{ marginTop: 8, color: '#1677ff' }}>Archivo listo para subir: **{newFileState.name}**</p>
                )}
            </Form.Item>
        );
    };

    return (
        <div style={{ padding: '0 50px 50px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Reportes</h1>

            {/* 🔔 ALERTA DE BUDDY PARTNERS PENDIENTES */}
            {pendingBuddies.length > 0 && (
                <Alert
                    message="Hay Buddy Partners pendientes de completar"
                    description={
                        <ul>
                            {pendingBuddies.map(b => (
                                <li key={b.id_buddy1}>
                                    Cuadrilla **{b.num_cuadrilla}** — Tipo **{b.Tipo}** — Fecha **{b.Fecha}**
                                </li>
                            ))}
                        </ul>
                    }
                    type="warning"
                    showIcon
                    style={{ marginBottom: 20 }}
                />
            )}

            {/* Botones exportar */}
            <Button type="primary" onClick={exportPDF} style={{ marginBottom: 16 }}>
                Exportar PDF
            </Button>
            <Button type="default" onClick={exportExcel} style={{ marginLeft: 10, marginBottom: 16 }}>
                Exportar Excel
            </Button>

            {/* Tabla de Reportes */}
            <Table
                className="shadow rounded-5 border-3"
                columns={columns}
                dataSource={buddyPartners}
                rowKey="id_buddy1"
                pagination={{ pageSize: 10 }}
                onChange={(pagination, filters, sorter, extra) => setActiveFilters(filters)}
                rowClassName={(record) => {
                    if (record.isPending) return "row-pendiente";

                    if (record.Est_etapa === "Inicio") return "estado-inicio";
                    if (record.Est_etapa === "En proceso") return "estado-proceso";
                    if (record.Est_etapa === "Finalizó") return "estado-finalizo";

                    return "";
                }}
            />

            {/* Modal de Edición */}
            <Modal
                title="Editar Reporte"
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form
                    form={form}
                    layout="vertical"
                    key={editingRecord ? editingRecord.id_buddy1 : 'new'}
                >
                    {/* Campos de texto y selección básicos */}
                    <Form.Item label="Numero Cuadrilla" name="num_cuadrilla"><Input disabled /></Form.Item>
                    <Form.Item label="Hora" name="Hora_buddy"><Input type="time" /></Form.Item>

                    {/* Estado Empleado y Motivo (condicional) */}
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

                    {/* Estado Vehículo y Motivo (condicional) */}
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

                    {/* 🎯 SECCIÓN DE IMÁGENES (Tipo 1) para Carnet y Tarjeta Vida (CONDICIONAL) */}
                    {Form.useWatch("Tipo", form) === 1 && (
                        <>
                            <FileUploadDisplay
                                label="Carnet"
                                fieldName="Carnet"
                                newFileState={newFileCarnet}
                                setNewFileState={setNewFileCarnet}
                            />

                            <FileUploadDisplay
                                label="Tarjeta Vida"
                                fieldName="TarjetaVida"
                                newFileState={newFileTarjetaVida}
                                setNewFileState={setNewFileTarjetaVida}
                            />
                        </>
                    )}

                    {/* Campos de fecha y estado de etapa/herramienta */}
                    <Form.Item label="Fecha" name="Fecha"><Input type="date" /></Form.Item>
                    <Form.Item label="Estado Etapa" name="Est_etapa">
                        <Select>
                            <Option value="Inicio">Inicio</Option>
                            <Option value="En proceso">En proceso</Option>
                            <Option value="Finalizó">Finalizó</Option>
                        </Select>
                    </Form.Item>

                    {/* Estado Herramienta y Motivo (condicional) */}
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

                    {/* 🎯 SECCIÓN DE IMÁGENES (Tipo 2) para Tablero y Calentamiento (condicional) */}
                    {Form.useWatch("Tipo", form) === 2 && (
                        <>
                            <FileUploadDisplay
                                label="Tablero"
                                fieldName="Tablero"
                                newFileState={newFileTablero}
                                setNewFileState={setNewFileTablero}
                            />
                            <FileUploadDisplay
                                label="Calentamiento"
                                fieldName="Calentamiento"
                                newFileState={newFileCalentamiento}
                                setNewFileState={setNewFileCalentamiento}
                            />
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
}