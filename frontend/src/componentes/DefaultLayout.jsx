import React from "react";
import BarraNavInicio from "../navigation/BarraNavInicio";
import { Outlet } from 'react-router-dom';
import Footer from "./Footer";

export default function DefaultLayout() {
    return (
        <div className=''>
            <BarraNavInicio />
            <div className="min-vh-100 mt-5">
                {<Outlet />}
            </div>
            <Footer />
        </div>
    );
};