import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Example from './paginas/Example'
import Dashboard from './paginas/Dashboard';
import BarraNav from './navigation/BarraNav';

function App() {

  return (
    <div>
      <BarraNav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Example />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
