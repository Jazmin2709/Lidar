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

      if (!Array.isArray(e.data) || !Array.isArray(r.data)) {
        throw new Error('Los datos recibidos no tienen el formato esperado');
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
    setEditData(emp);
  };

  const onToggleActivo = async (emp) => {
    if (!emp || !emp.id_per) {
      Swal.fire('Atención', 'Empleado inválido', 'warning');
      return;
    }

    const accion = emp.activo === 1 ? 'desactivar' : 'activar';

    const confirm = await Swal.fire({
      title: `¿Deseas ${accion} a este empleado?`,
      text: 'Puedes revertir esta acción después',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(`${API_URL}/empleados/${emp.id_per}/activo`, {
        activo: emp.activo === 1 ? 0 : 1
      });
      Swal.fire('Éxito', `Empleado ${accion} correctamente`, 'success');
      cargarTodo();
    } catch (error) {
      const msg = error?.response?.data?.message || `Error al ${accion}`;
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
        <EmpleadosTable empleados={empleados} onEdit={onEdit} onToggleActivo={onToggleActivo} />
      )}
    </div>
  );
}
