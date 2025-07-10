import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Modal, Form, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/styles.css';
import moment from 'moment';
import { Select } from 'antd';
const { Option } = Select;


export default function Reportes() {
    const [buddyPartners, setBuddyPartners] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

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

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id_buddy1',
            key: 'id_buddy1',
            sorter: (a, b) => a.id_buddy1 - b.id_buddy1,
        },
        {
            title: 'Numero Cuadrilla',
            dataIndex: 'num_cuadrilla',
            key: 'num_cuadrilla',
            sorter: (a, b) => a.num_cuadrilla - b.num_cuadrilla,
        },
        {
            title: 'Hora',
            dataIndex: 'Hora_buddy',
            key: 'Hora_buddy',
            sorter: (a, b) => a.Hora_buddy.localeCompare(b.Hora_buddy),
        },
        {
            title: 'Estado Empleado',
            dataIndex: 'Est_empl',
            key: 'Est_empl',
            filters: [
                { text: 'Excelente', value: 'Excelente' },
                { text: 'Malo', value: 'Malo' },
            ],
            onFilter: (value, record) => record.Est_empl.includes(value),
        },
        {
            title: 'Estado Vehiculo',
            dataIndex: 'Est_vehi',
            key: 'Est_vehi',
            filters: [
                { text: 'Excelente', value: 'Excelente' },
                { text: 'Malo', value: 'Malo' },
            ],
            onFilter: (value, record) => record.Est_vehi.includes(value),
        },
        {
            title: 'Carnet',
            dataIndex: 'Carnet',
            key: 'Carnet',
        },
        {
            title: 'Tarjeta Vida',
            dataIndex: 'TarjetaVida',
            key: 'TarjetaVida',
        },
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
                        onPressEnter={() => confirm()}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                    >
                        Buscar
                    </Button>
                    <Button
                        size="small"
                        onClick={() => {
                            clearFilters();
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        Limpiar
                    </Button>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
            onFilter: (value, record) =>
                record.Fecha ? record.Fecha.includes(value) : '',
        },
        {
            title: 'Estado Etapa',
            dataIndex: 'Est_etapa',
            key: 'Est_etapa',
            filters: [
                { text: 'Iniciando', value: 'Iniciando' },
                { text: 'En proceso', value: 'En proceso' },
                { text: 'Finalizado', value: 'Finalizado' },
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
            onFilter: (value, record) => record.Est_vehi.includes(value),
        },
        {
            title: 'Id Empleado',
            dataIndex: 'id_empleado',
            key: 'id_empleado',
        },
        {
            title: 'Tipo',
            dataIndex: 'Tipo',
            key: 'Tipo',
        },
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
            <Table
                className="shadow rounded-5 border-3"
                columns={columns}
                dataSource={buddyPartners}
                rowKey="id_buddy1"
                pagination={{ pageSize: 10 }}
            />

            {/* Modal de edición */}
            <Modal
                title="Editar Reporte"
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Guardar"
                cancelText="Cancelar"
            >
                <Form form={form} layout="vertical" onValuesChange={() => setRenderTrigger((prev) => !prev)}>
                    <Form.Item label="Numero Cuadrilla" name="num_cuadrilla">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Hora" name="Hora_buddy">
                        <Input type="time" />
                    </Form.Item>

                    <Form.Item label="Estado Empleado" name="Est_empl">
                        <Select onChange={value => form.setFieldValue("Est_empl", value)}>
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
                        <Select onChange={value => form.setFieldValue("Est_vehi", value)}>
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
                        <Select onChange={value => form.setFieldValue("Est_etapa", value)}>
                            <Option value="Inicio">Inicio</Option>
                            <Option value="En proceso">En proceso</Option>
                            <Option value="Finalizó">Finalizó</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Estado Herramienta" name="Est_her">
                        <Select onChange={value => form.setFieldValue("Est_her", value)}>
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
// Este código es un componente de React que muestra una tabla de reportes BuddyPartners
// y permite editar y eliminar reportes. Utiliza Ant Design para la UI y Axios para
// realizar peticiones HTTP al backend. La tabla incluye filtros y un modal para editar
// los reportes. Los datos se obtienen de una API y se formatean antes de mostrarse.
// El componente maneja el estado de los reportes, el registro que se está editando y la visibilidad del modal de edición. 