import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './paginas/Dashboard';
import PagInicio from './paginas/PagInicio';
import Registrar from './paginas/Registrar';
import Buddy1Page from './paginas/Buddy1Page';
import Buddy2Page from './paginas/Buddy2Page';
import Buddy3Page from './paginas/Buddy3Page';
import Login from './paginas/Login';
import RoutePrivate from "./componentes/RoutePrivate";
import './css/styles.css';
import Lidar from './paginas/Lidar';
import QuienesSomos from './paginas/QuienesSomos';
import EnviarCorreo from './paginas/EnviarCorreo';
import RecuperarContraseña from './paginas/RecuperarContraseña';
import DefaultLayout from './componentes/DefaultLayout';
import AdminLayout from './componentes/AdminLayout';
import EmpleadoLayout from './componentes/EmpleadoLayout';
import IndexEmpleado from './paginas/IndexEmpleado';
import RoutePublic from './componentes/RoutePublic';
import Loader from './componentes/Loader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PUBLICAS */}
        <Route element={<RoutePublic />}>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<PagInicio />} />
            <Route path="*" element={<Loader />} />
            <Route path="/Registrar" element={<Registrar />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Lidar" element={<Lidar />} />
            <Route path="/QuienesSomos" element={<QuienesSomos />} />
            <Route path="/EnviarCorreo" element={<EnviarCorreo />} />
            <Route path='/RecuperarContraseña' element={<RecuperarContraseña />} />
          </Route>
        </Route>

        {/* RUTAS PRIVADAS */}

        {/* RUTAS ADMIN */}
        <Route element={<RoutePrivate requiredRole={1} />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* RUTAS EMPLEADO */}
        <Route element={<RoutePrivate requiredRole={2} />}>
          <Route element={<EmpleadoLayout />}>
            <Route path="/IndexEmpleado/" element={<IndexEmpleado />} />
            <Route path="/BuddyPartner1/" element={<Buddy1Page />} />
            <Route path="/BuddyPartner2/" element={<Buddy2Page />} />
            <Route path="/BuddyPartner3/" element={<Buddy3Page />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;