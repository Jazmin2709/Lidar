import React from 'react';
import BarraBase from './BarraBase';

export default function BarraNavSupervisor() {
    const enlacesSupervisor = [
        { href: '/supervisor/dashboard/', label: 'Dashboard' },
        { href: '/supervisor/reportes/', label: 'Mis Reportes' },
        // agrega los que necesites
    ];

    return <BarraBase titulo="Supervisor" enlaces={enlacesSupervisor} />;
}