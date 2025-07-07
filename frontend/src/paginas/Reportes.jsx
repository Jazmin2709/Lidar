import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import '../css/styles.css';
import moment from 'moment';

export default function Reportes() {
    const [buddyPartners, setBuddyPartners] = useState([]);

    useEffect(() => {
        const fetchBuddyPartners = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner/');
                await response.data.forEach(item => {
                    item.Fecha = moment(item.Fecha).format('YYYY-MM-DD');
                });
                setBuddyPartners(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBuddyPartners();
    }, []);

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
    ];

    return (
        <div>
            <h1>Reportes</h1>
            <Table
                className="shadow rounded-5 border-3"
                columns={columns}
                dataSource={buddyPartners}
                rowKey="id_buddy1"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
}
