// Importamos React
import React from 'react';

// Importamos componentes de React Router para manejar rutas en la aplicación
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos las páginas públicas y privadas
import Dashboard from './paginas/Dashboard';
import PagInicio from './paginas/PagInicio';
import Registrar from './paginas/Registrar';
import EmpleadosCompleto from './paginas/EmpleadosCompleto';
import Buddy1Page from './paginas/Buddy1Page';
import Buddy2Page from './paginas/Buddy2Page';
import Buddy3Page from './paginas/Buddy3Page';
import Reportes from './paginas/Reportes';
import Login from './paginas/Login';
import Lidar from './paginas/Lidar';
import QuienesSomos from './paginas/QuienesSomos';
import EnviarCorreo from './paginas/EnviarCorreo';
import RecuperarContraseña from './paginas/RecuperarContraseña';

// Importamos componentes para controlar el acceso a rutas
import RoutePrivate from "./componentes/RoutePrivate"; // Rutas privadas (requieren autenticación)
import RoutePublic from './componentes/RoutePublic';   // Rutas públicas (sin autenticación)

// Importamos layouts según el tipo de usuario
import DefaultLayout from './componentes/DefaultLayout';       // Layout general para rutas públicas
import AdminLayout from './componentes/AdminLayout';           // Layout para administrador
import SupervisorLayout from './componentes/SupervisorLayout'; // Layout para supervisor
import EmpleadoLayoutUnificado from './componentes/EmpleadoLayoutUnificado';     // Layout para empleado

// Importamos estilos CSS
import './css/styles.css';

// Componente de carga para rutas no encontradas
import Loader from './componentes/Loader';

// Importamos el chatbot (con ruta relativa correcta ✅)
import ChatBotComponent from '././componentes/ChatBot';

// Componente principal de la aplicación
function App() {
  return (
    // Encapsulamos toda la app con BrowserRouter para habilitar el enrutamiento
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route element={<RoutePublic />}>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<PagInicio />} />
            <Route path="*" element={<Loader />} /> {/* Ruta por defecto si no se encuentra otra */}
            <Route path="/Login" element={<Login />} />
            <Route path="/Lidar" element={<Lidar />} />
            <Route path="/QuienesSomos" element={<QuienesSomos />} />
            <Route path="/EnviarCorreo" element={<EnviarCorreo />} />
            <Route path="/Registrar" element={<Registrar />} />
            <Route path='/RecuperarContraseña' element={<RecuperarContraseña />} />
          </Route>
        </Route>

        {/* RUTAS PRIVADAS */}

        {/* ADMINISTRADOR */}
        <Route element={<RoutePrivate requiredRole={3} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/Reportes" element={<Reportes />} />
            <Route path="/admin/empleados/" element={<EmpleadosCompleto />} />
          </Route>
        </Route>

        {/* SUPERVISOR */}
        <Route element={<RoutePrivate requiredRole={1} />}>
          <Route element={<SupervisorLayout />}>
            <Route path="/supervisor/dashboard" element={<Dashboard />} />
            <Route path="/supervisor/Reportes" element={<Reportes />} />
          </Route>
        </Route>

        {/* EMPLEADO */}
        <Route element={<RoutePrivate requiredRole={2} />}>
          <Route element={<EmpleadoLayoutUnificado />}>
            <Route path="/IndexEmpleado" element={null} />
            <Route path="/BuddyPartner1/" element={<Buddy1Page />} />
            <Route path="/BuddyPartner2/" element={<Buddy2Page />} />
            <Route path="/BuddyPartner3/" element={<Buddy3Page />} />
            <Route path="/Registrar" element={<Registrar />} />
          </Route>
        </Route>
      </Routes>

      {/* Chatbot siempre visible en la app */}
      <ChatBotComponent />
    </BrowserRouter>
  );
}

// Exportamos el componente App para que pueda ser usado por React
export default App;