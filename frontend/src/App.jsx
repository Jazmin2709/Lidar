import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './paginas/Dashboard';
import BarraNavAdmin from './navigation/BarraNavAdmin';
import PagInicio from './paginas/PagInicio';
import BarraNavInicio from './navigation/BarraNavInicio';
import BarraNavBuddy1 from './navigation/BarraNavBuddy1';
import BarraNavBuddy2 from './navigation/BarraNavBuddy2'; 
import BarraNavBuddy3 from './navigation/BarraNavBuddy3';
import Registrar from './paginas/Registrar';
import Buddy1Page from './paginas/Buddy1Page'; 
import Buddy2Page from './paginas/Buddy2Page';
import Buddy3Page from './paginas/Buddy3Page';
import Login from './paginas/Login';
import RoutePrivate from "./componentes/RoutePrivate";
import Fotter from './navigation/Fotter';

function App() {
  return (
    <div>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><BarraNavInicio /><PagInicio /></>} />
          <Route path="/buddy1/*" element={<><BarraNavBuddy1 /><Buddy1Page /></>} />
          <Route path="/buddy2/*" element={<><BarraNavBuddy2 /><Buddy2Page /></>} />
          <Route path="/buddy3/*" element={<><BarraNavBuddy3 /><Buddy3Page /></>} />
          
          <Route path="/Registrar" element={<><BarraNavInicio /><Registrar /></>} />
          <Route path="/Login" element={<><BarraNavInicio /><Login /></>} />

          {/* RUTAS PRIVADAS */}
          <Route element={<RoutePrivate />}>
            <Route path="/Dashboard" element={ <><BarraNavAdmin /><Dashboard /></>} />
          </Route>

        </Routes>
      </BrowserRouter>
      <Fotter />
    </div>
  );
}

export default App;