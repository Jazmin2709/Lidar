// navigationAdminInjsx/BarraNavAdmin.jsx
import React from 'react';
import BarraBase from './BarraBase';


export default function BarraNavAdmin() {
    const enlacesAdmin = [
        { href: '/admin/dashboard/', label: 'Dashboard' },
        { href: '/admin/reportes/', label: 'Reportes' },
        { href: '/admin/empleados/', label: 'Empleados' },
    ];

    return <BarraBase titulo="Administrador" enlaces={enlacesAdmin} />;
}