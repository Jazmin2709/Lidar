// Importa los hooks de React y librerías externas necesarias
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

// URL base de la API
const API_URL = "http://localhost:3000/api";

// Componente principal de la página Buddy 2
export default function Buddy2Page() {

  // --- Obtener usuario autenticado ---
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const id_empleado = decoded ? decoded.id : null;

  // --- Alerta automática de Buddy pendiente ---
  useEffect(() => {
    if (!id_empleado) return;

    axios.get(`http://localhost:3000/BuddyPartner/pending/${id_empleado}`)
      .then(res => {
        if (res.data.length > 0) {
          Swal.fire({
            icon: "warning",
            title: "Tienes Buddy Partners pendientes",
            html: `
              <p>Algunas actividades Buddy del día anterior no se completaron.</p>
              <p><b>Debes completarlas hoy.</b></p>
            `,
            confirmButtonColor: "#3085d6",
          });
        }
      })
      .catch(err => console.log(err));
  }, []);

  // --- Estado del formulario ---
  const [Formulario, setFormulario] = useState({
    num_cuadrilla: "",
    Hora_buddy: "",
    Est_empl: "",
    Est_vehi: "",
    Carnet: "",
    TarjetaVida: "",
    Fecha: moment().format("YYYY-MM-DD"),
    Est_etapa: "En proceso",
    Est_her: "",
    MotivoEmp: "",
    MotivoVeh: "",
    MotivoHer: "",
    Tablero: "",
    Calentamiento: "",
    Tipo: 2,          // <-- Tipo fijo (NO editable)
    id_empleado: id_empleado,
  });

  // Estados para los archivos seleccionados
  const [selectedFileTablero, setSelectedFileTablero] = useState(null);
  const [selectedFileCalentamiento, setSelectedFileCalentamiento] = useState(null);

  // --- Función para subir imágenes ---
  const uploadImage = async (file, preset, publicId) => {
    const formData = new FormData();
    formData.append("foto", file);
    formData.append("upload_preset", preset);
    formData.append("public_id", publicId);

    const response = await axios.post(`${API_URL}/imagenes/subir`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.url;
  };

  // --- Enviar formulario ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validar fecha (Tu código existente)
    // ...

    // 🔥 1. CREAR UNA COPIA DEL PAYLOAD BASE
    let payload = {
      ...Formulario,
    };

    // NOTA: Se eliminó el bloque de limpieza de Motivos, ya que los valores de Motivo solo 
    // se establecen si el Estado es "Malo" en el formulario, y se envían tal cual están en el estado.

    try {
      // Validar imágenes (Tu código existente)
      if (!selectedFileTablero || !selectedFileCalentamiento) {
        Swal.fire("Faltan imágenes", "Debes subir tablero y calentamiento.", "warning");
        return;
      }

      // Subir imágenes (Tu código existente)
      const publicIdBase = `${id_empleado || "anon"}_${Date.now()}`;
      const urlTablero = await uploadImage(
        selectedFileTablero,
        "tableros",
        `tablero_${publicIdBase}`
      );
      const urlCal = await uploadImage(
        selectedFileCalentamiento,
        "calentamientos",
        `calentamiento_${publicIdBase}`
      );

      // 🔥 3. AGREGAR URL'S AL PAYLOAD FINAL
      payload.Tablero = urlTablero;
      payload.Calentamiento = urlCal;

      // Enviar a backend
      const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, payload);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          text: response.data.results,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: error.response?.data?.message || "Error desconocido",
      });
    }
  };

  // --- Manejo de inputs ---
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "num_cuadrilla" && !/^\d*$/.test(value)) return;

    // ✅ CAMBIO IMPLEMENTADO: Se relaja la validación para permitir:
    // Letras (a-zA-Z), números (0-9), espacios (\s), puntos (.), comas (,), guiones (-), y paréntesis (()).
    if (
      ["MotivoEmp", "MotivoVeh", "MotivoHer"].includes(name) &&
      !/^[a-zA-Z0-9\s.,()-]*$/.test(value)
    )
      return;

    setFormulario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // --- Render ---
  return (
    <div
      className="container mt-5 p-5 shadow rounded-5"
      style={{ maxWidth: "800px", backgroundColor: "#ffffff" }}
    >
      <h2 className="text-center mb-4">Formulario Buddy 2</h2>

      <form className="row g-3" onSubmit={handleSubmit}>

        {/* Número de Cuadrilla */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Número de Cuadrilla</label>
          <input
            type="text"
            className="form-control"
            name="num_cuadrilla"
            value={Formulario.num_cuadrilla}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Hora Buddy */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Hora Buddy</label>
          <input
            type="time"
            className="form-control"
            name="Hora_buddy"
            value={Formulario.Hora_buddy}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Estado Empleado */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Empleado</label>
          <select
            className="form-select"
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

        {Formulario.Est_empl === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label className="form-label">Motivo empleado</label>
            <textarea
              className="form-control"
              name="MotivoEmp"
              value={Formulario.MotivoEmp}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Estado Vehículo */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Vehículo</label>
          <select
            className="form-select"
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

        {Formulario.Est_vehi === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label className="form-label">Motivo vehículo</label>
            <textarea
              className="form-control"
              name="MotivoVeh"
              value={Formulario.MotivoVeh}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Carnet */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Carnet</label>
          <select
            className="form-select"
            name="Carnet"
            value={Formulario.Carnet}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Tarjeta Vida */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Tarjeta Vida</label>
          <select
            className="form-select"
            name="TarjetaVida"
            value={Formulario.TarjetaVida}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una opción</option>
            <option value="1">Si</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Imagen Tablero */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Imagen Tablero</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setSelectedFileTablero(e.target.files[0])}
            required
          />
        </div>

        {/* Imagen Calentamiento */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Imagen Calentamiento</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setSelectedFileCalentamiento(e.target.files[0])}
            required
          />
        </div>

        {/* Fecha */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            name="Fecha"
            value={Formulario.Fecha}
            onChange={handleInputChange}
            min={moment().subtract(30, "days").format("YYYY-MM-DD")}
            max={moment().format("YYYY-MM-DD")}
            required
          />
        </div>

        {/* Estado Etapa */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Etapa</label>
          <select
            className="form-select"
            id="Est_etapa"
            name="Est_etapa"
            value="En proceso"
            disabled
          >
            <option value="En proceso">En proceso</option>
          </select>

        </div>

        {/* Estado Herramienta */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Herramienta</label>
          <select
            className="form-select"
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

        {Formulario.Est_her === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label className="form-label">Motivo herramienta</label>
            <textarea
              className="form-control"
              name="MotivoHer"
              value={Formulario.MotivoHer}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* Botones */}
        <div className="col-12 text-center mt-4">
          <button
            type="button"
            onClick={() => (window.location.href = "/IndexEmpleado")}
            className="btn btn-primary me-2"
          >
            Regresar
          </button>
          <button type="submit" className="btn btn-primary ms-2">
            Confirmar
          </button>
        </div>

        <style jsx>{`
          button.btn.btn-primary:hover {
            background-color: rgb(73, 1, 141);
          }
        `}</style>
      </form>
    </div>
  );
}
