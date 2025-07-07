import React from "react";
import { Outlet } from 'react-router-dom';
import BarraNavSupervisor from "../navigation/BarraNavSupervisor";

export default function SupervisorLayout() {
    return (
        <div className=''>
            <BarraNavSupervisor />
            <div className="min-vh-100 mt-5">
                {<Outlet />}
            </div>
        </div>
    );
};