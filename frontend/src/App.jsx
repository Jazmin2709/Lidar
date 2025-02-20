import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './paginas/Dashboard';
import BarraNav from './navigation/BarraNav';
import PagInicio from './paginas/PagInicio';

function App() {

  return (
    <div>
      <BarraNav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PagInicio />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
