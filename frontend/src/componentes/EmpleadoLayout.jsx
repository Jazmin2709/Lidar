import React from "react";
import { Outlet } from 'react-router-dom';
import BarraNavEmpleado from "../navigation/BarraNavEmpleado";

export default function EmpleadoLayout() {
    return (
        <div className=''>
            <BarraNavEmpleado />
            <div className="container min-vh-100 mt-5">
                {<Outlet />}
            </div>
        </div>
    );
};