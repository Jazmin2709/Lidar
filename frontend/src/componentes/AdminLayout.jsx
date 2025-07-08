import React from "react";
import { Outlet } from 'react-router-dom';
import BarraNavAdmin from "../navigation/BarraNavAdmin";
import Footer from "./Footer";

export default function AdminLayout() {
    return (
        <div className=''>
            <BarraNavAdmin />
            <div className="min-vh-100 mt-5">
                {<Outlet />}
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};