import Swal from 'sweetalert2';
// Importación de React y hooks
import React, { useEffect, useState } from 'react';
// Importación de axios para peticiones HTTP
import axios from 'axios';
// Importación de componentes de Ant Design para la UI
import { Table, Button, Input, Modal, Form, message, Alert, Upload } from 'antd';
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
    const [pendingBuddies, setPendingBuddies] = useState([]);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [activeFilters, setActiveFilters] = useState({});

    // 🔥 NUEVOS ESTADOS PARA MANEJAR ARCHIVOS EN EDICIÓN
    const [newFileTablero, setNewFileTablero] = useState(null);
    const [newFileCalentamiento, setNewFileCalentamiento] = useState(null);
    // ----------------------------------------------------

    useEffect(() => {
        fetchBuddyPartners();
    }, []);

    const fetchBuddyPartners = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/buddy/BuddyPartner/');

            // Formatear fechas
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

    // ... después de fetchBuddyPartners, antes de handleDelete

    // 🔥 FUNCIÓN PARA SUBIR IMÁGENES AL BACKEND (ASUMIMOS EL MISMO ENDPOINT)
    const uploadImage = async (file, preset, publicId) => {
        const formData = new FormData();
        // NOTA: Asegúrate que tu backend espere 'foto'
        formData.append("foto", file);
        formData.append("upload_preset", preset);
        formData.append("public_id", publicId);

        // Asumo que tienes acceso a la API_URL o la defines aquí:
        const API_URL = "http://localhost:3000/api";

        const response = await axios.post(`${API_URL}/imagenes/subir`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.url;
    };

    // ...

    const handleDelete = async (recordId) => {
        // 1. Mostrar alerta de confirmación
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33", // Rojo para eliminar
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        // 2. Si el usuario confirma
        if (result.isConfirmed) {
            try {
                // 🔥 CORRECCIÓN CLAVE: Cambiamos 'id' por 'recordId'
                const response = await axios.delete(`http://localhost:3000/api/buddy/BuddyPartner/${recordId}`);

                // 3. Mostrar alerta de éxito
                Swal.fire({
                    title: "¡Eliminado!",
                    text: response.data.message || "El reporte ha sido eliminado correctamente.",
                    icon: "success",
                    confirmButtonColor: "#1677ff",
                });

                // 4. Recargar los datos de la tabla
                fetchBuddyPartners();

            } catch (error) {
                console.error("Error al eliminar el reporte:", error);

                // 5. Mostrar alerta de error (Mantenemos la lógica de error)
                Swal.fire({
                    title: "Error al eliminar",
                    text: error.response?.data?.message || "Ocurrió un error desconocido al intentar eliminar el reporte.",
                    icon: "error",
                    confirmButtonColor: "#1677ff",
                });
            }
        }
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        // Esta línea asegura que el Form de Ant Design tenga los valores, incluyendo los motivos.
        form.setFieldsValue(record);
        setIsModalOpen(true);
        // Resetear los archivos seleccionados
        setNewFileTablero(null);
        setNewFileCalentamiento(null);
    };

    const handleUpdate = async () => {
        try {
            // Obtenemos los valores del formulario
            const values = await form.validateFields();
            // Creamos un payload mutable (usando let)
            let payload = { ...values }; // Cambiado a 'let' para permitir la modificación

            // 🚨 INICIO DE LA LÓGICA DE LIMPIEZA DE MOTIVOS 🚨

            // 1. Limpiar Motivo Empleado si el estado NO es Malo
            if (payload.Est_empl !== "Malo") {
                // Se usa null para que se guarde NULL en la base de datos, limpiando el valor anterior
                payload.MotivoEmp = null;
            }

            // 2. Limpiar Motivo Vehículo si el estado NO es Malo
            if (payload.Est_vehi !== "Malo") {
                payload.MotivoVeh = null;
            }

            // 3. Limpiar Motivo Herramienta si el estado NO es Malo
            // (Asumiendo que este campo existe en tu formulario/modal de edición)
            if (payload.Est_her !== "Malo") {
                payload.MotivoHer = null;
            }

            // 🚨 FIN DE LA LÓGICA DE LIMPIEZA DE MOTIVOS 🚨


            // 1. Manejar subida de Tablero si se seleccionó un archivo
            if (newFileTablero) {
                const publicIdBase = `${payload.id_empleado || "anon"}_${Date.now()}`;
                const urlTablero = await uploadImage(
                    newFileTablero,
                    "tableros",
                    `tablero_edit_${publicIdBase}`
                );
                payload.Tablero = urlTablero;
            }

            // 2. Manejar subida de Calentamiento si se seleccionó un archivo
            if (newFileCalentamiento) {
                const publicIdBase = `${payload.id_empleado || "anon"}_${Date.now()}`;
                const urlCal = await uploadImage(
                    newFileCalentamiento,
                    "calentamientos",
                    `calentamiento_edit_${publicIdBase}`
                );
                payload.Calentamiento = urlCal;
            }

            // 3. Enviar la actualización con el payload modificado
            const response = await axios.put(`http://localhost:3000/api/buddy/BuddyPartner/${editingRecord.id_buddy1}`, payload);

            // ... (Tu código de manejo de respuesta y errores)
            Swal.fire({
                icon: "success",
                title: "¡Actualización Exitosa!",
                text: response.data.message || "El reporte ha sido guardado correctamente.",
                confirmButtonColor: "#1677ff",
            });

            setIsModalOpen(false);
            fetchBuddyPartners();

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Error al actualizar",
                text: error.response?.data?.message || "Ocurrió un error desconocido al guardar el reporte.",
            });
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

        // --------------------------------------------------------------------
        // 🔥 CAMPOS FALTANTES (según tu tabla)
        // --------------------------------------------------------------------
        { title: 'Motivo Emp', dataIndex: 'MotivoEmp', key: 'MotivoEmp' },
        { title: 'Motivo Veh', dataIndex: 'MotivoVeh', key: 'MotivoVeh' },
        { title: 'Motivo Her', dataIndex: 'MotivoHer', key: 'MotivoHer' },
        {
            title: 'Tablero',
            dataIndex: 'Tablero',
            key: 'Tablero',
            render: (url) =>
                url ? (
                    <img
                        src={url}
                        alt="tablero"
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                ) : '—'
        },
        {
            title: 'Calentamiento',
            dataIndex: 'Calentamiento',
            key: 'Calentamiento',
            render: (url) =>
                url ? (
                    <img
                        src={url}
                        alt="calentamiento"
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                    />
                ) : '—'
        },
        // --------------------------------------------------------------------

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
        <div style={{ padding: '0 50px 50px' }}>

            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Reportes</h1>

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
                rowClassName={(record) => {
                    const hoy = moment().format("YYYY-MM-DD");

                    // Pendientes (se mantienen)
                    if (
                        (record.Est_etapa === "Inicio" || record.Est_etapa === "En proceso") &&
                        record.Fecha < hoy
                    ) {
                        return "row-pendiente";
                    }

                    // Colores por estado
                    if (record.Est_etapa === "Inicio") return "estado-inicio";
                    if (record.Est_etapa === "En proceso") return "estado-proceso";
                    if (record.Est_etapa === "Finalizó") return "estado-finalizo";

                    return "";
                }}
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
                <Form
                    form={form}
                    layout="vertical"
                    // 🔥 Solución: Forzar el re-renderizado del Form al cambiar el registro
                    key={editingRecord ? editingRecord.id_buddy1 : 'new'}
                >

                    {/* NUM CUADRILLA */}
                    <Form.Item label="Numero Cuadrilla" name="num_cuadrilla">
                        <Input disabled />
                    </Form.Item>

                    {/* HORA */}
                    <Form.Item label="Hora" name="Hora_buddy">
                        <Input type="time" />
                    </Form.Item>

                    {/* ESTADO EMPLEADO */}
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

                    {/* ESTADO VEHICULO */}
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

                    {/* CARNET */}
                    <Form.Item label="Carnet" name="Carnet">
                        <Input />
                    </Form.Item>

                    {/* TARJETA VIDA */}
                    <Form.Item label="Tarjeta Vida" name="TarjetaVida">
                        <Input />
                    </Form.Item>

                    {/* FECHA */}
                    <Form.Item label="Fecha" name="Fecha">
                        <Input type="date" />
                    </Form.Item>

                    {/* ESTADO ETAPA */}
                    <Form.Item label="Estado Etapa" name="Est_etapa">
                        <Select>
                            <Option value="Inicio">Inicio</Option>
                            <Option value="En proceso">En proceso</Option>
                            <Option value="Finalizó">Finalizó</Option>
                        </Select>
                    </Form.Item>

                    {/* ESTADO HERRAMIENTA */}
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

                    {/* TIPO */}
                    <Form.Item label="Id Empleado" name="id_empleado">
                        <Input disabled />
                    </Form.Item>

                    {/* TIPO */}
                    <Form.Item label="Tipo" name="Tipo">
                        <Input disabled />
                    </Form.Item>

                    {/* 🎯 SECCIÓN DE IMÁGENES (Tipo 2) con Upload de Ant Design */}
                    {form.getFieldValue("Tipo") === 2 && (
                        <>
                            {/* IMAGEN TABLERO */}
                            <Form.Item label="Imagen Tablero">

                                {/* Visualización de la imagen actual (URL) */}
                                {editingRecord && editingRecord.Tablero ? (
                                    <img
                                        src={editingRecord.Tablero}
                                        alt="Imagen del tablero actual"
                                        style={{
                                            width: "100%",
                                            maxHeight: "350px",
                                            objectFit: "contain",
                                            borderRadius: "10px",
                                            border: "1px solid #ddd",
                                            marginBottom: "10px",
                                        }}
                                    />
                                ) : (
                                    <p style={{ color: "#888", marginBottom: 10 }}>No hay imagen actual.</p>
                                )}

                                {/* Componente Upload (botón bonito) */}
                                <Upload
                                    // Hacemos que la subida sea manual (no se envía automáticamente)
                                    beforeUpload={(file) => {
                                        setNewFileTablero(file);
                                        return false; // Previene la subida automática
                                    }}
                                    showUploadList={false} // Oculta la lista de archivos seleccionados, si quieres ver el nombre del archivo, cámbialo a true
                                    accept="image/*"
                                >
                                    <Button type="default">
                                        {newFileTablero ? `Cambiar Archivo: ${newFileTablero.name}` : "Seleccionar Archivo"}
                                    </Button>
                                </Upload>
                                {newFileTablero && (
                                    <p style={{ marginTop: 8, color: '#1677ff' }}>Archivo listo para subir: **{newFileTablero.name}**</p>
                                )}

                            </Form.Item>

                            {/* IMAGEN CALENTAMIENTO */}
                            <Form.Item label="Imagen Calentamiento">

                                {/* Visualización de la imagen actual (URL) */}
                                {editingRecord && editingRecord.Calentamiento ? (
                                    <img
                                        src={editingRecord.Calentamiento}
                                        alt="Imagen de calentamiento actual"
                                        style={{
                                            width: "100%",
                                            maxHeight: "350px",
                                            objectFit: "contain",
                                            borderRadius: "10px",
                                            border: "1px solid #ddd",
                                            marginBottom: "10px",
                                        }}
                                    />
                                ) : (
                                    <p style={{ color: "#888", marginBottom: 10 }}>No hay imagen actual.</p>
                                )}

                                {/* Componente Upload (botón bonito) */}
                                <Upload
                                    beforeUpload={(file) => {
                                        setNewFileCalentamiento(file);
                                        return false; // Previene la subida automática
                                    }}
                                    showUploadList={false}
                                    accept="image/*"
                                >
                                    <Button type="default">
                                        {newFileCalentamiento ? `Cambiar Archivo: ${newFileCalentamiento.name}` : "Seleccionar Archivo"}
                                    </Button>
                                </Upload>
                                {newFileCalentamiento && (
                                    <p style={{ marginTop: 8, color: '#1677ff' }}>Archivo listo para subir: **{newFileCalentamiento.name}**</p>
                                )}

                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>

        </div>
    );
}
