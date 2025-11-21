import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3000/api";

export default function Buddy3Page() {
  const token = localStorage.getItem("token");
  const decoded_token = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const id_empleado = decoded_token ? decoded_token.id : null;

  const [Formulario, setFormulario] = useState({
    num_cuadrilla: "",
    Hora_buddy: "",
    Est_empl: "",
    Est_vehi: "",
    Carnet: "",
    TarjetaVida: "",
    Fecha: moment().format("YYYY-MM-DD"),
    Est_etapa: "Finalizó",
    Est_her: "",
    MotivoEmp: "",
    MotivoVeh: "",
    MotivoHer: "",
    Tablero: "",
    Calentamiento: "",
    Tipo: 3,
    id_empleado: id_empleado,
  });

  // Imagenes
  const [selectedFileTablero, setSelectedFileTablero] = useState(null);
  const [selectedFileCalentamiento, setSelectedFileCalentamiento] = useState(null);

  // -------------------------------
  // 🔔 ALERTA DE BUDDY PENDIENTE
  // -------------------------------
  useEffect(() => {
    const verificarPendiente = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/buddy/validarPendiente/${id_empleado}`
        );

        if (data.pendiente) {
          Swal.fire({
            icon: "warning",
            title: "Tienes un Buddy pendiente",
            text: "Debes completar el Buddy antes de continuar.",
            confirmButtonText: "Entendido",
          });
        }
      } catch (error) {
        console.error("Error verificando pendiente:", error);
      }
    };

    if (id_empleado) verificarPendiente();
  }, [id_empleado]);

  // -------------------------------
  // SUBIR IMAGEN
  // -------------------------------
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

  // -------------------------------
  // ENVIAR FORMULARIO
  // -------------------------------
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (moment(Formulario.Fecha).isAfter(moment(), "day")) {
      Swal.fire({
        icon: "error",
        title: "Fecha inválida",
        text: "La fecha no puede ser futura.",
      });
      return;
    }

    try {
      if (!selectedFileTablero || !selectedFileCalentamiento) {
        Swal.fire("Faltan imágenes", "Debes subir tablero y calentamiento.", "warning");
        return;
      }

      const publicIdBase = `${id_empleado}_${Date.now()}`;

      const urlTablero = await uploadImage(
        selectedFileTablero,
        "tableros",
        `tablero_${publicIdBase}`
      );

      const urlCal = await uploadImage(
        selectedFileCalentamiento,
        "calentamientos",
        `cal_${publicIdBase}`
      );

      const payload = { ...Formulario, Tablero: urlTablero, Calentamiento: urlCal };

      const response = await axios.post(`${API_URL}/buddy/BuddyPartner`, payload);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          text: response.data.results,
        }).then(() => window.location.reload());
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

  // -------------------------------
  // INPUT CHANGE
  // -------------------------------
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    let newValue = value;

    if (name === "num_cuadrilla") {
      newValue = value.replace(/[^0-9]/g, "");
    }

    if (["MotivoEmp", "MotivoVeh", "MotivoHer"].includes(name)) {
      newValue = value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }

    setFormulario((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  return (
    <div className="container mt-5 p-5 shadow rounded-5" style={{ maxWidth: "800px", backgroundColor: "#ffffff" }}>
      <h2 className="text-center mb-4">Formulario Buddy 3</h2>

      <form className="row g-3" onSubmit={handleSubmit}>

        {/* Número de Cuadrilla */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Número de Cuadrilla</label>
          <input type="text" className="form-control"
            name="num_cuadrilla" value={Formulario.num_cuadrilla}
            onChange={handleInputChange} required />
        </div>

        {/* Hora */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Hora Buddy</label>
          <input type="time" className="form-control"
            name="Hora_buddy" value={Formulario.Hora_buddy}
            onChange={handleInputChange} required />
        </div>

        {/* Estado Empleado */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Empleado</label>
          <select className="form-select" name="Est_empl" value={Formulario.Est_empl} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Estado Vehículo */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Vehículo</label>
          <select className="form-select" name="Est_vehi" value={Formulario.Est_vehi} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {/* Motivo Empleado */}
        {Formulario.Est_empl === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label className="form-label">Motivo empleado</label>
            <textarea className="form-control" name="MotivoEmp"
              value={Formulario.MotivoEmp} onChange={handleInputChange} required />
          </div>
        )}

        {/* Motivo Vehículo */}
        {Formulario.Est_vehi === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label className="form-label">Motivo vehículo</label>
            <textarea className="form-control" name="MotivoVeh"
              value={Formulario.MotivoVeh} onChange={handleInputChange} required />
          </div>
        )}

        {/* Carnet */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Carnet</label>
          <select className="form-select" name="Carnet" value={Formulario.Carnet} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Tarjeta Vida */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Tarjeta Vida</label>
          <select className="form-select" name="TarjetaVida" value={Formulario.TarjetaVida} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="1">Sí</option>
            <option value="0">No</option>
          </select>
        </div>

        {/* Imagenes */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Imagen Tablero</label>
          <input type="file" className="form-control" accept="image/*"
            onChange={(e) => setSelectedFileTablero(e.target.files[0])} required />
        </div>

        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Imagen Calentamiento</label>
          <input type="file" className="form-control" accept="image/*"
            onChange={(e) => setSelectedFileCalentamiento(e.target.files[0])} required />
        </div>

        {/* Fecha */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Fecha</label>
          <input type="date" className="form-control" name="Fecha"
            value={Formulario.Fecha} onChange={handleInputChange}
            min={moment().subtract(30, "days").format("YYYY-MM-DD")}
            max={moment().format("YYYY-MM-DD")} required />
        </div>

        {/* Estado Etapa */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Etapa</label>
          <select
            className="form-select"
            name="Est_etapa"
            value={Formulario.Est_etapa}
            disabled
          >
            <option value="Finalizó">Finalizó</option>
          </select>
        </div>


        {/* Estado Herramienta */}
        <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
          <label className="form-label">Estado Herramienta</label>
          <select className="form-select" name="Est_her" value={Formulario.Est_her} onChange={handleInputChange} required>
            <option value="">Seleccione una opción</option>
            <option value="Excelente">Excelente</option>
            <option value="Bueno">Bueno</option>
            <option value="Malo">Malo</option>
          </select>
        </div>

        {Formulario.Est_her === "Malo" && (
          <div className="col-md-6 mx-auto" style={{ maxWidth: "350px" }}>
            <label className="form-label">Motivo herramienta</label>
            <textarea className="form-control" name="MotivoHer"
              value={Formulario.MotivoHer} onChange={handleInputChange} required />
          </div>
        )}

        {/* Botones */}
        <div className="col-12 text-center mt-4">
          <button type="button" className="btn btn-primary me-2"
            onClick={() => (window.location.href = "/IndexEmpleado")}>
            Regresar
          </button>

          <button type="submit" className="btn btn-primary ms-2">
            Confirmar
          </button>
        </div>

      </form>
    </div>
  );
}
