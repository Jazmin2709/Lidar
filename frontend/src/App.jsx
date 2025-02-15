import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Example from './paginas/Example'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Example />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
