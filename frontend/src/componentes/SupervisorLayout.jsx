import React from "react";
import { Outlet } from "react-router-dom";
import BarraNavSupervisor from "../navigation/BarraNavSupervisor";
import Footer from "./Footer"; // ✅ Importación activa

export default function SupervisorLayout() {
    return (
        <div className="">
            <BarraNavSupervisor />
            <div className="min-vh-100 mt-5">
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
}
