// Importación de React y hooks
import React, { useEffect, useState } from 'react';
// Importación de axios para peticiones HTTP
import axios from 'axios';
// Importación de componentes de Ant Design para la UI
import { Table, Button, Input, Modal, Form, message, Alert } from 'antd';
// Icono de búsqueda
import { SearchOutlined } from '@ant-design/icons';
// Importación de estilos personalizados
import '../css/styles.css';
// Importación de moment para manejo de fechas
import moment from 'moment';
// Importación de Select de Ant Design
import { Select } from 'antd';
const { Option } = Select;

// Componente principal de Reportes
export default function Reportes() {

    const [buddyPartners, setBuddyPartners] = useState([]);
    const [pendingBuddies, setPendingBuddies] = useState([]);  // ⬅ NUEVO
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        fetchBuddyPartners();
    }, []);

    const fetchBuddyPartners = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner/');

            response.data.forEach(item => {
                item.Fecha = moment(item.Fecha).format('YYYY-MM-DD');
            });

            setBuddyPartners(response.data);

            // ==========================
            // 🔍 DETECTAR BUDDIES PENDIENTES
            // ==========================
            const hoy = moment().format("YYYY-MM-DD");

            const pendientes = response.data.filter(b =>
                (b.Est_etapa === "Inicio" || b.Est_etapa === "En proceso") &&
                b.Fecha < hoy
            );

            setPendingBuddies(pendientes);

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
            try {
                await axios.delete(`http://localhost:3000/api/buddy/BuddyPartner/${id}`);
                message.success('Reporte eliminado correctamente');
                fetchBuddyPartners();
            } catch (error) {
                console.error(error);
                message.error('Error al eliminar el reporte');
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            await axios.put(`http://localhost:3000/api/buddy/BuddyPartner/${editingRecord.id_buddy1}`, values);
            message.success('Reporte actualizado correctamente');
            setIsModalOpen(false);
            fetchBuddyPartners();
        } catch (error) {
            console.error(error);
            message.error('Error al actualizar el reporte');
        }
    };

    // Exportar PDF
    const exportPDF = () => {
        const queryParams = new URLSearchParams();
        if (activeFilters.Est_empl && activeFilters.Est_empl.length > 0)
            queryParams.append("Est_empl", activeFilters.Est_empl[0]);
        if (activeFilters.Est_vehi && activeFilters.Est_vehi.length > 0)
            queryParams.append("Est_vehi", activeFilters.Est_vehi[0]);
        if (activeFilters.Est_etapa && activeFilters.Est_etapa.length > 0)
            queryParams.append("Est_etapa", activeFilters.Est_etapa[0]);
        if (activeFilters.Fecha && activeFilters.Fecha.length > 0)
            queryParams.append("Fecha", activeFilters.Fecha[0]);

        const url = `http://localhost:3000/api/buddy/BuddyPartner/export-pdf?${queryParams.toString()}`;
        window.open(url, "_blank");
    };

    const exportExcel = () => {
        const queryParams = new URLSearchParams();
        if (activeFilters.Est_empl && activeFilters.Est_empl.length > 0)
            queryParams.append("Est_empl", activeFilters.Est_empl[0]);
        if (activeFilters.Est_vehi && activeFilters.Est_vehi.length > 0)
            queryParams.append("Est_vehi", activeFilters.Est_vehi[0]);
        if (activeFilters.Est_etapa && activeFilters.Est_etapa.length > 0)
            queryParams.append("Est_etapa", activeFilters.Est_etapa[0]);
        if (activeFilters.Fecha && activeFilters.Fecha.length > 0)
            queryParams.append("Fecha", activeFilters.Fecha[0]);

        const url = `http://localhost:3000/api/buddy/BuddyPartner/export-excel?${queryParams.toString()}`;
        window.open(url, "_blank");
    };

    const columns = [
        { title: 'Id', dataIndex: 'id_buddy1', key: 'id_buddy1', sorter: (a, b) => a.id_buddy1 - b.id_buddy1 },
        { title: 'Numero Cuadrilla', dataIndex: 'num_cuadrilla', key: 'num_cuadrilla' },
        { title: 'Hora', dataIndex: 'Hora_buddy', key: 'Hora_buddy' },
        {
            title: 'Estado Empleado', dataIndex: 'Est_empl', key: 'Est_empl',
            filters: [
                { text: 'Excelente', value: 'Excelente' },
                { text: 'Malo', value: 'Malo' },
            ],
            onFilter: (value, record) => record.Est_empl.includes(value),
        },
        {
            title: 'Estado Vehiculo', dataIndex: 'Est_vehi', key: 'Est_vehi',
            filters: [
                { text: 'Excelente', value: 'Excelente' },
                { text: 'Malo', value: 'Malo' },
            ],
            onFilter: (value, record) => record.Est_vehi.includes(value),
        },
        { title: 'Carnet', dataIndex: 'Carnet', key: 'Carnet' },
        { title: 'Tarjeta Vida', dataIndex: 'TarjetaVida', key: 'TarjetaVida' },
        {
            title: 'Fecha',
            dataIndex: 'Fecha',
            key: 'Fecha',
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
            title: 'Estado Etapa',
            dataIndex: 'Est_etapa',
            key: 'Est_etapa',
            filters: [
                { text: 'Inicio', value: 'Inicio' },
                { text: 'En proceso', value: 'En proceso' },
                { text: 'Finalizó', value: 'Finalizó' },
            ],
            onFilter: (value, record) => record.Est_etapa.includes(value),
        },
        {
            title: 'Estado Herramienta',
            dataIndex: 'Est_her',
            key: 'Est_her',
            filters: [
                { text: 'Excelente', value: 'Excelente' },
                { text: 'Malo', value: 'Malo' },
            ],
            onFilter: (value, record) => record.Est_her.includes(value),
        },
        { title: 'Id Empleado', dataIndex: 'id_empleado', key: 'id_empleado' },
        { title: 'Tipo', dataIndex: 'Tipo', key: 'Tipo' },
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

    const [renderTrigger, setRenderTrigger] = useState(false);

    return (
        <div style={{ padding: '0 40px' }}>

            <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Reportes</h1>

            {/* ================================================== */}
            {/* 🔔 ALERTA DE BUDDY PARTNERS PENDIENTES */}
            {/* ================================================== */}
            {pendingBuddies.length > 0 && (
                <Alert
                    message="Hay Buddy Partners pendientes de completar"
                    description={
                        <ul>
                            {pendingBuddies.map(b => (
                                <li key={b.id_buddy1}>
                                    Cuadrilla {b.num_cuadrilla} — Tipo {b.Tipo} — Fecha {b.Fecha}
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

            {/* Tabla */}
            <Table
                className="shadow rounded-5 border-3"
                columns={columns}
                dataSource={buddyPartners}
                rowKey="id_buddy1"
                pagination={{ pageSize: 10 }}
                onChange={(pagination, filters, sorter) => setActiveFilters(filters)}
            />

            {/* Modal */}
            <Modal
                title="Editar Reporte"
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Numero Cuadrilla" name="num_cuadrilla">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Hora" name="Hora_buddy">
                        <Input type="time" />
                    </Form.Item>

                    <Form.Item label="Estado Empleado" name="Est_empl">
                        <Select>
                            <Option value="Excelente">Excelente</Option>
                            <Option value="Bueno">Bueno</Option>
                            <Option value="Malo">Malo</Option>
                        </Select>
                    </Form.Item>

                    {form.getFieldValue("Est_empl") === "Malo" && (
                        <Form.Item label="Motivo empleado" name="MotivoEmp">
                            <Input.TextArea />
                        </Form.Item>
                    )}

                    <Form.Item label="Estado Vehiculo" name="Est_vehi">
                        <Select>
                            <Option value="Excelente">Excelente</Option>
                            <Option value="Bueno">Bueno</Option>
                            <Option value="Malo">Malo</Option>
                        </Select>
                    </Form.Item>

                    {form.getFieldValue("Est_vehi") === "Malo" && (
                        <Form.Item label="Motivo vehículo" name="MotivoVeh">
                            <Input.TextArea />
                        </Form.Item>
                    )}

                    <Form.Item label="Carnet" name="Carnet">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Tarjeta Vida" name="TarjetaVida">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Fecha" name="Fecha">
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item label="Estado Etapa" name="Est_etapa">
                        <Select>
                            <Option value="Inicio">Inicio</Option>
                            <Option value="En proceso">En proceso</Option>
                            <Option value="Finalizó">Finalizó</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Estado Herramienta" name="Est_her">
                        <Select>
                            <Option value="Excelente">Excelente</Option>
                            <Option value="Bueno">Bueno</Option>
                            <Option value="Malo">Malo</Option>
                        </Select>
                    </Form.Item>

                    {form.getFieldValue("Est_her") === "Malo" && (
                        <Form.Item label="Motivo herramienta" name="MotivoHer">
                            <Input.TextArea />
                        </Form.Item>
                    )}

                    <Form.Item label="Id Empleado" name="id_empleado">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Tipo" name="Tipo">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
