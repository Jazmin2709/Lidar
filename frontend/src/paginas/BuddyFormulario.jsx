// src/paginas/buddy/BuddyFormulario.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

import '../css/BuddyFormulario.css';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const BUDDY_API_URL = `${API_URL}/buddy`;

export default function BuddyFormulario({ partnerNumber = 1 }) {
    const token = localStorage.getItem("token");

    const [idEmpleado, setIdEmpleado] = useState(null);
    const [loading, setLoading] = useState(false);
    const [originalCuadrilla, setOriginalCuadrilla] = useState("");
    const [showHelp, setShowHelp] = useState(false);

    // Helper para localStorage
    const getStorageKey = (fecha, empleadoId) => {
        if (!fecha || !empleadoId) return null;
        return `buddy_cuadrilla_${fecha}_${empleadoId}`;
    };

    // Decodificar token
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setIdEmpleado(decoded.id);
            } catch (err) {
                console.error("Token inválido:", err);
                Swal.fire("Error", "Sesión inválida. Inicia sesión nuevamente.", "error");
            }
        }
    }, [token]);

    // Mostrar ayuda solo la primera vez
    useEffect(() => {
        if (!idEmpleado) return;
        const helpKey = `buddy_tutorial_seen_${idEmpleado}`;
        if (!localStorage.getItem(helpKey)) {
            setShowHelp(true);
        }
    }, [idEmpleado]);

    // Precargar cuadrilla desde el nuevo sistema de asignaciones o desde etapa 1
    useEffect(() => {
        if (!idEmpleado) return;

        const fetchAsignacionActual = async () => {
            try {
                const res = await axios.get(`${API_URL}/cuadrillas/mi-asignacion/${idEmpleado}`);
                if (res.data.asignado) {
                    setForm(prev => ({ ...prev, num_cuadrilla: res.data.cuadrilla.nombre }));
                    setOriginalCuadrilla(res.data.cuadrilla.nombre);
                    return true;
                }
                return false;
            } catch (err) {
                console.warn("No se pudo obtener la asignación del día", err);
                return false;
            }
        };

        const loadFromStorage = () => {
            const today = moment().format('YYYY-MM-DD');
            const key = getStorageKey(today, idEmpleado);
            if (!key) return;
            const stored = localStorage.getItem(key);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    if (data.id_empleado === idEmpleado && data.fecha === today) {
                        setForm(prev => ({ ...prev, num_cuadrilla: data.num_cuadrilla }));
                        setOriginalCuadrilla(data.num_cuadrilla);
                    }
                } catch (e) {
                    console.warn("Error al leer cuadrilla guardada", e);
                }
            }
        };

        fetchAsignacionActual().then(found => {
            if (!found && partnerNumber !== 1) {
                loadFromStorage();
            }
        });
    }, [idEmpleado, partnerNumber]);

    // Alerta de secuencia (ej: falta el 1 antes del 2, o el 2 antes del 3)
    useEffect(() => {
        if (partnerNumber === 1 || !idEmpleado) return;

        const checkSecuencia = async () => {
            try {
                const prevStage = partnerNumber - 1;
                const today = moment().format('YYYY-MM-DD');

                const res = await axios.get(`${BUDDY_API_URL}/check-duplicate`, {
                    params: {
                        id_empleado: idEmpleado,
                        fecha: today,
                        tipo: prevStage
                    }
                });

                if (!res.data?.exists) {
                    Swal.fire({
                        icon: 'warning',
                        title: `Falta etapa anterior`,
                        html: `
                            No se encontró el registro de <b>Buddy Partner ${prevStage}</b> 
                            para el día de hoy.<br><br>
                            Se recomienda seguir el orden secuencial.<br><br>
                            ¿Quieres continuar de todos modos?
                        `,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, continuar',
                        cancelButtonText: 'Ir al Inicio',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (!result.isConfirmed) {
                            window.location.href = "/IndexEmpleado";
                        }
                    });
                }
            } catch (err) {
                console.error("Error verificando secuencia:", err);
            }
        };

        checkSecuencia();
    }, [idEmpleado, partnerNumber]);

    // Alerta de pendientes de días anteriores
    useEffect(() => {
        if (!idEmpleado) return;
        axios.get(`${BUDDY_API_URL}/pending/${idEmpleado}`)
            .then((res) => {
                if (res.data.length > 0) {
                    Swal.fire({
                        icon: "warning",
                        title: "Buddy Partners pendientes",
                        html: "Tienes actividades pendientes del día anterior.<br><b>Debes completarlas hoy.</b>",
                        confirmButtonColor: "#3085d6",
                    });
                }
            })
            .catch((err) => console.error("Error pendientes:", err));
    }, [idEmpleado]);

    // Configuración según el partnerNumber
    const config = {
        1: {
            title: "Inicio de Jornada",
            etapa: "Inicio",
            tipo: 1,
            motivoRegex: /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,}$/,
            images: [
                { key: "carnet", label: "Carnet", preset: "Carnet", prefix: "carnet" },
                { key: "tarjetaVida", label: "Tarjeta Vida", preset: "TarjetaVida", prefix: "tarjeta_vida" },
            ],
            nextPartner: 2,
        },
        2: {
            title: "En Proceso",
            etapa: "En proceso",
            tipo: 2,
            motivoRegex: /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s.,()-]{3,}$/,
            images: [
                { key: "tablero", label: "Tablero", preset: "tableros", prefix: "tablero" },
                { key: "calentamiento", label: "Calentamiento", preset: "calentamientos", prefix: "calentamiento" },
            ],
            nextPartner: 3,
        },
        3: {
            title: "Cierre de Jornada",
            etapa: "Finalizó",
            tipo: 3,
            motivoRegex: /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s.,()-]{3,}$/,
            images: [],
            extraPayload: {
                Carnet: "0",
                TarjetaVida: "0",
                Tablero: "",
                Calentamiento: "",
            },
            nextPartner: null,
        },
    }[partnerNumber];

    const [form, setForm] = useState({
        num_cuadrilla: "",
        Hora_buddy: moment().format("HH:mm"),
        Est_empl: "",
        Est_vehi: "",
        Est_her: "",
        MotivoEmp: "",
        MotivoVeh: "",
        MotivoHer: "",
        Fecha: moment().format("YYYY-MM-DD"),
        Est_etapa: config?.etapa || "Inicio",
        Tipo: config?.tipo || 1,
        id_empleado: null,
    });

    const [files, setFiles] = useState({});

    // Validaciones
    const validateCuadrilla = (value) => {
        const trimmed = value.trim();
        if (trimmed.length > 15) return "Máximo 15 caracteres permitidos";
        if (!/^[a-zA-Z0-9ñáéíóúÁÉÍÓÚ\s]*$/.test(trimmed)) return "Solo letras, números y espacios";
        if (trimmed !== value) return "No se permiten espacios al inicio o final";
        return "";
    };

    const areFilesTheSame = (file1, file2) => {
        if (!file1 || !file2) return false;
        return (
            file1.name === file2.name &&
            file1.size === file2.size &&
            file1.lastModified === file2.lastModified
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFile = (e, key) => {
        const file = e.target.files?.[0];
        if (file && !file.type.startsWith("image/")) {
            Swal.fire("Inválido", "Solo se permiten imágenes", "warning");
            e.target.value = "";
            return;
        }

        setFiles(prev => {
            const newFiles = { ...prev, [key]: file };

            if (partnerNumber === 1 && newFiles.carnet && newFiles.tarjetaVida) {
                if (areFilesTheSame(newFiles.carnet, newFiles.tarjetaVida)) {
                    Swal.fire({
                        icon: "warning",
                        title: "Imágenes iguales",
                        text: "La imagen de Carnet y Tarjeta Vida son idénticas. Sube fotos diferentes.",
                    });
                }
            }
            if (partnerNumber === 2 && newFiles.tablero && newFiles.calentamiento) {
                if (areFilesTheSame(newFiles.tablero, newFiles.calentamiento)) {
                    Swal.fire({
                        icon: "warning",
                        title: "Imágenes iguales",
                        text: "La imagen de Tablero y Calentamiento son idénticas. Sube fotos diferentes.",
                    });
                }
            }
            return newFiles;
        });
    };

    const uploadImage = async (file, preset, prefix) => {
        const formData = new FormData();
        formData.append("foto", file);
        formData.append("upload_preset", preset);
        formData.append("public_id", `${prefix}_${idEmpleado}_${Date.now()}`);

        const res = await axios.post(`${API_URL}/imagenes/subir`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (!res.data?.url) throw new Error(`Error subiendo ${preset}`);
        return res.data.url;
    };

    // ====================== HANDLE SUBMIT ======================
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idEmpleado) {
            return Swal.fire("Error", "Sesión inválida", "error");
        }

        setLoading(true);

        try {
            // 1. Validaciones locales
            if (partnerNumber === 1 && areFilesTheSame(files.carnet, files.tarjetaVida)) {
                throw new Error("Carnet y Tarjeta Vida no pueden ser la misma imagen.");
            }
            if (partnerNumber === 2 && areFilesTheSame(files.tablero, files.calentamiento)) {
                throw new Error("Tablero y Calentamiento no pueden ser la misma imagen.");
            }

            const errorCuadrilla = validateCuadrilla(form.num_cuadrilla);
            if (errorCuadrilla) throw new Error(errorCuadrilla);

            if ((form.Est_empl === "Malo" && !config.motivoRegex.test(form.MotivoEmp?.trim() || "")) ||
                (form.Est_vehi === "Malo" && !config.motivoRegex.test(form.MotivoVeh?.trim() || "")) ||
                (form.Est_her === "Malo" && !config.motivoRegex.test(form.MotivoHer?.trim() || ""))) {
                throw new Error("Los motivos cuando el estado es 'Malo' deben tener al menos 3 caracteres válidos.");
            }

            if (moment(form.Fecha).isAfter(moment(), "day")) {
                throw new Error("Fecha futura no permitida");
            }

            for (const img of config.images) {
                if (!files[img.key]) {
                    throw new Error(`Falta imagen: ${img.label}`);
                }
            }

            // ====================== 2. VERIFICACIÓN DE DUPLICADO (con cuadrilla) ======================
            const fechaAConsultar = form.Fecha || moment().format('YYYY-MM-DD');
            let yaExiste = false;
            let registroExistente = null;

            try {
                const checkRes = await axios.get(`${BUDDY_API_URL}/check-duplicate`, {
                    params: {
                        id_empleado: idEmpleado,
                        fecha: fechaAConsultar,
                        tipo: config.tipo,
                    },
                });

                yaExiste = !!checkRes.data?.exists;
                if (yaExiste) {
                    registroExistente = checkRes.data.registro;
                }
            } catch (checkErr) {
                console.warn("⚠️ No se pudo verificar duplicado:", checkErr);
            }

            // Alerta con más información (incluyendo cuadrilla)
            if (yaExiste) {
                const cuad = registroExistente?.num_cuadrilla || "—";
                const hora = registroExistente?.Hora_buddy || "—";
                const etapa = registroExistente?.Est_etapa || "—";

                const result = await Swal.fire({
                    icon: "warning",
                    title: `Ya existe Buddy Partner ${partnerNumber}`,
                    html: `
            Ya registraste un <b>Buddy Partner ${partnerNumber}</b> hoy:<br><br>
            <b>Cuadrilla:</b> ${cuad}<br>
            <b>Fecha:</b> ${moment(fechaAConsultar).format('DD/MM/YYYY')}<br>
            <b>Hora:</b> ${hora}<br>
            <b>Etapa:</b> ${etapa}<br><br>
            ¿Deseas <b>registrar otro</b> de todos modos?
        `,
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Sí, registrar otro",
                    cancelButtonText: "No, cancelar",
                    reverseButtons: true,
                    allowOutsideClick: false,
                });

                if (!result.isConfirmed) {
                    setLoading(false);
                    return;
                }
            }

            // 3. Procesar y guardar
            Swal.fire({
                title: "Procesando...",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const uploads = {};
            for (const img of config.images) {
                const capitalizedKey = img.key.charAt(0).toUpperCase() + img.key.slice(1);
                uploads[capitalizedKey] = await uploadImage(
                    files[img.key],
                    img.preset,
                    img.prefix
                );
            }

            const payload = {
                ...form,
                id_empleado: idEmpleado,
                Fecha: fechaAConsultar,
                ...uploads,
                ...config.extraPayload,
            };

            const res = await axios.post(`${BUDDY_API_URL}/BuddyPartner`, payload);

            // 4. Éxito
            if (partnerNumber === 1) {
                const key = getStorageKey(fechaAConsultar, idEmpleado);
                if (key) {
                    localStorage.setItem(key, JSON.stringify({
                        num_cuadrilla: form.num_cuadrilla,
                        id_empleado: idEmpleado,
                        fecha: fechaAConsultar,
                        timestamp: Date.now()
                    }));
                }
            }

            await Swal.fire({
                title: "¡Éxito!",
                text: res.data.message || "Registro completado correctamente",
                icon: "success",
                timer: 1800,
                showConfirmButton: false
            });

            if (config.nextPartner) {
                window.location.href = `/buddy/${config.nextPartner}`;
            } else {
                Swal.fire({
                    title: "¡Jornada completada!",
                    text: "Has finalizado las 3 etapas del Buddy Partner de hoy.",
                    icon: "success",
                    confirmButtonText: "Volver al inicio"
                }).then(() => {
                    window.location.href = "/IndexEmpleado";
                });
            }

        } catch (err) {
            let mensaje = err.message || "Error en el proceso";

            if (err.response?.status === 400 && err.response?.data?.message?.includes("Ya existe")) {
                mensaje = err.response.data.message;
            }

            Swal.fire("Error", mensaje, "error");
            console.error(err);
        } finally {
            setLoading(false);
            Swal.close();
        }
    };

    // Renderizar campo de motivo cuando sea "Malo"
    const renderMotivo = (estadoKey, motivoKey, label) =>
        form[estadoKey] === "Malo" && (
            <div className="col-12">
                <label className="form-label">
                    {label} <span className="text-danger">*</span>
                </label>
                <textarea
                    className="form-control"
                    name={motivoKey}
                    value={form[motivoKey] || ""}
                    onChange={handleChange}
                    placeholder="Describe detalladamente el motivo del estado 'Malo' (mínimo 3 caracteres)"
                    rows="3"
                />
            </div>
        );

    if (!idEmpleado) return <div className="text-center mt-5">Cargando sesión...</div>;

    return (
        <div className="container mt-5 mb-5 pt-5 buddy-container">
            {/* Sección de ayuda */}
            {showHelp && (
                <div className="card bg-light border-primary mb-4 shadow-sm buddy-help-card">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-3">
                                <i className="bi bi-question-circle-fill fs-3 text-primary buddy-help-icon"></i>
                                <div>
                                    <h5 className="card-title text-primary mb-1 buddy-help-title">
                                        ¿Necesitas ayuda para llenar el formulario?
                                    </h5>
                                    <p className="card-text text-muted mb-0 buddy-help-text">
                                        Mira este video corto donde te explicamos paso a paso cómo completar cada etapa del Buddy Partner.
                                    </p>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-primary px-4 py-2"
                                    onClick={() => Swal.fire({
                                        title: 'Tutorial Buddy Partner',
                                        html: `
                                            <div class="ratio ratio-16x9 mt-3">
                                                <iframe 
                                                    src="https://www.youtube.com/embed/G-CORtHWxqk?rel=0&modestbranding=1" 
                                                    title="Tutorial Buddy Partner" 
                                                    frameborder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowfullscreen>
                                                </iframe>
                                            </div>
                                        `,
                                        width: '90%',
                                        showConfirmButton: false,
                                        showCloseButton: true,
                                        padding: '1.5rem',
                                    })}
                                >
                                    <i className="bi bi-play-circle me-2"></i>
                                    Ver tutorial ahora (2 min)
                                </button>

                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => {
                                        const helpKey = `buddy_tutorial_seen_${idEmpleado}`;
                                        localStorage.setItem(helpKey, 'true');
                                        setShowHelp(false);
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Ocultado',
                                            text: 'No volveremos a mostrar esta ayuda.',
                                            timer: 2500,
                                            showConfirmButton: false
                                        });
                                    }}
                                >
                                    No mostrar de nuevo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario principal */}
            <div className="card shadow-lg border-0 rounded-4 p-4 bg-white buddy-form-card">
                <h2 className="text-center mb-4 text-primary buddy-form-title">
                    Formulario Buddy Partner {partnerNumber}: {config.title}
                </h2>

                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-12">
                        <h5 className="text-muted buddy-section-title">Datos de la Jornada</h5>
                        <hr className="buddy-section-hr" />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">N° Cuadrilla <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className="form-control"
                            name="num_cuadrilla"
                            value={form.num_cuadrilla}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setForm(prev => ({ ...prev, num_cuadrilla: newValue }));
                                const error = validateCuadrilla(newValue);
                                e.target.setCustomValidity(error || "");
                            }}
                            onBlur={(e) => {
                                const cleaned = e.target.value.trim();
                                if (cleaned !== originalCuadrilla && originalCuadrilla !== "") {
                                    Swal.fire({
                                        title: "¿Cambiar cuadrilla?",
                                        text: "Estás modificando la cuadrilla de la etapa 1. ¿Estás seguro?",
                                        icon: "question",
                                        showCancelButton: true,
                                        confirmButtonText: "Sí, cambiar",
                                        cancelButtonText: "Mantener original"
                                    }).then(result => {
                                        if (!result.isConfirmed) {
                                            setForm(prev => ({ ...prev, num_cuadrilla: originalCuadrilla }));
                                        } else {
                                            setOriginalCuadrilla(cleaned);
                                        }
                                    });
                                } else {
                                    setForm(prev => ({ ...prev, num_cuadrilla: cleaned }));
                                    setOriginalCuadrilla(cleaned);
                                }
                            }}
                            required
                            placeholder="Ej: 12, Pedestre 17, Aerolaser"
                            maxLength={15}
                        />
                        {form.num_cuadrilla && validateCuadrilla(form.num_cuadrilla) && (
                            <small className="text-danger d-block mt-1">
                                {validateCuadrilla(form.num_cuadrilla)}
                            </small>
                        )}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Hora Buddy <span className="text-danger">*</span></label>
                        <input type="time" className="form-control" name="Hora_buddy" value={form.Hora_buddy} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Fecha <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            className="form-control"
                            name="Fecha"
                            value={form.Fecha}
                            onChange={handleChange}
                            min={moment().subtract(30, "days").format("YYYY-MM-DD")}
                            max={moment().format("YYYY-MM-DD")}
                            required
                        />
                    </div>

                    <div className="col-12 mt-4">
                        <h5 className="text-muted buddy-section-title">Estados de Seguridad</h5>
                        <hr className="buddy-section-hr" />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Estado Empleado <span className="text-danger">*</span></label>
                        <select className="form-select" name="Est_empl" value={form.Est_empl} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            <option value="Excelente">Excelente</option>
                            <option value="Bueno">Bueno</option>
                            <option value="Malo">Malo</option>
                        </select>
                    </div>
                    {renderMotivo("Est_empl", "MotivoEmp", "Motivo Empleado")}

                    <div className="col-md-4">
                        <label className="form-label">Estado Vehículo <span className="text-danger">*</span></label>
                        <select className="form-select" name="Est_vehi" value={form.Est_vehi} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            <option value="Excelente">Excelente</option>
                            <option value="Bueno">Bueno</option>
                            <option value="Malo">Malo</option>
                        </select>
                    </div>
                    {renderMotivo("Est_vehi", "MotivoVeh", "Motivo Vehículo")}

                    <div className="col-md-4">
                        <label className="form-label">Estado Herramienta <span className="text-danger">*</span></label>
                        <select className="form-select" name="Est_her" value={form.Est_her} onChange={handleChange} required>
                            <option value="">Seleccione...</option>
                            <option value="Excelente">Excelente</option>
                            <option value="Bueno">Bueno</option>
                            <option value="Malo">Malo</option>
                        </select>
                    </div>
                    {renderMotivo("Est_her", "MotivoHer", "Motivo Herramienta")}

                    {config.images.length > 0 && (
                        <>
                            <div className="col-12 mt-4">
                                <h5 className="text-muted buddy-section-title">Documentación Fotográfica</h5>
                                <hr className="buddy-section-hr" />
                            </div>
                            {config.images.map((img) => (
                                <div key={img.key} className="col-md-6">
                                    <label className="form-label">
                                        Imagen {img.label} <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => handleFile(e, img.key)}
                                        required
                                    />
                                </div>
                            ))}
                        </>
                    )}

                    <div className="col-12 text-center mt-5">
                        <button
                            type="button"
                            className="btn btn-outline-secondary me-3 px-4"
                            onClick={() => window.location.href = "/IndexEmpleado"}
                            disabled={loading}
                        >
                            Regresar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-5"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Guardando...
                                </>
                            ) : (
                                "Confirmar Registro"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}