// navigationAdminInjsx/BarraNavEmpleado.jsx
import React from 'react';
import BarraBase from './BarraBase';


export default function BarraNavEmpleado() {
    // Para empleados: solo cerrar sesión (puedes agregar más enlaces después)
    const enlacesEmpleado = [
        // Ejemplo si quieres agregar algo en el futuro:
        // { href: '/mis-datos', label: 'Mis Datos' },
        // { href: '/mis-reportes', label: 'Mis Reportes' },
    ];

    return <BarraBase titulo="Usuario" enlaces={enlacesEmpleado} />;
}