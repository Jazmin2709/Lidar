import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

// 🚧 Configuración centralizada de la URL de la API
const API_URL = process.env.API_URL || "https://lidar-cush.onrender.com/api";
const BUDDY_API_URL = `${API_URL}/buddy`;

export default function Buddy1Page() {
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
    Est_etapa: "Inicio", // Valor fijo para el inicio
    Est_her: "",
    MotivoEmp: "",
    MotivoVeh: "",
    MotivoHer: "",
    // ELIMINAMOS Calentamiento y Tablero si no se usan en Buddy 1
    Calentamiento: "", // Asumimos que se mantiene como campo opcional o se completará después
    Tipo: 1, // Valor fijo para Buddy 1
    id_empleado: id_empleado, // Asociar con el empleado logueado
  });

  // *** ESTADOS PARA LOS ARCHIVOS A SUBIR ***
  const [carnetFile, setCarnetFile] = useState(null);
  const [tarjetaVidaFile, setTarjetaVidaFile] = useState(null);

  // ========================================================
  // ⚙️ FUNCIONES AUXILIARES
  // ========================================================
  const onlyDigits = (v) => v.replace(/[^\d]/g, "");
  const onlyLetters = (v) =>
    v.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "num_cuadrilla") {
      newValue = onlyDigits(value);
    }

    // Si es un campo de Motivo, aplicamos filtro de letras
    if (["MotivoEmp", "MotivoVeh", "MotivoHer"].includes(name)) {
      newValue = onlyLetters(value);
    }

    setFormulario((prev) => ({ ...prev, [name]: newValue }));
  };

  // ========================================================
  // ☁️ SUBIR IMAGEN A CLOUDINARY (función reusable)
  // ========================================================
  /**
   * Sube un archivo al backend para ser procesado y guardado en Cloudinary.
   * @param {File} file - El archivo a subir (e.g., carnetFile).
   * @param {string} presetName - El nombre del preset de Cloudinary.
   * @param {string} publicId - El ID público para nombrar el archivo.
   * @returns {Promise<object>} La respuesta de la API con la URL de la imagen.
   */
  const uploadImage = async (file, presetName, publicId) => {
    const formData = new FormData();
    // 'foto' debe coincidir con el campo esperado por el middleware del backend (upload.single('foto'))
    formData.append("foto", file);
    formData.append("upload_preset", presetName);
    formData.append("public_id", publicId);

    // Se asume que el endpoint de subida de imágenes es: API_URL/imagenes/subir
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
    // Validación general de ID de empleado
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
    const motivoPattern = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,}$/; // Mínimo 3 letras

    if (Formulario.Est_empl === "Malo" && !motivoPattern.test(Formulario.MotivoEmp)) {
      Swal.fire("Motivo inválido", "El motivo del empleado debe tener al menos 3 letras y solo puede contener letras y espacios.", "error");
      return;
    }
    if (Formulario.Est_vehi === "Malo" && !motivoPattern.test(Formulario.MotivoVeh)) {
      Swal.fire("Motivo inválido", "El motivo del vehículo debe tener al menos 3 letras y solo puede contener letras y espacios.", "error");
      return;
    }
    if (Formulario.Est_her === "Malo" && !motivoPattern.test(Formulario.MotivoHer)) {
      Swal.fire("Motivo inválido", "El motivo de la herramienta debe tener al menos 3 letras y solo puede contener letras y espacios.", "error");
      return;
    }

    // Validación de fecha (no futura y no muy antigua)
    if (moment(Formulario.Fecha).isAfter(moment(), "day")) {
      Swal.fire("Fecha inválida", "La fecha no puede ser futura.", "error");
      return;
    }

    // Validación de Archivos
    if (!carnetFile) {
      Swal.fire("Requerido", "Debes seleccionar una imagen para el Carnet.", "warning");
      return;
    }
    if (!tarjetaVidaFile) {
      Swal.fire("Requerido", "Debes seleccionar una imagen para la Tarjeta Vida.", "warning");
      return;
    }

    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: 'Subiendo documentos...',
        text: 'Por favor, espera mientras se cargan las imágenes (paso 1 de 2).',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 2. Subida de Documentos (Carnet y Tarjeta Vida)
      const timestamp = Date.now();

      // Subida del Carnet
      const carnetId = `carnet_${id_empleado}_${timestamp}`;
      const carnetResp = await uploadImage(carnetFile, "Carnet", carnetId);
      // Validar subida
      if (!carnetResp.data || !carnetResp.data.url) throw new Error("Error al subir imagen de Carnet. Respuesta del servidor incompleta.");

      // Actualizar alerta
      Swal.update({
        text: 'Cargando Tarjeta Vida (paso 2 de 2).',
      });

      // Subida de Tarjeta Vida
      const tarjetaVidaId = `tarjeta_vida_${id_empleado}_${timestamp + 1}`;
      const tarjetaVidaResp = await uploadImage(tarjetaVidaFile, "TarjetaVida", tarjetaVidaId);
      // Validar subida
      if (!tarjetaVidaResp.data || !tarjetaVidaResp.data.url) throw new Error("Error al subir imagen de Tarjeta Vida. Respuesta del servidor incompleta.");


      // 3. Creación del Payload con URLs
      const payload = {
        ...Formulario,
        // *** SE INCLUYEN LAS URLS OBTENIDAS DE CLOUDINARY ***
        Carnet: carnetResp.data.url,
        TarjetaVida: tarjetaVidaResp.data.url
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
      <h2 className="text-center mb-4">Formulario Buddy 1: Inicio de Jornada</h2>

      <form className="row g-3" onSubmit={handleSubmit}>

        {/* --- DATOS GENERALES --- */}

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

        {/* Fecha (Solo lectura de momento) */}
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
          // Deshabilitar si se quiere forzar la fecha actual
          // disabled 
          />
        </div>

        {/* Estado Etapa (Fijo en 'Inicio') */}
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

        {/* INPUT FILE PARA CARNET */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="CarnetFile" className="form-label">
            Imagen del Carnet <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            className="form-control"
            id="CarnetFile"
            name="CarnetFile"
            accept="image/*"
            onChange={(e) => setCarnetFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* INPUT FILE PARA TARJETA VIDA */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="TarjetaVidaFile" className="form-label">
            Imagen de la Tarjeta Vida <span className="text-danger">*</span>
          </label>
          <input
            type="file"
            className="form-control"
            id="TarjetaVidaFile"
            name="TarjetaVidaFile"
            accept="image/*"
            onChange={(e) => setTarjetaVidaFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        {/* *** SE ELIMINA EL APARTADO DE IMAGEN DEL TABLERO (si no es relevante para el Buddy 1) *** */}

        {/* --- BOTONES --- */}
        <div className="col-12 text-center mt-4">
          <button
            type="button"
            onClick={() => (window.location.href = "/IndexEmpleado")}
            className="btn btn-secondary me-2" // Cambiado a secondary para diferenciar de Confirmar
          >
            Regresar
          </button>
          <button type="submit" className="btn btn-primary ms-2">
            Confirmar Registro
          </button>
        </div>

        <style jsx>{`
          button.btn-primary {
            background-color: #007bff; /* Un azul estándar */
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