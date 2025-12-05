import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = process.env.API_URL || "http://localhost:3000/api";

export default function EmpleadoForm({ roles, editData, onSaved }) {
  const [form, setForm] = useState({
    Correo: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    Celular: '',
    Contrasena: '',
    Tipo_Doc: 'CC',
    id_rol: 2, // por defecto "empleado"
  });

  const [showPassword, setShowPassword] = useState(false); // 👀🙈

  useEffect(() => {
    if (editData) {
      const { Contrasena, ...rest } = editData;
      setForm({ ...rest, Contrasena: '' });
    } else {
      setForm({
        Correo: '',
        Nombres: '',
        Apellidos: '',
        Cedula: '',
        Celular: '',
        Contrasena: '',
        Tipo_Doc: 'CC',
        id_rol: 2,
      });
    }
  }, [editData]);

  const onChange = (e) => {
    const { name, value } = e.target;

    if (name === 'Nombres' || name === 'Apellidos') {
      if (!/^[a-zA-ZÀ-ÿ\s]*$/.test(value)) return;
    }
    if (name === 'Cedula') {
      if (!/^\d*$/.test(value)) return;
    }
    if (name === 'Celular') {
      if (!/^\d{0,10}$/.test(value)) return;
    }
    if (name === 'Contrasena') {
      if (/\s/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Correo)) {
      return Swal.fire('Correo inválido', 'Ingresa un correo válido', 'warning');
    }
    if (!form.Nombres || !form.Apellidos) {
      return Swal.fire('Campos requeridos', 'Ingresa nombres y apellidos válidos', 'warning');
    }
    if (form.Cedula.length < 5) {
      return Swal.fire('Cédula inválida', 'Debe contener al menos 5 dígitos', 'warning');
    }
    if (form.Celular.length < 7) {
      return Swal.fire('Celular inválido', 'Debe contener al menos 7 dígitos', 'warning');
    }
    if (!editData && form.Contrasena.length < 6) {
      return Swal.fire('Contraseña inválida', 'Debe tener mínimo 6 caracteres', 'warning');
    }

    try {
      if (editData) {
        await axios.put(`${API_URL}/empleados/${editData.id_per}`, form);
        Swal.fire('Actualizado', 'Empleado actualizado con éxito', 'success');
      } else {
        if (!form.Contrasena) {
          return Swal.fire('Falta contraseña', 'Para crear un empleado, ingresa la contraseña', 'info');
        }
        await axios.post(`${API_URL}/empleados`, form);
        Swal.fire('Creado', 'Empleado creado con éxito', 'success');
      }
      onSaved?.();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error al guardar';
      Swal.fire('Error', msg, 'error');
    }
  };

  const onClear = () => {
    setForm({
      Correo: '',
      Nombres: '',
      Apellidos: '',
      Cedula: '',
      Celular: '',
      Contrasena: '',
      Tipo_Doc: 'CC',
      id_rol: 2,
    });
  };

  return (
    <form className='row g-3' onSubmit={onSubmit}>
      <div className='col-md-6'>
        <label className='form-label'>Correo</label>
        <input
          className='form-control'
          type='email'
          name='Correo'
          value={form.Correo}
          onChange={onChange}
        />
      </div>

      <div className='col-md-6'>
        <label className='form-label'>Nombres</label>
        <input
          className='form-control'
          type='text'
          name='Nombres'
          value={form.Nombres}
          onChange={onChange}
        />
      </div>

      <div className='col-md-6'>
        <label className='form-label'>Apellidos</label>
        <input
          className='form-control'
          type='text'
          name='Apellidos'
          value={form.Apellidos}
          onChange={onChange}
        />
      </div>

      <div className='col-md-6'>
        <label className='form-label'>Cédula</label>
        <input
          className='form-control'
          type='text'
          name='Cedula'
          value={form.Cedula}
          onChange={onChange}
        />
      </div>

      <div className='col-md-6'>
        <label className='form-label'>Celular</label>
        <input
          className='form-control'
          type='text'
          name='Celular'
          value={form.Celular}
          onChange={onChange}
        />
      </div>

      <div className='col-md-4'>
        <label className='form-label'>Tipo Documento</label>
        <select
          className='form-select'
          name='Tipo_Doc'
          value={form.Tipo_Doc}
          onChange={onChange}
        >
          <option value='CC'>Cédula</option>
          <option value='TI'>Tarjeta de Identidad</option>
          <option value='CE'>Cédula de Extranjería</option>
        </select>
      </div>

      <div className='col-md-4'>
        <label className='form-label'>Rol</label>
        <select
          className='form-select'
          name='id_rol'
          value={form.id_rol}
          onChange={onChange}
        >
          {roles.map((r) => (
            <option key={r.id_rol} value={r.id_rol}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className='col-md-4' style={{ position: 'relative' }}>
        <label className='form-label'>
          Contraseña {editData ? '(deja en blanco para no cambiar)' : ''}
        </label>
        <input
          className='form-control'
          type={showPassword ? 'text' : 'password'}
          name='Contrasena'
          value={form.Contrasena}
          onChange={onChange}
          placeholder={editData ? 'No cambiar' : ''}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '30px',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: showPassword ? 'green' : 'red'
          }}
        >
          {showPassword ? "👀" : "🙈"}
        </span>
      </div>

      <div className='col-12'>
        <button className='btn btn-primary' type='submit'>
          {editData ? 'Actualizar' : 'Agregar'}
        </button>
        <button
          className='btn btn-secondary ms-2'
          type='button'
          onClick={onClear}
        >
          Limpiar
        </button>
      </div>
    </form>
  );
}
