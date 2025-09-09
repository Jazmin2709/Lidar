import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:3000/api';

const onlyLetters = (v) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/.test(v || '');
const onlyDigits = (v) => /^\d*$/.test(v || '');

function decodeToken(token) {
    try {
        const payload = token.split('.')[1];
        const base = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export default function ActualizarPerfil() {
    const [form, setForm] = useState({
        Correo: '',
        Nombres: '',
        Apellidos: '',
        Cedula: '',
        Celular: '',
        Tipo_Doc: 'CC',
    });
    const [original, setOriginal] = useState(null); // Valores originales para cancelar
    const [rol, setRol] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const info = token ? decodeToken(token) : null;
        if (!info) {
            Swal.fire('Sesión', 'No autenticado', 'warning');
            return;
        }
        setRol(info.rol);
    }, []);

    useEffect(() => {
        const cargar = async () => {
            try {
                if (![1, 2].includes(Number(rol))) {
                    setLoading(false);
                    return Swal.fire('Acceso', 'No autorizado para esta sección', 'error');
                }
                const { data } = await axios.get(`${API_URL}/perfil/me`);
                const perfil = {
                    Correo: data.Correo || '',
                    Nombres: data.Nombres || '',
                    Apellidos: data.Apellidos || '',
                    Cedula: String(data.Cedula ?? ''),
                    Celular: String(data.Celular ?? ''),
                    Tipo_Doc: data.Tipo_Doc || 'CC',
                };
                setForm(perfil);
                setOriginal(perfil); // Guardamos copia original
            } catch (e) {
                const msg = e?.response?.data?.message || 'No se pudo cargar el perfil';
                Swal.fire('Error', msg, 'error');
            } finally {
                setLoading(false);
            }
        };
        if (rol !== null) cargar();
    }, [rol]);

    const onChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Nombres' || name === 'Apellidos') {
            if (!onlyLetters(value)) return;
        }
        if (name === 'Cedula' || name === 'Celular') {
            if (!onlyDigits(value)) return;
        }
        setForm((f) => ({ ...f, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.Correo) return Swal.fire('Validación', 'Correo es obligatorio', 'info');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Correo)) return Swal.fire('Validación', 'Correo inválido', 'info');
        if (!form.Celular || !/^\d{7,15}$/.test(form.Celular)) {
            return Swal.fire('Validación', 'Celular debe tener entre 7 y 15 dígitos', 'info');
        }
        if (!['CC', 'PA', 'PP'].includes(form.Tipo_Doc)) {
            return Swal.fire('Validación', 'Tipo de documento inválido', 'info');
        }

        try {
            await axios.put(`${API_URL}/perfil/me`, {
                ...form,
                Cedula: Number(form.Cedula),
            });
            Swal.fire('Éxito', 'Perfil actualizado correctamente', 'success');
            setOriginal(form); // Actualizamos valores originales tras guardar
        } catch (e) {
            const msg = e?.response?.data?.message || 'No se pudo actualizar el perfil';
            Swal.fire('Error', msg, 'error');
        }
    };

    const onCancel = () => {
        if (original) {
            setForm(original); // Restaurar valores originales
        }
    };

    if (loading) return <div className="container py-4">Cargando...</div>;
    if (rol !== null && ![1, 2].includes(Number(rol))) {
        return <div className="container py-4"><h5>No autorizado</h5></div>;
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Actualizar Perfil</h2>
            <form className="row g-3" onSubmit={onSubmit}>
                <div className="col-md-4">
                    <label className="form-label">Correo</label>
                    <input type="email" className="form-control" name="Correo" value={form.Correo} onChange={onChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Nombres</label>
                    <input className="form-control" name="Nombres" value={form.Nombres} onChange={onChange} disabled />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Apellidos</label>
                    <input className="form-control" name="Apellidos" value={form.Apellidos} onChange={onChange} disabled />
                </div>

                <div className="col-md-4">
                    <label className="form-label">Cédula</label>
                    <input className="form-control" name="Cedula" value={form.Cedula} onChange={onChange} disabled />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Celular</label>
                    <input className="form-control" name="Celular" value={form.Celular} onChange={onChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label">Tipo de Documento</label>
                    <select className="form-select" name="Tipo_Doc" value={form.Tipo_Doc} onChange={onChange} required>
                        <option value="CC">Cédula de ciudadanía</option>
                        <option value="PA">Pasaporte</option>
                        <option value="PP">Permiso de permanencia</option>
                    </select>
                </div>

                <div className="col-12 d-flex gap-2">
                    <button className="btn btn-primary" type="submit">Guardar cambios</button>
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}
