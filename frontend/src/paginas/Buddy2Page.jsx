// Importa los hooks de React y librerías externas necesarias
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

// 🚧 Configuración centralizada de la URL de la API
const API_URL = process.env.API_URL || "https://lidar-cush.onrender.com/api";
const BUDDY_API_URL = `${API_URL}/buddy`;

// Componente principal de la página Buddy 2
export default function Buddy2Page() {
  // ========================================================
  // 🔑 DECODE TOKEN Y OBTENCIÓN DE ID DE EMPLEADO
  // ========================================================
  const token = localStorage.getItem("token");
  let id_empleado = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      id_empleado = decoded.id;
    } catch (e) {
      console.error("Error decodificando token:", e);
    }
  }

  // ========================================================
  // 🔔 ALERTA DE BUDDYS PENDIENTES (useEffect)
  // ========================================================
  useEffect(() => {
    if (!id_empleado) return; // Si no hay ID de empleado, no se puede consultar

    axios
      .get(`${BUDDY_API_URL}/pending/${id_empleado}`)
      .then((res) => {
        if (res.data.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Tienes Buddy Partners pendientes",
            html: `
              <p>Quedaron actividades Buddy del día anterior sin completar.</p>
              <p><b>Debes terminarlas hoy.</b></p>
            `,
            confirmButtonColor: "#3085d6",
          });
        }
      })
      .catch((err) => console.log("Error al consultar pendientes:", err));
  }, [id_empleado]); // Dependencia: Se ejecuta solo cuando el id_empleado esté definido

  // ========================================================
  // 📌 ESTADOS DEL FORMULARIO
  // ========================================================
  const [Formulario, setFormulario] = useState({
    num_cuadrilla: "",
    Hora_buddy: moment().format("HH:mm"), // Inicializar con hora actual
    Est_empl: "",
    Est_vehi: "",
    Fecha: moment().format("YYYY-MM-DD"),
    Est_etapa: "En proceso", // Valor fijo para Buddy 2 (En proceso)
    Est_her: "",
    MotivoEmp: "",
    MotivoVeh: "",
    MotivoHer: "",
    Tablero: "",         // URL se llenará al subir la imagen
    Calentamiento: "", // URL se llenará al subir la imagen
    Tipo: 2,           // Valor fijo para Buddy 2
    id_empleado: id_empleado, // Asociar con el empleado logueado
  });

  // *** ESTADOS PARA LOS ARCHIVOS A SUBIR (Buddy 2) ***
  const [selectedFileTablero, setSelectedFileTablero] = useState(null);
  const [selectedFileCalentamiento, setSelectedFileCalentamiento] = useState(null);

  // ========================================================
  // ⚙️ FUNCIONES AUXILIARES
  // ========================================================
  const onlyDigits = (v) => v.replace(/[^\d]/g, "");

  // Función de manejo de inputs con validaciones para números y texto/motivos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Validación de Cuadrilla (solo dígitos)
    if (name === "num_cuadrilla") {
      newValue = onlyDigits(value);
      if (!/^\d*$/.test(newValue)) return;
    }

    // Validación de Motivos (permite letras, números, espacios y signos básicos como . , - ( ))
    if (
      ["MotivoEmp", "MotivoVeh", "MotivoHer"].includes(name) &&
      !/^[a-zA-Z0-9\s.,()-]*$/.test(value)
    )
      return; // Si no pasa la prueba, no actualiza el estado

    setFormulario((prev) => ({ ...prev, [name]: newValue }));
  };

  // ========================================================
  // ☁️ SUBIR IMAGEN A CLOUDINARY (función reusable)
  // ========================================================
  /**
   * Sube un archivo al backend para ser procesado y guardado en Cloudinary.
   * @param {File} file - El archivo a subir.
   * @param {string} presetName - El nombre del preset de Cloudinary.
   * @param {string} publicId - El ID público para nombrar el archivo.
   * @returns {Promise<object>} La respuesta de la API con la URL de la imagen.
   */
  const uploadImage = async (file, presetName, publicId) => {
    const formData = new FormData();
    formData.append("foto", file);
    formData.append("upload_preset", presetName);
    formData.append("public_id", publicId);

    const response = await axios.post(`${API_URL}/imagenes/subir`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  };

  // ========================================================
  // 🚀 SUBMIT DEL FORMULARIO (Manejo de subida de archivos y POST)
  // ========================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Validaciones
    if (!id_empleado) {
      Swal.fire("Error de Sesión", "No se pudo identificar al empleado. Intenta iniciar sesión nuevamente.", "error");
      return;
    }

    // Validación de la cuadrilla (solo dígitos)
    if (!/^\d+$/.test(Formulario.num_cuadrilla)) {
      Swal.fire("Número inválido", "El número de cuadrilla debe contener solo números.", "error");
      return;
    }

    // Validaciones condicionales de Motivos (se asume que si el estado es Malo, el Motivo es obligatorio)
    // Patrón flexible para motivos de Buddy 2
    const motivoPattern = /^[a-zA-Z0-9\s.,()-]{3,}$/; // Mínimo 3 caracteres

    if (Formulario.Est_empl === "Malo" && !motivoPattern.test(Formulario.MotivoEmp)) {
      Swal.fire("Motivo inválido", "El motivo del empleado debe tener al menos 3 caracteres.", "error");
      return;
    }
    if (Formulario.Est_vehi === "Malo" && !motivoPattern.test(Formulario.MotivoVeh)) {
      Swal.fire("Motivo inválido", "El motivo del vehículo debe tener al menos 3 caracteres.", "error");
      return;
    }
    if (Formulario.Est_her === "Malo" && !motivoPattern.test(Formulario.MotivoHer)) {
      Swal.fire("Motivo inválido", "El motivo de la herramienta debe tener al menos 3 caracteres.", "error");
      return;
    }

    // Validación de Archivos (Tablero y Calentamiento)
    if (!selectedFileTablero) {
      Swal.fire("Requerido", "Debes seleccionar una imagen para el Tablero.", "warning");
      return;
    }
    if (!selectedFileCalentamiento) {
      Swal.fire("Requerido", "Debes seleccionar una imagen para el Calentamiento.", "warning");
      return;
    }

    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: 'Subiendo imágenes...',
        text: 'Por favor, espera mientras se cargan las imágenes (paso 1 de 2).',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 2. Subida de Documentos (Tablero y Calentamiento)
      const timestamp = Date.now();

      // Subida del Tablero
      const tableroId = `tablero_${id_empleado}_${timestamp}`;
      const tableroResp = await uploadImage(selectedFileTablero, "tableros", tableroId);
      if (!tableroResp.data || !tableroResp.data.url) throw new Error("Error al subir imagen de Tablero. Respuesta del servidor incompleta.");

      // Actualizar alerta
      Swal.update({
        text: 'Cargando Calentamiento (paso 2 de 2).',
      });

      // Subida de Calentamiento
      const calentamientoId = `calentamiento_${id_empleado}_${timestamp + 1}`;
      const calentamientoResp = await uploadImage(selectedFileCalentamiento, "calentamientos", calentamientoId);
      if (!calentamientoResp.data || !calentamientoResp.data.url) throw new Error("Error al subir imagen de Calentamiento. Respuesta del servidor incompleta.");


      // 3. Creación del Payload con URLs
      const payload = {
        ...Formulario,
        // *** SE INCLUYEN LAS URLS OBTENIDAS DE CLOUDINARY ***
        Tablero: tableroResp.data.url,
        Calentamiento: calentamientoResp.data.url
      };

      // 4. Envío del Formulario a la API
      Swal.update({
        title: 'Registrando Buddy Partner...',
        text: 'Cargando datos en la base de datos.',
      });

      const response = await axios.post(
        `${BUDDY_API_URL}/BuddyPartner`,
        payload
      );

      Swal.close();

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "¡Registro Exitoso!",
          text: response.data.message, // Mostrar el mensaje de éxito del backend
        }).then(() => window.location.reload());
      }
    } catch (error) {
      Swal.close();
      console.error("Error en el proceso de registro:", error);

      // Manejo de errores específicos
      let msg = "Ocurrió un error desconocido durante el registro.";
      if (error.message.includes("Error al subir")) {
        msg = error.message;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message; // Mensaje de error del backend
      }

      Swal.fire("Error", msg, "error");
    }
  };

  // ========================================================
  // 📌 FORMULARIO (JSX)
  // ========================================================
  return (
    <div
      className="container mt-5 p-5 shadow rounded-5"
      style={{ maxWidth: "800px", backgroundColor: "#ffffff" }}
    >
      <h2 className="text-center mb-4">Formulario Buddy 2: En Proceso/Finalización</h2>

      <form className="row g-3" onSubmit={handleSubmit}>

        {/* --- DATOS GENERALES --- */}
        <div className="col-12"><h4 className="text-center">Datos de la Jornada</h4></div>

        {/* Número de Cuadrilla */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="num_cuadrilla" className="form-label">
            Número de Cuadrilla <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="num_cuadrilla"
            name="num_cuadrilla"
            value={Formulario.num_cuadrilla}
            onChange={handleInputChange}
            inputMode="numeric"
            pattern="[0-9]*"
            required
            placeholder="Solo números"
          />
          <small className="form-text text-muted">Debe ser solo números.</small>
        </div>

        {/* Hora Buddy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Hora_buddy" className="form-label">
            Hora Buddy <span className="text-danger">*</span>
          </label>
          <input
            type="time"
            className="form-control"
            id="Hora_buddy"
            name="Hora_buddy"
            value={Formulario.Hora_buddy}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Fecha */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Fecha" className="form-label">
            Fecha <span className="text-danger">*</span>
          </label>
          <input
            type="date"
            className="form-control"
            id="Fecha"
            name="Fecha"
            value={Formulario.Fecha}
            onChange={handleInputChange}
            min={moment().subtract(30, "days").format("YYYY-MM-DD")}
            max={moment().format("YYYY-MM-DD")}
            required
          />
        </div>

        {/* Estado Etapa (Fijo en 'En proceso') */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Est_etapa" className="form-label">
            Estado Etapa (Fijo)
          </label>
          <input
            type="text"
            className="form-control"
            value={Formulario.Est_etapa}
            disabled
          />
        </div>

        {/* --- ESTADOS Y MOTIVOS --- */}
        <div className="col-12"><hr /> <h4 className="text-center">Estados de Seguridad</h4></div>

        {/* Estado Empleado */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Est_empl" className="form-label">
            Estado Empleado <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="Est_empl"
            name="Est_empl"
            value={Formulario.Est_empl}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Motivo Empleado (Condicional) */}
        {Formulario.Est_empl === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label htmlFor="MotivoEmp" className="form-label">
              Motivo Empleado (si es Malo) <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="MotivoEmp"
              name="MotivoEmp"
              value={Formulario.MotivoEmp}
              onChange={handleInputChange}
              placeholder="Describe el motivo del estado malo"
              required={Formulario.Est_empl === "Malo"}
              rows="2"
            />
          </div>
        )}

        {/* Estado Vehículo */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Est_vehi" className="form-label">
            Estado Vehículo <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="Est_vehi"
            name="Est_vehi"
            value={Formulario.Est_vehi}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Motivo Vehículo (Condicional) */}
        {Formulario.Est_vehi === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label htmlFor="MotivoVeh" className="form-label">
              Motivo Vehículo (si es Malo) <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="MotivoVeh"
              name="MotivoVeh"
              value={Formulario.MotivoVeh}
              onChange={handleInputChange}
              placeholder="Describe el motivo del estado malo"
              required={Formulario.Est_vehi === "Malo"}
              rows="2"
            />
          </div>
        )}

        {/* Estado Herramienta */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Est_her" className="form-label">
            Estado Herramienta <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="Est_her"
            name="Est_her"
            value={Formulario.Est_her}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Motivo Herramienta (Condicional) */}
        {Formulario.Est_her === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label htmlFor="MotivoHer" className="form-label">
              Motivo Herramienta (si es Malo) <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="MotivoHer"
              name="MotivoHer"
              value={Formulario.MotivoHer}
              onChange={handleInputChange}
              placeholder="Describe el motivo del estado malo"
              required={Formulario.Est_her === "Malo"}
              rows="2"
            />
          </div>
        )}

        {/* --- ARCHIVOS REQUERIDOS --- */}
        <div className="col-12"><hr /> <h4 className="text-center">Documentación Fotográfica</h4></div>

        {/* INPUT FILE PARA TABLERO */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="TableroFile" className="form-label">
            Imagen del Tablero <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            className="form-control"
            id="TableroFile"
            name="TableroFile"
            accept="image/*"
            onChange={(e) => setSelectedFileTablero(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* INPUT FILE PARA CALENTAMIENTO */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="CalentamientoFile" className="form-label">
            Imagen del Calentamiento <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            className="form-control"
            id="CalentamientoFile"
            name="CalentamientoFile"
            accept="image/*"
            onChange={(e) => setSelectedFileCalentamiento(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* --- BOTONES --- */}
        <div className="col-12 text-center mt-4">
          <button
            type="button"
            onClick={() => (window.location.href = "/IndexEmpleado")}
            className="btn btn-secondary me-2"
          >
            Regresar
          </button>
          <button type="submit" className="btn btn-primary ms-2">
            Confirmar Registro
          </button>
        </div>

        <style jsx>{`
          button.btn-primary {
            background-color: #007bff; 
            border-color: #007bff;
          }
          button.btn-primary:hover {
            background-color: #0056b3; 
            border-color: #004085;
          }
        `}</style>
      </form>
    </div>
  );
}