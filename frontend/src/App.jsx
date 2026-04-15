// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

// Páginas
import PagInicio from './paginas/PagInicio';
import Dashboard from './paginas/Dashboard';
import Empleados from './paginas/Empleados';
import Reportes from './paginas/Reportes';
import IndexEmpleado from './paginas/IndexEmpleado';
import EnviarCorreo from './paginas/EnviarCorreo';
import RecuperarContraseña from './paginas/RecuperarContraseña';
import BuddyFormulario from './paginas/BuddyFormulario.jsx';
import Asistencia from './paginas/Asistencia';
import GestionCuadrillas from './paginas/GestionCuadrillas';
import MiCuadrilla from './paginas/MiCuadrilla';

// Componentes de rutas y layouts
import RoutePrivate from './componentes/RoutePrivate';
import RoutePublic from './componentes/RoutePublic';
import DefaultLayout from './componentes/DefaultLayout';
import AdminLayout from './componentes/AdminLayout';
import SupervisorLayout from './componentes/SupervisorLayout';
import EmpleadoLayout from './componentes/EmpleadoLayout';

// Otros
import Loader from './componentes/Loader';
import ChatBotComponent from './componentes/ChatBot';

// Estilos
import './css/styles.css';

// Constantes para roles
const ROLES = {
  ADMIN: 3,
  SUPERVISOR: 1,
  EMPLEADO: 2,
};

// Wrapper para la ruta dinámica /buddy/:number
function BuddyPageWrapper() {
  const { number } = useParams();
  const partnerNum = Number(number);

  if (isNaN(partnerNum) || ![1, 2, 3].includes(partnerNum)) {
    return (
      <div className="text-center mt-5 pt-5">
        <h3>Buddy Partner no encontrado</h3>
        <p>El número ingresado no es válido (debe ser 1, 2 o 3).</p>
        <a href="/IndexEmpleado" className="btn btn-primary mt-3">Volver al menú de empleado</a>
      </div>
    );
  }

  return <BuddyFormulario partnerNumber={partnerNum} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas - solo la principal y recuperación */}
        <Route element={<RoutePublic />}>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<PagInicio />} />
            
            {/* 404 para rutas no encontradas */}
            <Route path="*" element={<Loader />} />
          </Route>
        </Route>

        {/* Rutas privadas - ADMINISTRADOR */}
        <Route element={<RoutePrivate requiredRole={ROLES.ADMIN} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/Reportes" element={<Reportes />} />
            <Route path="/admin/empleados/" element={<Empleados />} />
          </Route>
        </Route>

        {/* Rutas privadas - SUPERVISOR */}
        <Route element={<RoutePrivate requiredRole={ROLES.SUPERVISOR} />}>
          <Route element={<SupervisorLayout />}>
            <Route path="/supervisor/dashboard" element={<Dashboard />} />
            <Route path="/supervisor/Reportes" element={<Reportes />} />
            <Route path="/supervisor/cuadrillas" element={<GestionCuadrillas />} />
          </Route>
        </Route>

        {/* Rutas privadas - EMPLEADO */}
        <Route element={<RoutePrivate requiredRole={ROLES.EMPLEADO} />}>
          <Route element={<EmpleadoLayout />}>
            <Route path="/IndexEmpleado/" element={<IndexEmpleado />} />

            {/* Ruta dinámica para TODOS los Buddys */}
            <Route path="/buddy/:number" element={<BuddyPageWrapper />} />
            
            {/* Nuevas rutas de asistencia y cuadrilla */}
            <Route path="/asistencia" element={<Asistencia />} />
            <Route path="/mi-cuadrilla" element={<MiCuadrilla />} />
          </Route>
        </Route>
      </Routes>

      {/* Chatbot siempre visible */}
      <ChatBotComponent />
    </BrowserRouter>
  );
}

export default App;