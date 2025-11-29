// Importa los hooks de React y librerías externas necesarias
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

// 🚧 Configuración centralizada de la URL de la API
const API_URL = "http://localhost:3000/api";
const BUDDY_API_URL = `${API_URL}/buddy`;

// Componente principal de la página Buddy 3
export default function Buddy3Page() {
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
    if (!id_empleado) return;

    // Verifica si hay Buddys de jornadas anteriores sin completar
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
  }, [id_empleado]);

  // ========================================================
  // 📌 ESTADOS DEL FORMULARIO
  // ========================================================
  const [Formulario, setFormulario] = useState({
    num_cuadrilla: "",
    Hora_buddy: moment().format("HH:mm"),
    Est_empl: "",
    Est_vehi: "",
    // 🚫 Carnet y TarjetaVida NO están en el UI, pero se mantienen con valor por defecto
    // en el estado si el backend requiere las claves.
    Carnet: "",
    TarjetaVida: "",
    Fecha: moment().format("YYYY-MM-DD"),
    Est_etapa: "Finalizó", // Valor fijo para el cierre
    Est_her: "",
    MotivoEmp: "",
    MotivoVeh: "",
    MotivoHer: "",
    Tablero: "",       // Sin imagen
    Calentamiento: "", // Sin imagen
    Tipo: 3, // Valor fijo para Buddy 3
    id_empleado: id_empleado,
  });

  // ========================================================
  // ⚙️ FUNCIONES AUXILIARES
  // ========================================================
  const onlyDigits = (v) => v.replace(/[^\d]/g, "");

  // Patrón para Motivos (letras, números, espacios, puntos, comas, guiones, paréntesis)
  const motivoPatternFilter = (v) => v.replace(/[^a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s.,()-]/g, "");


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "num_cuadrilla") {
      newValue = onlyDigits(value);
    }

    // Si es un campo de Motivo, aplicamos filtro flexible
    if (["MotivoEmp", "MotivoVeh", "MotivoHer"].includes(name)) {
      newValue = motivoPatternFilter(value);
    }

    setFormulario((prev) => ({ ...prev, [name]: newValue }));
  };


  // ========================================================
  // 🚀 SUBMIT DEL FORMULARIO
  // ========================================================
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Validaciones
    if (!id_empleado) {
      Swal.fire("Error de Sesión", "No se pudo identificar al empleado. Intenta iniciar sesión nuevamente.", "error");
      return;
    }

    if (!/^\d+$/.test(Formulario.num_cuadrilla)) {
      Swal.fire("Número inválido", "El número de cuadrilla debe contener solo números.", "error");
      return;
    }

    // Validación de fecha (no futura)
    if (moment(Formulario.Fecha).isAfter(moment(), "day")) {
      Swal.fire("Fecha inválida", "La fecha no puede ser futura.", "error");
      return;
    }

    // Validaciones de Motivos condicionales (Mínimo 3 caracteres)
    const motivoPattern = /^[a-zA-Z0-9ÁÉÍÓÚáéíóúÑñ\s.,()-]{3,}$/;

    if (Formulario.Est_empl === "Malo" && !motivoPattern.test(Formulario.MotivoEmp)) {
      Swal.fire("Motivo inválido", "El motivo del empleado debe tener al menos 3 caracteres y solo puede contener letras, números y signos básicos.", "error");
      return;
    }
    if (Formulario.Est_vehi === "Malo" && !motivoPattern.test(Formulario.MotivoVeh)) {
      Swal.fire("Motivo inválido", "El motivo del vehículo debe tener al menos 3 caracteres y solo puede contener letras, números y signos básicos.", "error");
      return;
    }
    if (Formulario.Est_her === "Malo" && !motivoPattern.test(Formulario.MotivoHer)) {
      Swal.fire("Motivo inválido", "El motivo de la herramienta debe tener al menos 3 caracteres y solo puede contener letras, números y signos básicos.", "error");
      return;
    }

    // 2. Creación del Payload
    const payload = {
      ...Formulario,
      // Aseguramos que los campos no requeridos estén vacíos (o "0" / false si el backend lo requiere)
      Carnet: "0",       // Valor por defecto ya que no se pregunta en este Buddy
      TarjetaVida: "0", // Valor por defecto ya que no se pregunta en este Buddy
      Calentamiento: "", // Sin URL de imagen
      Tablero: "",       // Sin URL de imagen
    };

    try {
      // Mostrar alerta de carga
      Swal.fire({
        title: 'Registrando Buddy Partner...',
        text: 'Cargando datos en la base de datos.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // 3. Envío del Formulario a la API
      const response = await axios.post(
        `${BUDDY_API_URL}/BuddyPartner`,
        payload
      );

      Swal.close();

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "¡Registro Exitoso!",
          text: response.data.message,
        }).then(() => window.location.reload());
      }
    } catch (error) {
      Swal.close();
      console.error("Error en el proceso de registro:", error);

      let msg = "Ocurrió un error desconocido durante el registro.";
      if (error.response?.data?.message) {
        msg = error.response.data.message;
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
      <h2 className="text-center mb-4">Formulario Buddy 3: Cierre de Jornada</h2>

      <form className="row g-3" onSubmit={handleSubmit}>

        {/* --- DATOS GENERALES --- */}
        <div className="col-12"><h4 className="text-center">Datos de Cierre</h4></div>
        <hr />

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
          <div className="form-text">Debe ser el mismo de la apertura.</div>
        </div>

        {/* Hora Buddy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Hora_buddy" className="form-label">
            Hora de Cierre <span className="text-danger">*</span>
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

        {/* Estado Etapa (Fijo en 'Finalizó') */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label htmlFor="Est_etapa" className="form-label">
            Etapa
          </label>
          <input
            type="text"
            className="form-control"
            value={Formulario.Est_etapa}
            disabled
          />
        </div>

        {/* 🚫 SE ELIMINARON LOS CAMPOS DE CARNET Y TARJETA VIDA DE LA INTERFAZ */}

        {/* --- ESTADOS Y MOTIVOS --- */}
        <div className="col-12"><hr /> <h4 className="text-center">Estados de Seguridad (Cierre)</h4></div>

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
              placeholder="Describa el motivo del estado malo"
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
              placeholder="Describa el motivo del estado malo"
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
              placeholder="Describa el motivo del estado malo"
              required={Formulario.Est_her === "Malo"}
              rows="2"
            />
          </div>
        )}

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