import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import EmpleadosTable from '../componentes/EmpleadosTable.jsx';
import EmpleadoForm from '../componentes/EmpleadoForm';

const API_URL = 'http://localhost:3000/api';

export default function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);

  const cargarTodo = async () => {
    try {
      setLoading(true);
      const [e, r] = await Promise.all([
        axios.get(`${API_URL}/empleados`),
        axios.get(`${API_URL}/empleados/roles`),
      ]);

      // ✅ Validación extra: aseguramos que sean arrays válidos y no estén vacíos
      if (!Array.isArray(e.data) || !Array.isArray(r.data)) {
        throw new Error('Los datos recibidos no tienen el formato esperado');
      }
      if (e.data.length === 0) {
        Swal.fire('Atención', 'No se encontraron empleados', 'info');
      }
      if (r.data.length === 0) {
        Swal.fire('Atención', 'No se encontraron roles disponibles', 'info');
      }

      setEmpleados(e.data);
      setRoles(r.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los datos correctamente', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarTodo(); }, []);

  const onEdit = (emp) => {
    if (!emp || typeof emp !== 'object') {
      Swal.fire('Error', 'Datos inválidos del empleado a editar', 'error');
      return;
    }
    setEditData(emp); // ahora sí carga los datos en el formulario
  };


  const onDelete = async (id) => {
    // ✅ Validación extra para el ID
    if (!id || isNaN(id) || Number(id) <= 0) {
      Swal.fire('Atención', 'ID de empleado inválido', 'warning');
      return;
    }

    const confirm = await Swal.fire({
      title: '¿Eliminar empleado?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true, // Para prevenir clics accidentales
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/empleados/${id}`);
      Swal.fire('Eliminado', 'Empleado eliminado correctamente', 'success');
      cargarTodo();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error al eliminar';
      Swal.fire('Atención', msg, 'warning');
    }
  };

  return (
    <div className='container py-4'>
      <h1 className='mb-4'>Gestión de Empleados</h1>

      <div className='mb-4'>
        <EmpleadoForm
          roles={roles}
          editData={editData}
          onSaved={() => { setEditData(null); cargarTodo(); }}
        />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <EmpleadosTable empleados={empleados} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
}
