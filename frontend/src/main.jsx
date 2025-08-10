// Importamos StrictMode desde la librería 'react'.
// StrictMode es una herramienta de desarrollo que ayuda a identificar problemas potenciales en la aplicación.
import { StrictMode } from 'react'

// Importamos createRoot desde 'react-dom/client'.
// Esta función se usa en React 18 o superior para crear el punto de entrada principal de la aplicación.
import { createRoot } from 'react-dom/client'

// Importamos el componente principal de la aplicación, llamado App.
import App from './App.jsx'

// Buscamos el elemento con el id 'root' en el HTML y creamos una raíz de React dentro de él.
// Luego renderizamos el componente <App /> dentro del modo estricto (StrictMode).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Renderizamos el componente principal de nuestra aplicación */}
    <App />
  </StrictMode>,
)
